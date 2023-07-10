import { TRPCError } from '@trpc/server';
import { middleware, publicProcedure } from '../server'
import Database from './Database'
import type { SessionTokenPayload } from '../../../client/types/shared';
import UserSelector from './UserSelector'
import { User } from './Models'
import { SessionManagementService } from './SessionManagementService'
var jwt = require('jsonwebtoken');

export class ControllerUtility{

    static handleException(e : any) : never {
        if(e instanceof TRPCError) throw e;
        console.error(e);
        throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
    }

    static throwUnauthorizedException() : never {
        throw new TRPCError({code: 'UNAUTHORIZED', message: 'Unauthorized' });
    }

    static anyAuthenticatedUserProcedure = publicProcedure.use( middleware( async (opts) => {
        const { ctx } = opts;
        let tokenPayload = ControllerUtility.getTokenPayload(ctx.token)
        let db = Database.connectWithoutTransaction();
        ctx.user = await this.retrieveUser(db, tokenPayload.id);
        const sessionService = new SessionManagementService(db);
        if(!sessionService.checkSession(ctx.user.sessions, tokenPayload.sessionId)){
            this.throwUnauthorizedException();
        }
        return opts.next(opts);
    }));

    /**
     * @description any token signed for a user with authProvider = 'SELF' will pass through
     */
    static anyInternalIntegrationUserProcedure = publicProcedure.use( middleware( async (opts) => {
        const { ctx } = opts;
        let tokenPayload = ControllerUtility.getTokenPayload(ctx.token)
        let db = Database.connectWithoutTransaction();
        ctx.user = await this.retrieveUser(db, tokenPayload.id);
        if(ctx.user.authProvider !== 'SELF'){
            ControllerUtility.throwUnauthorizedException();
        }
        return opts.next(opts);
    }));

    private static getTokenPayload(token? :string | null ) : SessionTokenPayload{
        if(!token){
            ControllerUtility.throwUnauthorizedException();
        }
        const JWT_KEY_PUBLIC = process.env.JWT_KEY_PUBLIC?.replace(/\\n/g, '\n');
        let tokenPayload : SessionTokenPayload;
        
        try{
            tokenPayload = jwt.verify(token, JWT_KEY_PUBLIC,  { algorithm: 'RS256', allowInsecureKeySizes: true })
        }
        catch(e){
            ControllerUtility.throwUnauthorizedException();
        }
        if(!tokenPayload){
            ControllerUtility.throwUnauthorizedException();
        }
        return tokenPayload;
    }

    private static async retrieveUser(db : Database, id? :string | null) : Promise<User>{
        if(typeof id != 'string'){
            ControllerUtility.throwUnauthorizedException();
        }
        let userSelector = new UserSelector(db);
        let users = await userSelector.selectUsersWithSessionsByIds([id])
        if(!users || users.length < 1){
            ControllerUtility.throwUnauthorizedException();
        }
        return users[0];
    }

}