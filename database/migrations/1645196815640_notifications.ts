import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Notifications extends BaseSchema {
    protected tableName = 'notifications'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('notifiable_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.string('title',250)
            table.text('message')
            table.integer('referenced_user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.integer('ref_id')
            table.integer('type')
            table.timestamp('read_at')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
