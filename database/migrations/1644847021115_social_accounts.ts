import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SocialAccounts extends BaseSchema {
    protected tableName = 'social_accounts'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.string('platform',25)
            table.string('client_id',200)
            table.dateTime('expired_at')
            table.timestamps()
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }

}
