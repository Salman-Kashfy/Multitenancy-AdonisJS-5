import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Breeds extends BaseSchema {
    protected tableName = 'breeds'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('name')
            table.timestamps();
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
