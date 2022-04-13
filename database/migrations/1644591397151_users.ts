import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import User from 'App/Models/User'

export default class Users extends BaseSchema {
    protected tableName = 'users'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('name', 50).notNullable()
            table.string('email', 255).unique().notNullable()
            table.string('username', 50).unique()
            table.string('phone', 15)
            table.string('country_code', 5)
            table.string('password', 255)
            table.string('bio', 250)
            table.string('zip', 15)
            table.date('dob')
            table.double('latitude')
            table.double('longitude')
            table.integer('marital_status')
            table.integer('gender')
            table.integer('identification')
            table.string('profession',35)
            table.string('school',50)
            table.text('image')
            table.text('profile_picture')
            table.integer('privacy').defaultTo(User.PROFILE.PUBLIC)
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
