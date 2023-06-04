
import { Prisma } from '@prisma/client'
import TriggerBase from './TriggerBase'
import UserTriggerHandler from '../triggers/UserTriggerHandler'
import CarTriggerHandler from '../triggers/CarTriggerHandler'

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
        //@ts-ignore
        let _tx :never = params.args?._tx;
        delete params.args?._tx;
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
                await handler.beforeCreate(recordsOld, _tx);
                break;
            }
            case('update'): case('updateMany'):{
                await handler.beforeUpdate(recordsOld, _tx);
                break;
            }
            case('delete'): case('deleteMany'):{
                await handler.beforeDelete(recordsOld, _tx);
                break;
            }
        }
    }

    private static async runAfterTriggers(params: Prisma.MiddlewareParams, result : any){
        //@ts-ignore
        let _tx :never = params.args?._tx;
        delete params.args?._tx;
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
                await handler.afterCreate(recordsOld, recordsNew, _tx);
                break;
            }
            case('update'): case('updateMany'):{
                await handler.afterUpdate(recordsOld, recordsNew, _tx);
                break;
            }
            case('delete'): case('deleteMany'):{
                await handler.afterDelete(recordsOld, recordsNew, _tx);
                break;
            }
        }
    }

}
