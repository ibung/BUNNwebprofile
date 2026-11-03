import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'skill_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 80).notNullable()
      table.string('slug', 100).notNullable().unique()
      table.string('description', 280).nullable()
      table.string('accent', 10).notNullable().defaultTo('red')
      table.integer('sort_order').notNullable().defaultTo(0)
      table.boolean('is_visible').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.raw(`
      ALTER TABLE "skill_categories"
        ADD CONSTRAINT chk_skill_categories_accent
        CHECK (accent IN ('red','yellow'))
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
