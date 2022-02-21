import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BlockedUsers extends BaseSchema {
    protected tableName = 'blocked_users'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
          table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
          table.integer('blocked_user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
