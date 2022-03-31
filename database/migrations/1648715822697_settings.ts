import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Settings extends BaseSchema {
    protected tableName = 'settings'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('title')
            table.text('about')
            table.string('phone',15)
            table.string('address')
            table.text('app_store_link')
            table.text('facebook_link')
            table.string('build_version',10)
            table.text('base_url')
            table.integer('year')
            table.decimal('sales_tax')
            table.decimal('commission')
            table.decimal('penalty_charges')
            table.timestamps()
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
