
import { Prisma } from '@prisma/client'
import { SObject } from './Models'
import Database from './Database';
import TriggerBase from './TriggerBase'
import UserTriggerHandler from '../triggers/UserTriggerHandler'
import CarTriggerHandler from '../triggers/CarTriggerHandler'

export const triggerMap = new Map<Prisma.ModelName, { new(): TriggerBase }>([
    ['User', UserTriggerHandler],
    ['Car', CarTriggerHandler],
]);

export class TriggerMaster{

    static async runBeforeInsert(_modelName : Prisma.ModelName, recordsNew: Array<SObject>, db: Database) : Promise<void> {
        const handlerClass = triggerMap.get(_modelName)
        if(!handlerClass){
            return;
        }
        const handler = new handlerClass;
        await handler.beforeInsert(recordsNew, db);
    }

    static async runAfterInsert(_modelName : Prisma.ModelName, recordsNew: Array<SObject>, db: Database) : Promise<void> {
        const handlerClass = triggerMap.get(_modelName)
        if(!handlerClass){
            return;
        }
        const handler = new handlerClass;
        await handler.afterInsert(recordsNew, db);
    }

    static async runBeforeUpdate(_modelName : Prisma.ModelName, recordsOld: Array<SObject>, recordsNew: Array<SObject>, db: Database) : Promise<void> {
        const handlerClass = triggerMap.get(_modelName)
        if(!handlerClass){
            return;
        }
        const handler = new handlerClass;
        await handler.beforeUpdate(recordsOld, recordsNew, db);
    }

    static async runAfterUpdate(_modelName : Prisma.ModelName, recordsOld: Array<SObject>, recordsNew: Array<SObject>, db: Database) : Promise<void> {
        const handlerClass = triggerMap.get(_modelName)
        if(!handlerClass){
            return;
        }
        const handler = new handlerClass;
        await handler.afterUpdate(recordsOld, recordsNew, db);
    }

    static async runBeforeDelete(_modelName : Prisma.ModelName, recordsOld: Array<SObject>, db: Database) : Promise<void> {
        const handlerClass = triggerMap.get(_modelName)
        if(!handlerClass){
            return;
        }
        const handler = new handlerClass;
        await handler.beforeDelete(recordsOld, db);
    }

    static async runAfterDelete(_modelName : Prisma.ModelName, recordsOld: Array<SObject>, db: Database) : Promise<void> {
        const handlerClass = triggerMap.get(_modelName)
        if(!handlerClass){
            return;
        }
        const handler = new handlerClass;
        await handler.afterDelete(recordsOld, db);
    }

}
