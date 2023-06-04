export default abstract class TriggerBase{

    async beforeCreate(recordsOld: Array<any>, _tx: never) : Promise<void> {}

    async afterCreate(recordsOld: Array<any>, recordsNew: Array<any>, _tx: never) : Promise<void> {}

    async beforeUpdate(recordsOld: Array<any>, _tx: never) : Promise<void> {}

    async afterUpdate(recordsOld: Array<any>, recordsNew: Array<any>, _tx: never) : Promise<void> {}

    async beforeDelete(recordsOld: Array<any>, _tx: never) : Promise<void> {}

    async afterDelete(recordsOld: Array<any>, recordsNew: Array<any>, _tx: never) : Promise<void> {}

}
