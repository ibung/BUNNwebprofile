import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'site_settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.specificType('id', 'smallint').primary().defaultTo(1).notNullable()
      table.string('site_title', 80).notNullable()
      table.string('meta_description', 300).nullable()
      table
        .integer('og_image_media_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('media')
        .onDelete('SET NULL')
      table.string('footer_text', 200).nullable()
      table.boolean('contact_form_enabled').notNullable().defaultTo(true)
      table.timestamp('updated_at').nullable()
    })

    this.schema.raw(`
      ALTER TABLE "site_settings"
        ADD CONSTRAINT chk_site_settings_singleton
        CHECK (id = 1)
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
