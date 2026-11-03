import { BaseModel, column, computed } from '@adonisjs/lucid/orm'
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

  @column({ columnName: 'checksum_sha256' })
  declare checksumSha256: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @computed()
  get urls() {
    const urls: { original?: string; thumb?: string; md?: string; lg?: string } = {}

    if (this.kind === 'image') {
      if (this.storageKey) {
        urls.original = `/uploads/${this.storageKey}`
      }
      if (this.variants) {
        if (this.variants.thumb) {
          urls.thumb = `/uploads/${this.variants.thumb}`
        }
        if (this.variants.md) {
          urls.md = `/uploads/${this.variants.md}`
        }
        if (this.variants.lg) {
          urls.lg = `/uploads/${this.variants.lg}`
        }
      }
    } else if (this.kind === 'video' || this.kind === 'document') {
      if (this.storageKey) {
        urls.original = `/uploads/${this.storageKey}`
      }
    }

    return urls
  }

  @computed()
  get posterUrl() {
    return this.posterKey ? `/uploads/${this.posterKey}` : null
  }

  @computed()
  get youtube() {
    return this.kind === 'youtube' && this.youtubeId
      ? {
          id: this.youtubeId,
          startSeconds: this.youtubeStartSeconds ?? 0,
        }
      : null
  }
}
