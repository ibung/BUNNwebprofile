import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('kind', 10).notNullable()
      table.string('title', 160).nullable()
      table.string('alt_text', 300).nullable()
      table.string('caption', 300).nullable()
      table.string('storage_key', 300).nullable()
      table.string('original_name', 255).nullable()
      table.string('mime_type', 100).nullable()
      table.bigInteger('size_bytes').nullable()
      table.integer('width').nullable()
      table.integer('height').nullable()
      table.integer('duration_seconds').nullable()
      table.jsonb('variants').nullable()
      table.string('poster_key', 300).nullable()
      table.string('youtube_id', 20).nullable()
      table.integer('youtube_start_seconds').nullable()
      table.specificType('checksum_sha256', 'char(64)').nullable()
      table.timestamp('created_at').notNullable()
    })

    this.schema.raw(`
      ALTER TABLE "media"
        ADD CONSTRAINT chk_media_kind
        CHECK (kind IN ('image','video','youtube','document'))
    `)
    this.schema.raw(`
      ALTER TABLE "media"
        ADD CONSTRAINT chk_media_youtube_id
        CHECK ((kind = 'youtube') = (youtube_id IS NOT NULL))
    `)
    this.schema.raw(`
      ALTER TABLE "media"
        ADD CONSTRAINT chk_media_storage_key
        CHECK (kind = 'youtube' OR storage_key IS NOT NULL)
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
