import { SObject } from './Models'
import Database from './Database';

export default abstract class TriggerBase{

    async beforeInsert(recordsNew: Array<SObject>, db: Database) : Promise<void> {}

    async afterInsert(recordsNew: Array<SObject>, db: Database) : Promise<void> {}

    async beforeUpdate(recordsOld: Array<SObject>, recordsNew: Array<SObject>, db: Database) : Promise<void> {}

    async afterUpdate(recordsOld: Array<SObject>, recordsNew: Array<SObject>, db: Database) : Promise<void> {}

    async beforeDelete(recordsOld: Array<SObject>, db: Database) : Promise<void> {}

    async afterDelete(recordsOld: Array<SObject>, db: Database) : Promise<void> {}

}
