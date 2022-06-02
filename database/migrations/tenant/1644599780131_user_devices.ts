import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserDevices extends BaseSchema {
    protected tableName = 'user_devices'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.enum('device_type', ['android', 'ios']).notNullable()
            table.string('device_token', 191).notNullable()
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
