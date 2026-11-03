import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug', 120).notNullable().unique()
      table.string('title', 160).notNullable()
      table.string('summary', 320).notNullable()
      table.text('description_md').notNullable()
      table.string('role', 120).nullable()
      table.string('kind', 60).nullable()
      table.string('status', 10).notNullable().defaultTo('draft')
      table.boolean('is_featured').notNullable().defaultTo(false)
      table.text('demo_url').nullable()
      table.text('repo_url').nullable()
      table.date('started_on').nullable()
      table.date('ended_on').nullable()
      table
        .integer('cover_media_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('media')
        .onDelete('SET NULL')
      table.integer('sort_order').notNullable().defaultTo(0)
      table.timestamp('published_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['status', 'sort_order'])
    })

    this.schema.raw(`
      ALTER TABLE "projects"
        ADD CONSTRAINT chk_projects_status
        CHECK (status IN ('draft','published','archived'))
    `)
    this.schema.raw(`
      CREATE INDEX idx_projects_featured
        ON "projects" (is_featured)
        WHERE status = 'published'
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
