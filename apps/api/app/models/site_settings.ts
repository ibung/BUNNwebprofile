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
  declare faviconMediaId: number | null

  @column()
  declare footerText: string | null

  @column()
  declare contactFormEnabled: boolean

  // Teks & Judul Segmen Landing Page
  @column()
  declare aboutLabel: string | null

  @column()
  declare aboutTitleMain: string | null

  @column()
  declare aboutTitleAccent: string | null

  @column()
  declare projectsLabel: string | null

  @column()
  declare projectsTitleMain: string | null

  @column()
  declare projectsTitleAccent: string | null

  @column()
  declare projectsSubtitle: string | null

  @column()
  declare skillsLabel: string | null

  @column()
  declare skillsTitleMain: string | null

  @column()
  declare skillsTitleAccent: string | null

  @column()
  declare skillsSubtitle: string | null

  @column()
  declare experiencesLabel: string | null

  @column()
  declare experiencesTitleMain: string | null

  @column()
  declare experiencesTitleAccent: string | null

  @column()
  declare experiencesSubtitle: string | null

  @column()
  declare contactLabel: string | null

  @column()
  declare contactTitleMain: string | null

  @column()
  declare contactTitleAccent: string | null

  @column()
  declare contactSubtitle: string | null

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Media, { foreignKey: 'ogImageMediaId' })
  declare ogImage: BelongsTo<typeof Media>

  @belongsTo(() => Media, { foreignKey: 'faviconMediaId' })
  declare favicon: BelongsTo<typeof Media>
}
