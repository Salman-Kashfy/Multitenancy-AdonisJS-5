import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ParkRequests extends BaseSchema {
    protected tableName = 'park_requests'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.integer('park_id').unsigned().references('id').inTable('parks').notNullable().onDelete('cascade')
            table.integer('member_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.integer('type')
            table.timestamps()
            table.dateTime('deleted_at');
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
