import TriggerBase from './TriggerBase'
import { Prisma } from '@prisma/client'
import { _tx } from '../server'

export default class CarTriggerHandler extends TriggerBase{

    override async beforeCreate(recordsOld : Array<Prisma.CarCreateManyInput>){
        //_tx.
        console.log('running before create car')
        console.log('recordsOld', recordsOld);
        console.log('recordsOld[0]', recordsOld[0]);
    }
    override async afterCreate(recordsOld : Array<Prisma.CarCreateManyInput>, recordsNew : Array<Prisma.CarCreateManyInput>){
        console.log('running after create car')
        console.log('recordsOld', recordsOld);
        console.log('recordsNew', recordsNew);
    }

}