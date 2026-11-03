import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HighlightPlacement } from '@bunn/shared'

export default class Highlight extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare placement: HighlightPlacement

  @column()
  declare value: string

  @column()
  declare label: string

  @column()
  declare note: string | null

  @column()
  declare sortOrder: number

  @column()
  declare isVisible: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
