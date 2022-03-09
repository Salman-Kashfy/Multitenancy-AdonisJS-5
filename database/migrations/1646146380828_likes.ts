import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Likes extends BaseSchema {
    protected tableName = 'likes'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.integer('instance_id').notNullable()
            table.integer('instance_type').notNullable()
            table.integer('reaction').notNullable()
            table.dateTime('created_at')
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
