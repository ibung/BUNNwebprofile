import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'skills'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('category_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('skill_categories')
        .onDelete('RESTRICT')
      table.string('name', 80).notNullable()
      table.string('slug', 100).notNullable().unique()
      table.string('level', 12).nullable()
      table.string('summary', 280).notNullable()
      table.text('description_md').nullable()
      table.specificType('years_experience', 'numeric(3,1)').nullable()
      table.boolean('is_visible').notNullable().defaultTo(true)
      table.integer('sort_order').notNullable().defaultTo(0)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['category_id', 'name'])
    })

    this.schema.raw(`
      ALTER TABLE "skills"
        ADD CONSTRAINT chk_skills_level
        CHECK (level IS NULL OR level IN ('learning','comfortable','strong'))
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
