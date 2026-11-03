import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('profile', (table) => {
      table.string('hero_prefix', 60).nullable().defaultTo('Halo, saya')
    })

    this.schema.alterTable('social_links', (table) => {
      table
        .integer('media_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('media')
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable('social_links', (table) => {
      table.dropColumn('media_id')
    })

    this.schema.alterTable('profile', (table) => {
      table.dropColumn('hero_prefix')
    })
  }
}
