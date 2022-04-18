import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import SubscriptionRepo from 'App/Repos/SubscriptionRepo'

export default class UserSubscriptions extends BaseSchema {
    protected tableName = 'user_subscriptions'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.integer('subscription_id').unsigned().defaultTo(SubscriptionRepo.model.FREE_PLAN).references('id').inTable('subscriptions').notNullable().onDelete('cascade')
            table.string('platform',191)
            table.decimal('amount')
            table.string('currency',15)
            table.date('expiry_date')
            table.string('transaction_reference',255)
            table.text('data')
            table.timestamps()
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
