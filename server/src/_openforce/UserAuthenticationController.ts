import Database from './Database'
import { User } from './Models';
import { publicProcedure, router } from '../server'
import { ControllerUtility as CtrlUtil } from './ControllerUtility';
import { z } from 'zod';
import { UserAuthenticationService } from './UserAuthenticationService';
import { UserProvisioningService } from './UserProvisioningService';
import type { Providers } from '@prisma/client'
import { ProvisionUserTokenPayload } from '../../../client/types/shared'
import { SessionManagementService } from './SessionManagementService';

export type LoginResult = {
    token : string | null,
    mfaToken: string | null,
    status: 'success' | 'pending',
}

export type LogoutResult = {
    status: 'success'
}

export const UserAuthenticationController = router({

    login: publicProcedure.input(z.object({
        email: z.string(), 
        password: z.string()
    })).mutation(async function({ input }): Promise<LoginResult> {
        try{
            return await Database.runTransaction(async (db) => {
                let authService = new UserAuthenticationService(db);
                return await authService.signIn(input)
            });
        }
        catch(e : any){CtrlUtil.handleException(e);}
    }),

    logout: CtrlUtil.anyInternalIntegrationUserProcedure.input(z.object({
        sessionId: z.string(), 
        userId: z.string() 
    })).mutation(async function({ input }): Promise<LogoutResult> {
        try{
            return await Database.runTransaction(async (db) => {
                let authService = new UserAuthenticationService(db);
                return await authService.signOut(input);
            });
        }
        catch(e : any){CtrlUtil.handleException(e);}
    }),

    provisionUserAndSession: CtrlUtil.anyInternalIntegrationUserProcedure.input(z.object({
        user: z.object({
            id : z.string().nullable(),
            email : z.string(),
            authProvider : z.string(),
            firstName : z.string(),
            lastName : z.string(),
            picture : z.string().nullable(),
        }) 
    })).mutation(async function({ input }) : Promise<User>{
        try{
            return await Database.runTransaction(async (db) => {
                let provisioningService = new UserProvisioningService(db);
                //@ts-ignore
                return await provisioningService.provisionUserAndSession(input);
            });
        }
        catch(e : any){CtrlUtil.handleException(e);}
    }),

    refreshSession: CtrlUtil.anyInternalIntegrationUserProcedure.input(z.object({
        userId : z.string(),
        sessionId : z.string()
    })).mutation(async function({ input }) : Promise<User>{
        try{
            return await Database.runTransaction(async (db) => {
                let sessionSvc = new SessionManagementService(db)
                return await sessionSvc.refreshSession(input);
            });
        }
        catch(e : any){CtrlUtil.handleException(e);}
    })
});