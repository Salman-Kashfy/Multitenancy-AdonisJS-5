import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Friends extends BaseSchema {
    protected tableName = 'friends'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.integer('friend_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.integer('status').notNullable()
            table.timestamps()
            table.dateTime('deleted_at')
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
