import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'highlights'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('placement', 10).notNullable()
      table.string('value', 40).notNullable()
      table.string('label', 120).notNullable()
      table.string('note', 200).nullable()
      table.integer('sort_order').notNullable().defaultTo(0)
      table.boolean('is_visible').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.raw(`
      ALTER TABLE "highlights"
        ADD CONSTRAINT chk_highlights_placement
        CHECK (placement IN ('about','skills'))
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
