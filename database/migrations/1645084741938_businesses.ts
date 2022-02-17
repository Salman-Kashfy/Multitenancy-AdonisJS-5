import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Businesses extends BaseSchema {
    protected tableName = 'businesses'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onUpdate('cascade').onDelete('cascade')
            table.string('name', 50)
            table.text('website')
            table.string('location', 200)
            table.double('latitude')
            table.double('longitude')
            table.string('city', 20)
            table.string('state', 20)
            table.string('zip', 20)
            table.timestamps();
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
