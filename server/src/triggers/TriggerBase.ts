export default abstract class TriggerBase{

    async beforeCreate(recordsOld: Array<any>) : Promise<void> {}

    async afterCreate(recordsOld: Array<any>, recordsNew: Array<any>) : Promise<void> {}

    async beforeUpdate(recordsOld: Array<any>) : Promise<void> {}

    async afterUpdate(recordsOld: Array<any>) : Promise<void> {}

    async beforeDelete(recordsOld: Array<any>) : Promise<void> {}

    async afterDelete(recordsOld: Array<any>) : Promise<void> {}

}
