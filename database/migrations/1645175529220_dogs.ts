import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Dogs extends BaseSchema {
    protected tableName = 'dogs'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.string('name',35)
            table.string('description',250)
            table.integer('breed_id').unsigned().references('id').inTable('breeds').notNullable().onUpdate('cascade').onDelete('cascade')
            table.integer('gender_id').unsigned().references('id').inTable('genders').notNullable().onUpdate('cascade').onDelete('cascade')
            table.integer('size_id').unsigned().references('id').inTable('sizes').notNullable().onUpdate('cascade').onDelete('cascade')
            table.date('dob')
            table.timestamps()
            table.dateTime('deleted_at')
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
