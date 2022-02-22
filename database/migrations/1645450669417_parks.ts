import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Parks extends BaseSchema {
    protected tableName = 'parks'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.string('title',50)
            table.string('description',250)
            table.string('location', 200)
            table.double('latitude')
            table.double('longitude')
            table.string('city', 20)
            table.string('state', 20)
            table.string('zip', 20)
            table.boolean('privacy')
            table.boolean('allow_invite')
            table.timestamps()
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
