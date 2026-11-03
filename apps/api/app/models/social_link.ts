import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { SocialPlatform } from '@bunn/shared'

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
  declare sortOrder: number

  @column()
  declare isVisible: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
