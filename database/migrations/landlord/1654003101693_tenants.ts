import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tenants extends BaseSchema {
    protected tableName = 'tenants'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('simpill_public_key').unique()
            table.string('database').unique()
            table.string('name', 35).unique()
            table.string('email', 100).unique()
            table.string('phone', 15).unique()
            table.string('phone_code', 5)
            table.string('country_code', 5)
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
