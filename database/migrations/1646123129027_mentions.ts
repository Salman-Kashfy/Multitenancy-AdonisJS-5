import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Mentions extends BaseSchema {
    protected tableName = 'mentions'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.integer('instance_id').notNullable()
            table.integer('instance_type').notNullable()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
