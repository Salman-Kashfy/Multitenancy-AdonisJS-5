import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PostCriterias extends BaseSchema {
    protected tableName = 'post_criteria'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('role_id').unsigned().references('id').inTable('roles').notNullable().onDelete('cascade')
            table.integer('subscription_id').unsigned().references('id').inTable('subscriptions').notNullable().onDelete('cascade')
            table.integer('posts_per_month')
            table.timestamps()
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
