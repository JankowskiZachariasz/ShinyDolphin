import type { Prisma } from '@prisma/client'
import type {RowList, Row} from 'postgres'
import Database from './Database'
import DbUtil from './DatabaseUtility'
import { SObject } from './Models'


type ModelField<T> = keyof Omit<{[key in keyof T]: boolean}, "_modelName">;
type Relation = {
    field : string,
    table : Prisma.ModelName
};

export default class QueryHelper{

    private db : Database;
    private nsToChildRelation: Map<string, Relation> = new Map();
    private nsToParentRelation: Map<string, Relation> = new Map();
    private mainTableNs :string = '';

    constructor(db : Database){
        this.db = db;
    }

    public queryFields<T>(fields :Array<ModelField<T>>, mainTableNs : string){
        this.mainTableNs = mainTableNs;
        QueryHelper.addIdFiled(fields);
        return this.db.sql(DbUtil._col<T>(fields, this.mainTableNs))
    }

    public queryParent<T>(fields :Array<ModelField<T>>, _modelName : Prisma.ModelName, relField: string, ns? : string){
        if(!ns){
            ns = _modelName.toLowerCase();
        }
        QueryHelper.addIdFiled(fields);
        this.nsToParentRelation.set(ns, {field: relField, table: _modelName})
        return this.db.sql.unsafe(DbUtil._colAliased<T>(fields, ns))
    }

    public queryChild<T>(fields :Array<ModelField<T>>, _modelName : Prisma.ModelName, relField: string, ns? : string){
        if(!ns){
            ns = _modelName.toLowerCase();
        }
        QueryHelper.addIdFiled(fields);
        this.nsToChildRelation.set(ns, {field: relField, table: _modelName})
        return this.db.sql.unsafe(DbUtil._colAliased<T>(fields, ns))
    }

    public generateJoins(){
        let toReturn : string = '';
        for (const ns of Array.from(this.nsToChildRelation.keys())){
            const relation = this.nsToChildRelation.get(ns);
            toReturn += `LEFT JOIN public."${relation?.table}" AS ${ns}
                        ON ${this.mainTableNs}."id" = ${ns}."${relation?.field}" `;  
        }
        for (const ns of Array.from(this.nsToParentRelation.keys())){
            const relation = this.nsToParentRelation.get(ns);
            toReturn += `LEFT JOIN public."${relation?.table}"  AS ${ns}
                        ON ${this.mainTableNs}."${relation?.field}" = ${ns}."id" `;  
        }
        return this.db.sql.unsafe(toReturn);
    }

    public processQueryResults(input : RowList<Row[]>, targetModelName : Prisma.ModelName){
        const idToResult : Map<string, SObject> = new Map();
        for(const record of input){
            if(!record.id){
                continue;
            }
            if(!idToResult.has(record.id)){
                idToResult.set(record.id, {_modelName: targetModelName});
            }
            const relatedObjects :any = {};
            for(const field of Object.keys(record)){
                if(field.includes('_')){
                    const ns = field.substring(0, field.indexOf('_'));
                    const fieldName = field.substring(field.indexOf('_') + 1, field.length);
                    if(!relatedObjects[ns]){
                        relatedObjects[ns] = {};
                    }
                    relatedObjects[ns][fieldName] = record[field];
                }
                else{
                    //@ts-ignore
                    idToResult.get(record.id)[field] = record[field];
                }
            }
            this.appendRelatedObjects(relatedObjects, idToResult.get(record.id));
        }
        return Array.from(idToResult.values());
    }

    private appendRelatedObjects(relatedObjects :any, taregetObject : SObject & any){
        for(const ns of Object.keys(relatedObjects)){
            if(this.nsToChildRelation.has(ns)){
                const rawObject :SObject = { ...relatedObjects[ns], _modelName: this.nsToChildRelation.get(ns)?.table };
                if(!taregetObject[ns]){
                    taregetObject[ns] = [];
                }
                if(!rawObject.id){
                   continue; 
                }
                taregetObject[ns].push(rawObject);
            }
            else if(this.nsToParentRelation.has(ns)){
                if(!relatedObjects[ns].id){
                    continue; 
                 }
                const rawObject :SObject = { ...relatedObjects[ns], _modelName: this.nsToParentRelation.get(ns)?.table };
                taregetObject[ns] = rawObject;
            }
        }
    }

    private static addIdFiled(arrayRef : Array<any>){
        arrayRef.push('id');
    }




}