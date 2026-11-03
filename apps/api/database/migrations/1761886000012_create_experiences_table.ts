import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'experiences'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('kind', 10).notNullable()
      table.string('title', 160).notNullable()
      table.string('organization', 160).nullable()
      table.text('description_md').nullable()
      table.date('started_on').notNullable()
      table.date('ended_on').nullable()
      table.integer('sort_order').notNullable().defaultTo(0)
      table.boolean('is_visible').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.raw(`
      ALTER TABLE "experiences"
        ADD CONSTRAINT chk_experiences_kind
        CHECK (kind IN ('education','work','project','milestone'))
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
