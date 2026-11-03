import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contact_messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 120).notNullable()
      table.string('email', 254).notNullable()
      table.string('subject', 200).nullable()
      table.text('body').notNullable()
      table.string('status', 10).notNullable().defaultTo('new')
      table.specificType('ip_hash', 'char(64)').nullable()
      table.string('user_agent', 300).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('read_at').nullable()
    })

    this.schema.raw(`
      ALTER TABLE "contact_messages"
        ADD CONSTRAINT chk_contact_messages_status
        CHECK (status IN ('new','read','archived','spam'))
    `)
    this.schema.raw(`
      CREATE INDEX idx_contact_messages_status_created
        ON "contact_messages" (status, created_at DESC)
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
