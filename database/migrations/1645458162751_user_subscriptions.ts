import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserSubscriptions extends BaseSchema {
    protected tableName = 'user_subscriptions'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.integer('subscription_id').unsigned().references('id').inTable('subscriptions').notNullable().onDelete('cascade')
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
