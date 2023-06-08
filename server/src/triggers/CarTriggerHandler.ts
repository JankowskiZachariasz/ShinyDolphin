import TriggerBase from '../_openforce/TriggerBase'
import { SObject } from '../_openforce/Models'

export default class CarTriggerHandler extends TriggerBase{

    override async beforeInsert(recordsOld : Array<SObject>){
        console.log('running before create car')
    }
    override async afterInsert( recordsNew : Array<SObject>){
        console.log('running after create car')
    }

}