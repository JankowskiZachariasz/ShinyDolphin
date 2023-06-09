import TriggerBase from '../_openforce/TriggerBase'
import { Car, User } from '../_openforce/Models'
import Database from '../_openforce/Database';

export default class UserTriggerHandler extends TriggerBase{

    override async beforeInsert(recordsOld : Array<User>, db : Database){
        console.log('running before create user')
    }

    override async afterInsert( recordsNew : Array<User>, db : Database){
        // console.log('running after create user')
        // let u : Car = {
        //     _modelName: 'Car', 
        //     brand: 'SKODA',
        //     model: 'Model'
        // };
        // await db.insert([u]);
    }

    override async beforeUpdate( recordsOld : Array<User>, recordsNew : Array<User>, db : Database){
        // console.log('recordsOld in beforeUpdate', recordsOld)
        // console.log('recordsNew in beforeUpdate', recordsNew)
    }

    override async afterUpdate( recordsOld : Array<User>, recordsNew : Array<User>, db : Database){
        // console.log('recordsOld in afterUpdate', recordsOld)
        // console.log('recordsNew in afterUpdate', recordsNew)
    }

}

