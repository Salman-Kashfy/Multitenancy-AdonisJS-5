import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ParkMembers extends BaseSchema {
    protected tableName = 'park_members'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.integer('park_id').unsigned().references('id').inTable('parks').notNullable().onDelete('cascade')
            table.integer('member_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.timestamps()
            table.dateTime('deleted_at');
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
