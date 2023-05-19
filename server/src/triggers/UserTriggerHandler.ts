import TriggerBase from './TriggerBase'
import { Prisma } from '@prisma/client'
import { _tx } from '../server'

export default class UserTriggerHandler extends TriggerBase{

    override async beforeCreate(recordsOld : Array<Prisma.UserCreateManyInput>){
        console.log('running before create user')
        console.log('recordsOld', recordsOld);
        console.log('recordsOld[0]', recordsOld[0]);
    }
    override async afterCreate(recordsOld : Array<Prisma.UserCreateManyInput>, recordsNew : Array<Prisma.UserCreateManyInput>){
        console.log('running after create user')
        console.log('recordsOld', recordsOld);
        console.log('recordsNew', recordsNew);
        //@ts-ignore
        let r = await _tx.car.create({data: {brand: recordsNew[0].id.toString(), model: 'A4'}})
    }

}