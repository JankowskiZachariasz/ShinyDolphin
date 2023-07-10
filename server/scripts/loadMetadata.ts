import * as dotenv from 'dotenv'; 
dotenv.config();
import Database from '../src/_openforce/Database'
import DbUtil from '../src/_openforce/DatabaseUtility'
import SObjectSelector from '../src/_openforce/SObjectSelector'
import UserSelector from '../src/_openforce/UserSelector'
import { Label__mtd, User, Session, Individual } from '../src/_openforce/Models'
import { Labels } from '../../client/src/metadata/Label'
import { Users } from '../../client/src/metadata/User'


async function loadMetadata(){
    await Database.runTransaction(async (db) => {
        //await processLabels(db);
        //await processUsers(db);
        await todayScript(db);
        console.log('Script finished!');
    });
    process.exit(0);
}

const todayScript = async (db : Database) => {

    let userSelector = new UserSelector(db);
    const retrievedUsers = await userSelector.selectUsersWithSessionsByIds([
        "d0389818-031c-45fd-9dbc-4d61088dc2b3",
        "e3f64aed-63f8-4065-9ad3-65f26ce491bf",
        "90a7a255-c17c-470d-9f3e-b90e22d46ae3",
        "e3f64aed-63f8-4065-9ad3-65f26ce491ba"
    ]);
    console.log('retrievedUsers', retrievedUsers);
}

const processLabels = async (db : Database) => {
    const allSelector = new SObjectSelector(db);
    let nameToLabelmap : Map<string, Label__mtd> = new Map();
    let existingLabels :Array<Label__mtd> = await allSelector
    .selectAllFieldsFromDynamicTableByNames(Object.keys(Labels), 'Label__mtd')
    existingLabels.forEach(label => {
        if(label.name){
            nameToLabelmap.set(label.name, label);
        }
    });
    const labelsToInsert :Array<Label__mtd> = [];
    const labelsToUpdate :Array<Label__mtd> = [];
    Object.keys(Labels).forEach(name => {
        const labelToUpsert :Label__mtd = {_modelName: 'Label__mtd'};
        labelToUpsert.name = name;
        labelToUpsert.en = Labels[name].en;
        labelToUpsert.pl = Labels[name].pl;
        if(Labels[name].de){
            labelToUpsert.de = Labels[name].de;
        }
        if(nameToLabelmap.has(name)){
            labelToUpsert.id = nameToLabelmap.get(name)?.id;
            labelsToUpdate.push(labelToUpsert);
        }
        else{
            labelsToInsert.push(labelToUpsert);
        } 
    });
    await db.update(labelsToUpdate);
    await db.insert(labelsToInsert);
    console.log('Processed Labels!');
}

const processUsers = async (db : Database) => {
    const allSelector = new SObjectSelector(db);
    let idToUserMap : Map<string, User> = new Map();
    let existingUsers :Array<Label__mtd> = await allSelector
    .selectAllFieldsFromDynamicTableByIds(Array.from(DbUtil.getIdSet(Object.values(Users), true)), 'User')
    existingUsers.forEach(user => {
        if(user.id){
            idToUserMap.set(user.id, user);
        }
    });
    const UsersToInsert :Array<Label__mtd> = [];
    const UsersToUpdate :Array<Label__mtd> = [];
    Object.keys(Users).forEach(name => {
        //@ts-ignore
        if(idToUserMap.has(Users[name].id)){
            UsersToUpdate.push(Users[name]);
        }
        else {
            UsersToInsert.push(Users[name]);
        }
    });
    await db.update(UsersToUpdate);
    await db.insert(UsersToInsert);
    console.log('Processed Users!');
}

loadMetadata();