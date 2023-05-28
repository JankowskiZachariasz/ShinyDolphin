import TriggerBase from '../_openforce/TriggerBase'
import { Prisma, PrismaClient } from '@prisma/client'

export default class UserTriggerHandler extends TriggerBase{

    override async beforeCreate(recordsOld : Array<Prisma.UserCreateManyInput>, _tx: Omit<PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">){
        //@ts-ignore
        let _nexttx :never = _tx;
        console.log('running before create user')
        console.log('recordsOld', recordsOld);
        console.log('recordsOld[0]', recordsOld[0]);
        let r = await _tx.car.create({data: {brand: 'VW', model: 'A4'}, _tx: _nexttx })
        console.log('r', r);
    }
    override async afterCreate(recordsOld : Array<Prisma.UserCreateManyInput>, recordsNew : Array<Prisma.UserCreateManyInput>){
        console.log('running after create user')
        console.log('recordsOld', recordsOld);
        console.log('recordsNew', recordsNew);
        
    }

}

