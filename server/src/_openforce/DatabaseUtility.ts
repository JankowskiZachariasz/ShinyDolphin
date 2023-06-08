import { Prisma } from '@prisma/client'
import postgres from 'postgres'
import { SObject } from './Models'

export default class DatabaseUtility{

    static mapRecordByType(records : Array<SObject>){
        let toReturn = new Map<Prisma.ModelName, Array<SObject>>([]);
        records.forEach(record => {
            if(!toReturn.has(record._modelName)){
                toReturn.set(record._modelName, []);
            }
            toReturn.get(record._modelName)?.push(record)
        });
        return toReturn;
    }

    static stripTechnicalFields(input : Array<any>){
        const toReturn : Array<any> = [];
        for(const record of input){
            let clonedRecord = Object.assign({}, record);
            delete clonedRecord._modelName;
            toReturn.push(clonedRecord)
        }
        return toReturn;
    }

    static appendTechnicalFields(input : postgres.RowList<postgres.Row[]>, targetModelName : Prisma.ModelName){
        const toReturn : Array<SObject> = [];
        for(const record of input){
            record._modelName = targetModelName;
            //@ts-ignore
            toReturn.push(record)
        }
        return toReturn;
    }

}