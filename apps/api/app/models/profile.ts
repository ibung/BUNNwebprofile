import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Media from '#models/media'

export default class Profile extends BaseModel {
  static table = 'profile'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string

  @column()
  declare displayName: string | null

  @column()
  declare headline: string | null

  @column()
  declare tagline: string | null

  @column()
  declare heroIntroMd: string | null

  @column()
  declare aboutMd: string | null

  @column()
  declare location: string | null

  @column()
  declare emailPublic: string | null

  @column()
  declare phonePublic: string | null

  @column()
  declare availabilityText: string | null

  @column()
  declare avatarMediaId: number | null

  @column()
  declare resumeMediaId: number | null

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Media, { foreignKey: 'avatarMediaId' })
  declare avatar: BelongsTo<typeof Media>

  @belongsTo(() => Media, { foreignKey: 'resumeMediaId' })
  declare resume: BelongsTo<typeof Media>
}
