import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ParkBlockedUsers extends BaseSchema {
    protected tableName = 'park_blocked_users'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.integer('park_id').unsigned().references('id').inTable('parks').notNullable().onDelete('cascade')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}