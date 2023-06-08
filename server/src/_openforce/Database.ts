
import postgres from 'postgres'
import { SObject } from './Models'
import { Prisma } from '@prisma/client'
import DatabaseUtility from './DatabaseUtility'
import { TriggerMaster } from './TriggerMaster'
import { TRPCError } from '@trpc/server';


if(typeof process.env.DATABASE_URL !== 'string'){
    console.error('Essential env missing!')
    process.exit(0);
}

const sql = postgres(process.env.DATABASE_URL)

export default class Database{
    
    connection : postgres.TransactionSql<{}>;

    constructor(tx : postgres.TransactionSql<{}>){
        this.connection = tx;
    }

    static async runTransaction(callback : (db : Database) => Promise<void> ){
        try{
            return await sql.begin(async sql => {
                return await callback(new Database(sql));
            })
        }
        catch(e: any){
            let message = e.message;
            throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message });
        }
    }

    async insert( records : Array<SObject>){
        let toReturn = new Map<Prisma.ModelName, Array<SObject>>([]);
        let mappedRecords = DatabaseUtility.mapRecordByType(records);
        for (const _modelName of mappedRecords.keys()) {
            console.log('robimy', _modelName);
            //@ts-ignore
            const preInsertRecords : Array<SObject> = mappedRecords.get(_modelName);
            await TriggerMaster.runBeforeInsert(_modelName, preInsertRecords, this);
            const rawResults = await this.connection`
                INSERT INTO ${ this.connection.unsafe('public."' + _modelName + '"')} 
                ${this.connection(DatabaseUtility.stripTechnicalFields(preInsertRecords))}
                RETURNING *
                `
            const postInserRecords = DatabaseUtility.appendTechnicalFields(rawResults, _modelName);
            console.log('postInserRecords', postInserRecords);
            toReturn.set(_modelName, postInserRecords);
            await TriggerMaster.runAfterInsert(_modelName, postInserRecords, this);
        }
        return toReturn;
    }
    

}
