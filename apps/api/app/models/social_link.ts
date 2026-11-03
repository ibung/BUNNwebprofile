import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import type { SocialPlatform } from '@bunn/shared'
import Media from '#models/media'

export default class SocialLink extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare platform: SocialPlatform

  @column()
  declare label: string

  @column()
  declare url: string

  @column()
  declare mediaId: number | null

  @belongsTo(() => Media, { foreignKey: 'mediaId' })
  declare media: BelongsTo<typeof Media>

  @column()
  declare sortOrder: number

  @column()
  declare isVisible: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
