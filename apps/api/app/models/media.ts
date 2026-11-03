import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { MediaKind } from '@bunn/shared'

export default class Media extends BaseModel {
  static table = 'media'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare kind: MediaKind

  @column()
  declare title: string | null

  @column()
  declare altText: string | null

  @column()
  declare caption: string | null

  @column()
  declare storageKey: string | null

  @column()
  declare originalName: string | null

  @column()
  declare mimeType: string | null

  @column()
  declare sizeBytes: number | null

  @column()
  declare width: number | null

  @column()
  declare height: number | null

  @column()
  declare durationSeconds: number | null

  @column()
  declare variants: Record<string, string> | null

  @column()
  declare posterKey: string | null

  @column()
  declare youtubeId: string | null

  @column()
  declare youtubeStartSeconds: number | null

  @column()
  declare checksumSha256: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
