import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BadgeCriteria extends BaseSchema {
    protected tableName = 'badge_criteria'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('role_id').unsigned().references('roles.id').notNullable().onDelete('cascade')
            table.integer('badge_id').unsigned().references('badges.id').notNullable().onDelete('cascade')
            table.integer('posts_count')
            table.integer('likes_count')
            table.integer('reaction_type')
            table.string('duration')
            table.integer('host_member_count')
            table.timestamps()
            table.dateTime('deleted_at');
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
