import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BusinessCategories extends BaseSchema {
    protected tableName = 'business_categories'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.integer('business_id').unsigned().references('id').inTable('businesses').notNullable().onDelete('cascade')
            table.integer('category_id').unsigned().references('id').inTable('categories').notNullable().onDelete('cascade')
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
