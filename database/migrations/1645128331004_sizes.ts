import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Sizes extends BaseSchema {
    protected tableName = 'sizes'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('size',30)
            table.timestamps();
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
