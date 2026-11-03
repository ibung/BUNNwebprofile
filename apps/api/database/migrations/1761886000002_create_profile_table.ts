import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profile'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.specificType('id', 'smallint').primary().defaultTo(1).notNullable()
      table.string('full_name', 120).notNullable()
      table.string('display_name', 60).nullable()
      table.string('headline', 160).nullable()
      table.string('tagline', 280).nullable()
      table.text('hero_intro_md').nullable()
      table.text('about_md').nullable()
      table.string('location', 120).nullable()
      table.string('email_public', 254).nullable()
      table.string('phone_public', 40).nullable()
      table.string('availability_text', 160).nullable()
      table
        .integer('avatar_media_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('media')
        .onDelete('SET NULL')
      table
        .integer('resume_media_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('media')
        .onDelete('SET NULL')
      table.timestamp('updated_at').nullable()
    })

    this.schema.raw(`
      ALTER TABLE "profile"
        ADD CONSTRAINT chk_profile_singleton
        CHECK (id = 1)
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
