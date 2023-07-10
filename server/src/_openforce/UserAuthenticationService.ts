
import * as dotenv from 'dotenv'
dotenv.config()
import { User, Session } from './Models';
import Database from './Database';
import type { LoginResult, LogoutResult } from './UserAuthenticationController';
import type { SessionTokenPayload } from '../../../client/types/shared'
import UserSelector from './UserSelector';
import { TRPCError } from '@trpc/server';
import crypto from 'crypto'
import { UserProvisioningService } from './UserProvisioningService'
import { SessionManagementService } from './SessionManagementService';
var jwt = require('jsonwebtoken');

export const JWT_CLAIM_MFA = 'JWT_CLAIM_MFA'
export const JWT_CLAIM_AUTHENTICATED = 'JWT_CLAIM_AUTHENTICATED'

//export type 

export class UserAuthenticationService{

    private db : Database;

    constructor(db : Database){
        this.db = db;
    }

    public async signIn(params:{email: string, password: string}) :Promise<LoginResult> {

        const sessionSvc = new SessionManagementService(this.db);
        const userSelector = new UserSelector(this.db);
        const retrievedUsers : Array<User> = await userSelector.selectUsersWithSessionsByEmail(params.email, 'CREDENTIALS');
        if(retrievedUsers === null || !Array.isArray(retrievedUsers) || retrievedUsers.length !== 1){
            throw new TRPCError({code: 'UNAUTHORIZED', message: 'Invalid credentials' });
        }
        let retrievedUser = retrievedUsers[0];
        const CRYPTO_KEY = process.env.CRYPTO_KEY? process.env.CRYPTO_KEY : null;
        const CRYPTO_IV = process.env.CRYPTO_IV? process.env.CRYPTO_IV : null;
        if(!CRYPTO_KEY || !CRYPTO_IV){
            throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        }
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(CRYPTO_KEY), CRYPTO_IV);
        let encryptedUserPassword = cipher.update(params.password);
        encryptedUserPassword = Buffer.concat([encryptedUserPassword, cipher.final()]);
        const JWT_KEY_PRIVATE = process.env.JWT_KEY_PRIVATE?.replace(/\\n/g, '\n');
        if(encryptedUserPassword.toString('hex')  !== retrievedUser.password){
            throw new TRPCError({code: 'UNAUTHORIZED', message: 'Invalid credentials' });
        }
        if(retrievedUser.mfaRequired){
            const mfaToken = jwt.sign({ 
                claims: JWT_CLAIM_MFA, 
                role: '', 
                email: params.email, 
                password: params.password 
            
            }, JWT_KEY_PRIVATE, { algorithm: 'RS256', allowInsecureKeySizes: true, expiresIn: 2*60 });
            return {token: null, mfaToken, status: 'pending'};
        }
        const newSession = await sessionSvc.createInitialSession(retrievedUser.id);
        const tokenPayload : SessionTokenPayload = {
            id : retrievedUser.id,
            firstName : retrievedUser.firstName,
            lastName : retrievedUser.lastName,
            email : retrievedUser.email,
            authProvider : retrievedUser.authProvider,
            role : retrievedUser.role,
            picture : retrievedUser.picture,
            sessionId: newSession.id
        }
        if(retrievedUser.sessions && retrievedUser.sessions.length > 0){
            await sessionSvc.maintainSessions(retrievedUser.sessions);
        }
        const token = jwt.sign({ 
            claims: JWT_CLAIM_AUTHENTICATED, 
            ...tokenPayload   
        }, JWT_KEY_PRIVATE, { algorithm: 'RS256', allowInsecureKeySizes: true, expiresIn: 60*60 });
        return {token, mfaToken: null, status: 'success'};

    }

    public async signOut(params:{sessionId :string, userId :string}) :Promise<LogoutResult> {
        let userSelector = new UserSelector(this.db);
        let retrievedUsers : Array<User> = await userSelector.selectUsersWithSessionsByIds([params.userId]);
        if(!retrievedUsers || retrievedUsers.length < 1 || !retrievedUsers[0].sessions ){
            throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        }
        //@ts-ignore
        let sessionToDelete : Session = null;
        retrievedUsers[0].sessions.forEach(session => {
            if(session.id ===  params.sessionId){
                sessionToDelete = session;
            }
        })
        if(!sessionToDelete){
            throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        }
        await this.db.delete([sessionToDelete]);
        const sessionSvc = new SessionManagementService(this.db);
        await sessionSvc.maintainSessions(retrievedUsers[0].sessions);
        return {status: 'success'}
    }
    
}