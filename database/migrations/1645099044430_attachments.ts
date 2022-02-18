import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Attachments extends BaseSchema {
    protected tableName = 'attachments'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('path')
            table.integer('instance_id').notNullable()
            table.integer('instance_type').notNullable()
            table.string('mime_type').notNullable()
            table.integer('duration')
            table.string('thumbnail')
            table.timestamps();
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
