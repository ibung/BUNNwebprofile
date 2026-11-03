import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import type { ExperienceKind } from '@bunn/shared'
import Media from '#models/media'

export default class Experience extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare kind: ExperienceKind

  @column()
  declare title: string

  @column()
  declare organization: string | null

  @column()
  declare descriptionMd: string | null

  @column.date()
  declare startedOn: DateTime

  @column.date()
  declare endedOn: DateTime | null

  @column()
  declare sortOrder: number

  @column()
  declare isVisible: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => Media, {
    pivotTable: 'experience_media',
    pivotColumns: ['sort_order'],
  })
  declare media: ManyToMany<typeof Media>
}
