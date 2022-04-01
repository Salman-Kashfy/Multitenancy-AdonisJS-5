import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import ReportRepo from 'App/Repos/ReportRepo'

export default class Reports extends BaseSchema {
    protected tableName = 'reports'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.integer('instance_type')
            table.integer('instance_id')
            table.string('description',250)
            table.integer('status').defaultTo(ReportRepo.model.STATUSES.PENDING)
            table.timestamps()
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
