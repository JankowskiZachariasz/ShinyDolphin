import Database from './Database'
import { Prisma } from '@prisma/client'
import DatabaseUtility from './DatabaseUtility'


export default class SObjectSelector{
    
    private db : Database;

    constructor(db : Database){
        this.db = db;
    }

    async selectAllFieldsFromDynamicTableByIds(ids : Array<string>, _modelName : Prisma.ModelName){
        let _table = this.db.sql.unsafe('public."' + _modelName + '"');
        const results = await this.db.connection`
        SELECT *
        FROM ${_table} 
        WHERE
            id IN ${this.db.sql(ids)}
        `
        return DatabaseUtility.appendTechnicalFields(results, _modelName)
    }

}