import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
    protected tableName = 'users'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('f_name', 50).notNullable()
            table.string('l_name', 50).notNullable()
            table.string('email', 255).unique().notNullable()
            table.string('username', 50).unique()
            table.string('phone', 15)
            table.string('country_code', 5)
            table.string('phone_code', 5)
            table.string('password', 255)
            table.string('zip', 15)
            table.date('dob')
            table.double('latitude')
            table.double('longitude')
            table.integer('marital_status')
            table.integer('gender')
            table.text('image')
            table.boolean('is_social_login').defaultTo(0)
            table.boolean('push_notify').defaultTo(1)
            table.boolean('email_verified').defaultTo(0)
            table.boolean('is_blocked').defaultTo(0)
            table.timestamps();
            table.dateTime('deleted_at');
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
