
import { Prisma } from '@prisma/client'
import TriggerBase from './triggers/TriggerBase'
import UserTriggerHandler from './triggers/UserTriggerHandler'
import CarTriggerHandler from './triggers/CarTriggerHandler'

export const triggerMap = new Map<Prisma.ModelName, { new(): TriggerBase }>([
    ['User', UserTriggerHandler],
    ['Car', CarTriggerHandler],
]);

export class TriggerMaster{

    public static async runTriggers(params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>,){
        await TriggerMaster.runBeforeTriggers(params);
        const result = await next(params);
        await TriggerMaster.runAfterTriggers(params, result);
        return result;
    }

    private static async runBeforeTriggers(params: Prisma.MiddlewareParams){
        if(!params.model){
            return;
        }
        const handlerClass = triggerMap.get(params.model)
        if(!handlerClass){
            return;
        }
        const handler = new handlerClass;
        let recordsOld : Array<any> = Array.isArray(params.args?.data)? params.args?.data : [params.args?.data];
        switch(params.action){
            case('create'): case('createMany'):{
                await handler.beforeCreate(recordsOld);
                break;
            }
            case('update'): case('updateMany'):{
                await handler.beforeUpdate(recordsOld);
                break;
            }
            case('delete'): case('deleteMany'):{
                await handler.beforeDelete(recordsOld);
                break;
            }
        }
    }

    private static async runAfterTriggers(params: Prisma.MiddlewareParams, result : any){
        if(!params.model){
            return;
        }
        const handlerClass = triggerMap.get(params.model)
        if(!handlerClass){
            return;
        }
        const handler = new handlerClass;
        let recordsOld : Array<any> = Array.isArray(params.args?.data)? params.args?.data : [params.args?.data];
        let recordsNew : Array<any> = Array.isArray(result)? result : [result];
        switch(params.action){
            case('create'): case('createMany'):{
                await handler.afterCreate(recordsOld, recordsNew);
                break;
            }
            case('update'): case('updateMany'):{
                await handler.afterUpdate(recordsOld);
                break;
            }
            case('delete'): case('deleteMany'):{
                await handler.afterDelete(recordsOld);
                break;
            }
        }
    }

}
