import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class HidePosts extends BaseSchema {
    protected tableName = 'hide_posts'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.integer('post_id').unsigned().references('id').inTable('posts').notNullable().onDelete('cascade')
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
