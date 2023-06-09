
import postgres from 'postgres'
import { SObject } from './Models'
import { Prisma } from '@prisma/client'
import DbUtil from './DatabaseUtility'
import SObjectSelector from '../classes/SObjectSelector'
import { TriggerMaster } from './TriggerMaster'
import { TRPCError } from '@trpc/server';


if(typeof process.env.DATABASE_URL !== 'string'){
    console.error('Essential env missing!')
    process.exit(0);
}

const sql = postgres(process.env.DATABASE_URL)

export default class Database{
    
    connection : postgres.TransactionSql<{}>;
    sql = sql;
    private allSelector : SObjectSelector;

    constructor(tx : postgres.TransactionSql<{}>){
        this.connection = tx;
        this.allSelector = new SObjectSelector(this);
    }

    static async runTransaction(callback : (db : Database) => Promise<void> ){
        try{
            return await sql.begin(async sql => {
                return await callback(new Database(sql));
            })
        }
        catch(e: any){
            console.error(e);
            let message = e.message;
            throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message });
        }
    }

    async insert( records : Array<SObject>){
        let toReturn = new Map<Prisma.ModelName, postgres.RowList<postgres.Row[]>>([]);
        let mappedRecords = DbUtil.mapRecordByType(records);
        for (const _modelName of mappedRecords.keys()) {
            const preInsertRecords = mappedRecords.get(_modelName);
            if(!preInsertRecords || !preInsertRecords.length){
                continue;
            }
            await TriggerMaster.runBeforeInsert(_modelName, preInsertRecords, this);

            const rawResults = await this.connection`
                INSERT INTO ${sql.unsafe('public."' + _modelName + '"')} 
                ${sql(DbUtil.stripTechnicalFields(preInsertRecords))}
                RETURNING *`

            const postInserRecords = DbUtil.appendTechnicalFields(rawResults, _modelName);
            toReturn.set(_modelName, rawResults);
            await TriggerMaster.runAfterInsert(_modelName, postInserRecords, this);
            DbUtil.mergeSObjectArraysByOrder(preInsertRecords, postInserRecords, false);
        }
        return toReturn;
    }
    
    async update( records : Array<SObject>){
        let toReturn = new Map<Prisma.ModelName, postgres.RowList<postgres.Row[]>>([]);
        let mappedRecords = DbUtil.mapRecordByType(records);
        for (const _modelName of mappedRecords.keys()) {
            const preUpdateRecords  = mappedRecords.get(_modelName);
            if(!preUpdateRecords || !preUpdateRecords.length){
                continue;
            }
            const recordsOld = await this.allSelector.selectAllFieldsFromDynamicTableByIds(
                Array.from(DbUtil.getIdSet(preUpdateRecords, true)), _modelName)
            const recordsNew = DbUtil.mergeSObjectArraysByIds(recordsOld, preUpdateRecords, true);
            await TriggerMaster.runBeforeUpdate(_modelName, recordsOld, recordsNew, this);
            const fieldSet = Array.from(DbUtil.getFieldSetFromSObjectList(preUpdateRecords));

            const rawResults = await this.connection`
                UPDATE ${sql.unsafe('public."' + _modelName + '"')} as t 
                SET ${sql.unsafe(DbUtil.getSqlUpdateAssignmentString(fieldSet, 'u'))}
                FROM (values ${sql(DbUtil.getSqlUpdateArraysFromSObjects(fieldSet, preUpdateRecords))}) 
                AS u (${sql(fieldSet)}) 
                WHERE CAST(u.id AS UUID) = t.id
                RETURNING *;`

            const postInserRecords = DbUtil.appendTechnicalFields(rawResults, _modelName);
            toReturn.set(_modelName, rawResults);
            await TriggerMaster.runAfterUpdate(_modelName, recordsOld, postInserRecords, this);
            DbUtil.mergeSObjectArraysByIds(preUpdateRecords, postInserRecords, false);
        }
        return toReturn;
    }

    async delete( records : Array<SObject>){
        let toReturn = new Map<Prisma.ModelName, postgres.RowList<postgres.Row[]>>([]);
        let mappedRecords = DbUtil.mapRecordByType(records);
        for (const _modelName of mappedRecords.keys()) {
            const preDeleteRecords = mappedRecords.get(_modelName);
            if(!preDeleteRecords || !preDeleteRecords.length){
                continue;
            }
            const idsToDelete = Array.from(DbUtil.getIdSet(preDeleteRecords, true));
            const recordsOld = await this.allSelector.selectAllFieldsFromDynamicTableByIds(idsToDelete, _modelName);
            await TriggerMaster.runBeforeDelete(_modelName, recordsOld, this);

            const rawResults = await this.connection`
                DELETE FROM ${sql.unsafe('public."' + _modelName + '"')} AS t
                WHERE t.id IN ${sql(idsToDelete)}`

            toReturn.set(_modelName, rawResults);
            await TriggerMaster.runAfterDelete(_modelName, recordsOld, this);
        }
        return toReturn;
    }

}
