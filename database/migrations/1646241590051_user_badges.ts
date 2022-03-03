import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserBadges extends BaseSchema {
    protected tableName = 'user_badges'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
          table.integer('user_id').unsigned().references('users.id').notNullable().onDelete('cascade')
          table.integer('badge_id').unsigned().references('badges.id').notNullable().onDelete('cascade')
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
