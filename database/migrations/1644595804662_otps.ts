import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Otps extends BaseSchema {
    protected tableName = 'otps'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.string('type',100).notNullable()
            table.string('email',100)
            table.string('phone',20)
            table.integer('code').notNullable()
            table.timestamp('created_at', { useTz: true })
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
