import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class WebhookLogs extends BaseSchema {
    protected tableName = 'webhook_logs'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.text('data').notNullable()
            table.string('platform').notNullable()
            table.timestamps()
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
