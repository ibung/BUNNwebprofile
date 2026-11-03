import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { MessageStatus } from '@bunn/shared'

export default class ContactMessage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare subject: string | null

  @column()
  declare body: string

  @column()
  declare status: MessageStatus

  @column()
  declare ipHash: string | null

  @column()
  declare userAgent: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime()
  declare readAt: DateTime | null
}
