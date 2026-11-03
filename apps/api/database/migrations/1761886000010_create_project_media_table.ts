import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'project_media'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('project_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
      table
        .integer('media_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('media')
        .onDelete('CASCADE')
      table.integer('sort_order').notNullable().defaultTo(0)
      table.primary(['project_id', 'media_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
