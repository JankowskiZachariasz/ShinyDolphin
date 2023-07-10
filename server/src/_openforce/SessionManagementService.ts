import Database from './Database'
import { Session, User } from './Models'
import { ControllerUtility as CtrlUtil } from './ControllerUtility'
import UserSelector from './UserSelector'
import { TRPCError } from '@trpc/server';

export const SESSION_VALIDITY = 35 * 24 * 60 * 60 //35 days

export class SessionManagementService{

    private db : Database;

    constructor(db : Database){
        this.db = db;
    }

    public checkSession(sessions :Array<Session> | undefined, sessionId : string | undefined ) : boolean{
        if(!sessions || !sessionId){
            CtrlUtil.throwUnauthorizedException();
        }
        for(const session of sessions){
            if(session.id === sessionId && session.expires && session.expires > this.currentTimeInSeconds){
                return true;
            }
        }
        return false;
    }

    public async createInitialSession(userId : string | undefined){
        const sessionToInsert: Session = {
            _modelName: 'Session',
            deviceName: 'UNKNOWN',
            expires: this.currentTimeInSeconds + SESSION_VALIDITY,
            userId: userId,
        }
        await this.db.insert([sessionToInsert]);
        return sessionToInsert;
    }

    public async maintainSessions(sessions : Array<Session>){
        //for()
    }

    public async refreshSession(params:{sessionId :string, userId :string}) : Promise<User>  {
        let userSelector = new UserSelector(this.db);
        let retrievedUsers : Array<User> = await userSelector.selectUsersWithSessionsByIds([params.userId]);
        if(!retrievedUsers || retrievedUsers.length < 1 || !retrievedUsers[0].sessions ){
            throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        }
        let sessionToUpdate :Session = {_modelName : 'Session'};
        retrievedUsers[0].sessions.forEach(session => {
            if(session.id ===  params.sessionId){
                sessionToUpdate = session;
            }
        })
        if(!sessionToUpdate){
            throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        }
        sessionToUpdate.expires = this.currentTimeInSeconds + SESSION_VALIDITY;
        await this.db.update([sessionToUpdate]);
        this.maintainSessions(retrievedUsers[0].sessions);
        return retrievedUsers[0];
    }

    private get currentTimeInSeconds(){
        return Math.round(Date.now()/1000);
    }
    
}