import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'social_links'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('platform', 20).notNullable()
      table.string('label', 60).notNullable()
      table.text('url').notNullable()
      table.integer('sort_order').notNullable().defaultTo(0)
      table.boolean('is_visible').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.raw(`
      ALTER TABLE "social_links"
        ADD CONSTRAINT chk_social_links_platform
        CHECK (platform IN ('github','linkedin','instagram','youtube','x','tiktok','email','website','other'))
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
