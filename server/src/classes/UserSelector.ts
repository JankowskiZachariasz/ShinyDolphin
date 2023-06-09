import Database from '../_openforce/Database'
import { Prisma } from '@prisma/client'
import { User } from '../_openforce/Models';
import DatabaseUtility from '../_openforce/DatabaseUtility'


export default class UserSelector{
    
    private db : Database;
    private _modelName : Prisma.ModelName = 'User';
    private _table;
    private _col(refObject : Array<keyof Omit<{[key in keyof User]: boolean}, "_modelName">>){
        return this.db.sql(refObject)
    }

    constructor(db : Database){
        this.db = db;
        this._table = this.db.sql.unsafe('public."' + this._modelName + '"');
    }

    async selectUsersByEmail(email : string){
        const results = await this.db.connection`
        SELECT
            ${this._col([
                'id',
                'email',
                'password'
            ])}
        FROM ${this._table} 
        WHERE
            email = ${this.db.sql(email) }
        `
        return DatabaseUtility.appendTechnicalFields(results, this._modelName)
    }

    async selectAllUsers(){
        const results = await this.db.connection`
        SELECT *
        FROM ${this._table} 
        `
        return DatabaseUtility.appendTechnicalFields(results, this._modelName)
    }

}