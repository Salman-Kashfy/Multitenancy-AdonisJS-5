import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SharedPosts extends BaseSchema {
    protected tableName = 'shared_posts'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.integer('park_id').unsigned().references('id').inTable('parks').notNullable().onDelete('cascade')
            table.integer('post_id').unsigned().references('id').inTable('posts').notNullable().onDelete('cascade')
            table.timestamps()
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
