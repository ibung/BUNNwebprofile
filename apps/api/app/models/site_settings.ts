import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Media from '#models/media'

export default class SiteSettings extends BaseModel {
  static table = 'site_settings'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare siteTitle: string

  @column()
  declare metaDescription: string | null

  @column()
  declare ogImageMediaId: number | null

  @column()
  declare footerText: string | null

  @column()
  declare contactFormEnabled: boolean

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Media, { foreignKey: 'ogImageMediaId' })
  declare ogImage: BelongsTo<typeof Media>
}
