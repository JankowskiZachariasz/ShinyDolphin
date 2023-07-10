import { Prisma } from '@prisma/client'
import type {RowList, Row} from 'postgres'
import { SObject } from './Models'

export default class DatabaseUtility{

    static mergeSObjectArraysByOrder(merged :Array<SObject>, master :Array<SObject>, preserveMergedRecord :boolean){
        if(!merged || !merged.length || merged.length !== master?.length){
            throw new Error('Unexpected data while merging SObject arrays.');
        }
        const toReturn : Array<SObject> = [];
        for(let i = 0; i < merged.length; i++){
            let mergedRecord = merged[i];
            let masterRecord = master[i];
            if(preserveMergedRecord){
                let clonedMergedRecord = Object.assign({}, mergedRecord);
                toReturn.push(Object.assign(clonedMergedRecord, masterRecord));
                continue;
            }
            toReturn.push(Object.assign(mergedRecord, masterRecord));
        }
        return toReturn;
    }

    static mergeSObjectArraysByIds(merged :Array<SObject>, master :Array<SObject>, preserveMergedRecord :boolean){
        const toReturn : Array<SObject> = [];
        let masterMap = DatabaseUtility.mapRecordByIds(master);
        for(let mergedRecord of merged){
            if(!mergedRecord.id || !masterMap.has(mergedRecord.id)){
                continue;
            }
            if(preserveMergedRecord){
                let clonedMergedRecord = Object.assign({}, mergedRecord);
                toReturn.push(Object.assign(clonedMergedRecord, masterMap.get(mergedRecord.id)));
                continue;
            }
            toReturn.push(Object.assign(mergedRecord, masterMap.get(mergedRecord.id)));
        }
        return toReturn;
    }

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

    static mapRecordByIds(records : Array<SObject>){
        let toReturn = new Map<string, SObject>([]);
        for(const record of records){
            if(!record.id){
                continue;
            }
            toReturn.set(record.id, record);
        }
        return toReturn;
    }

    static getIdSet(records : Array<SObject>, assureIdPresence : boolean){
        let toReturn = new Set<string>;
        for(const record of records){
            if(!record.id){
                if(assureIdPresence){
                    throw new Error("Id wasn't specified.")
                }
                continue;
            }
            toReturn.add(record.id);
        }
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

    static getFieldSetFromSObjectList(updateList : Array<any>){
        const toReturn : Set<string> = new Set();
        for(const record of DatabaseUtility.stripTechnicalFields(updateList)){
            Object.keys(record).forEach(field => {
                toReturn.add(`${field}`)
            })
        }
        return toReturn;
    }

    static getSqlUpdateAssignmentString(fieldSet : Array<string>, sourceName : string){
        let toReturn : string = '';
        for(const field of fieldSet){
            if(field.endsWith('Id') || field === 'id'){
                toReturn += `, "${field}" = CAST(${sourceName}."${field}" AS UUID)`;
                continue;
            }
            if(field === 'authProvider'){
                toReturn += `, "${field}" = CAST(${sourceName}."${field}" AS "Providers")`;
                continue;
            }
            toReturn += `, "${field}" = ${sourceName}."${field}"`
        }
        return toReturn.substring(1);
    }

    static getSqlUpdateArraysFromSObjects(fieldSet : Array<string>, updateData : Array<SObject>){
        let values : Array<Array<any>> = [];
        for(let i = 0; i< updateData.length; i++){
            let currentArray : Array<any> = [];
            let record = updateData[i];
            for(const field of fieldSet){
                //@ts-ignore
                currentArray.push(record[field]? record[field] : ''); 
            }
            values.push(currentArray);
        }
        let toReturn = '';
        values.forEach(row => {  
            const completeRow = row.reduce((rowAccumulator, fieldValue) => {
                let toReturn = rowAccumulator + (rowAccumulator? (', ') : (' ')) ;
                switch(typeof fieldValue){
                    case('boolean'):
                    case('number'):{
                        toReturn += `${fieldValue}`;
                        break;
                    }
                    default:{
                        toReturn += `'${fieldValue}'`;
                    }
                }
                return toReturn;
            },'');
            toReturn += `${toReturn?', ':''}( ${completeRow} )`
        })
        console.log(toReturn)
        return toReturn;
    }

    static appendTechnicalFields(input : RowList<Row[]>, targetModelName : Prisma.ModelName){
        const toReturn : Array<SObject> = [];
        for(const record of input){
            record._modelName = targetModelName;
            //@ts-ignore
            toReturn.push(record)
        }
        return toReturn;
    }

    static queryRelationship(){

    }

    static _col<T>(refArray : Array<keyof Omit<{[key in keyof T]: boolean}, "_modelName">>, ns : string){
        const toReturn : Array<string> = [];
        for(let i in refArray){
            toReturn.push(`${ns}.${String(refArray[i])}`);
        }
        return toReturn;
    }

    static _colAliased<T>(refArray : Array<keyof Omit<{[key in keyof T]: boolean}, "_modelName">>, ns : string){
        let toReturn : string = '';
        for(let i = 0; i < refArray.length; i++){
            //@ts-ignore
            toReturn += (`${ns}."${String(refArray[i])}" AS "${ns}_${String(refArray[i]) + ((i + 1) === refArray.length?('"'):('", '))}`);
        }
        return toReturn;
    }

}