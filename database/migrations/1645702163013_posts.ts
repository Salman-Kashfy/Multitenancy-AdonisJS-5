import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Posts extends BaseSchema {
    protected tableName = 'posts'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.string('description',250)
            table.boolean('anonymous')
            table.integer('type').notNullable()
            table.integer('alert_type')
            table.string('location', 200)
            table.double('latitude')
            table.double('longitude')
            table.string('city', 20)
            table.string('state', 20)
            table.string('zip', 20)
            table.timestamps()
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
