import * as dotenv from 'dotenv'
dotenv.config()
import { User } from './Models';
import Database from '../_openforce/Database';
import type { Providers } from '@prisma/client'
import UserSelector from './UserSelector';
import { TRPCError } from '@trpc/server';
import { INITIAL_USER_ROLE } from './UserDomain'
import { SessionManagementService } from './SessionManagementService';

export type availableProviders = Providers;

export class UserProvisioningService{

    private db : Database;

    constructor(db : Database){
        this.db = db;
    }

    public async provisionUserAndSession(params:{user :any}) : Promise<User>  {
        const sessionSvc = new SessionManagementService(this.db);
        let userSelector = new UserSelector(this.db);
        let retrievedUsers : Array<User> = await (params.user.id? (userSelector.selectUsersWithSessionsByIds([params.user.id]))
        : (userSelector.selectUsersWithSessionsByEmail(params.user.email, params.user.authProvider)));
        let userToReturn :User;
        if(retrievedUsers === null || !Array.isArray(retrievedUsers)){
            throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        }
        if(retrievedUsers.length < 1){
            //User needs to be created
            let userToInsert: User = {
                _modelName : 'User',
                role : INITIAL_USER_ROLE,
                email : params.user.email,
                authProvider : params.user.authProvider,
                firstName : params.user.firstName,
                lastName : params.user.lastName,
                picture : params.user.picture
            }
            await this.db.insert([userToInsert]);
            userToReturn = userToInsert;
        }
        else{
            userToReturn = retrievedUsers[0];
            if(userToReturn.sessions && userToReturn.sessions.length > 0){
                await sessionSvc.maintainSessions(userToReturn.sessions);
            }
        }
        
        const newSession = await sessionSvc.createInitialSession(userToReturn.id)
        userToReturn.sessions=[newSession];
        return userToReturn;
    }


}