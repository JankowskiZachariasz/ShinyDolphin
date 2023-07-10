import Database from '../_openforce/Database'
import type { Prisma, Providers } from '@prisma/client'
import { Car } from '../_openforce/Models';
import DbUtil from '../_openforce/DatabaseUtility'
import QueryHelper from '../_openforce/QueryHelper'


export default class UserSelector{
    
    private db : Database;
    private _modelName : Prisma.ModelName = 'Car';
    private _table;
    private _col(refObject : Array<keyof Omit<{[key in keyof Car]: boolean}, "_modelName">>){
        return this.db.sql(refObject)
    }

    constructor(db : Database){
        this.db = db;
        this._table = this.db.sql.unsafe('public."' + this._modelName + '"');
    }

    async selectAllCars() :Promise<Array<Car>>{
        let queryHelper = new QueryHelper(this.db);
        const results = await this.db.connection`
        SELECT ${queryHelper.queryFields<Car>([
            'id',
            'brand',
            'model',
        ], 'a')}
        FROM ${this._table} AS a`;
        return queryHelper.processQueryResults(results, this._modelName);
    }
}