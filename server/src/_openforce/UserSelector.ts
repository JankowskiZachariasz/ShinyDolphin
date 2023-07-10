import Database from './Database'
import type { Prisma, Providers } from '@prisma/client'
import { User, Session, Individual } from './Models';
import DbUtil from './DatabaseUtility'
import QueryHelper from './QueryHelper'


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

    async selectUsersWithSessionsByEmail(email : string, provider : Providers | string){
        let queryHelper = new QueryHelper(this.db);
        const results = await this.db.connection`
        SELECT ${queryHelper.queryFields<User>([
            'password',
            'id',
            'firstName',
            'lastName',
            'email',
            'authProvider',
            'role',
            'picture'
        ], 'a')},
        ${queryHelper.queryChild<Session>([
            'userId',
        ], 'Session', 'userId', 'sessions')}
        FROM ${this._table} AS a ${queryHelper.generateJoins()}
        WHERE ${this.db.sql(DbUtil._col<User>(['email'],'a'))} = ${email}
            AND ${this.db.sql(DbUtil._col<User>(['authProvider'],'a'))} = ${provider}`

        return DbUtil.appendTechnicalFields(results, this._modelName)
    }

    // async selectUsersWithSessionsByIds(ids : Array<string>){
    //     const SESSION_TABLE : Prisma.ModelName = 'Session';
    //     const INDIVIDUAL_TABLE : Prisma.ModelName = 'Individual';
    //     const results = await this.db.connection`
    //     SELECT ${this.db.sql(DbUtil._col<User>([
    //         'id',
    //         'password',
    //         'firstName',
    //         'lastName',
    //         'email',
    //         'authProvider',
    //         'role',
    //         'picture'
    //     ],'a'))},
    //     ${this.db.sql.unsafe(DbUtil._colAliased<Session>([
    //         'userId',
    //         'id'
    //     ],'b'))},
    //     ${this.db.sql.unsafe(DbUtil._colAliased<Individual>([
    //         'firstName',
    //         'lastName',
    //         'id'
    //     ],'c'))}
    //     FROM ${this._table} AS a 
    //     RIGHT JOIN ${this.db.sql.unsafe('public."' + SESSION_TABLE  + '"')} AS b ON a."id" = b."userId"
    //     LEFT JOIN ${this.db.sql.unsafe('public."' + INDIVIDUAL_TABLE  + '"')} AS c ON a."individualId" = c."id"
    //     WHERE ${this.db.sql(DbUtil._col<User>(['id'],'a'))} IN ${this.db.sql(ids)}`;
    //     return DbUtil.appendTechnicalFields(results, this._modelName)
    // }

    async selectUsersWithSessionsByIds(ids : Array<string>) :Promise<Array<User>>{
        let queryHelper = new QueryHelper(this.db);
        const results = await this.db.connection`
        SELECT ${queryHelper.queryFields<User>([
            'password',
            'firstName',
            'lastName',
            'email',
            'authProvider',
            'role',
            'picture'
        ], 'a')},
        ${queryHelper.queryChild<Session>([
            'userId',
            'expires',
        ], 'Session', 'userId', 'sessions')}
        FROM ${this._table} AS a ${queryHelper.generateJoins()}
        WHERE ${this.db.sql(DbUtil._col<User>(['id'],'a'))} IN ${this.db.sql(ids)}`;
        return queryHelper.processQueryResults(results, this._modelName);
    }

    async selectAllUsers(){
        const results = await this.db.connection`
        SELECT *
        FROM ${this._table} 
        `
        return DbUtil.appendTechnicalFields(results, this._modelName)
    }

}