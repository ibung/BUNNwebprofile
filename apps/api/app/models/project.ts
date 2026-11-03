import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import type { PublishStatus } from '@bunn/shared'
import Media from '#models/media'
import Skill from '#models/skill'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slug: string

  @column()
  declare title: string

  @column()
  declare summary: string

  @column()
  declare descriptionMd: string

  @column()
  declare role: string | null

  @column()
  declare kind: string | null

  @column()
  declare status: PublishStatus

  @column()
  declare isFeatured: boolean

  @column()
  declare demoUrl: string | null

  @column()
  declare repoUrl: string | null

  @column.date()
  declare startedOn: DateTime | null

  @column.date()
  declare endedOn: DateTime | null

  @column()
  declare coverMediaId: number | null

  @column()
  declare sortOrder: number

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Media, { foreignKey: 'coverMediaId' })
  declare coverMedia: BelongsTo<typeof Media>

  @manyToMany(() => Skill, {
    pivotTable: 'project_skills',
    pivotColumns: ['sort_order'],
  })
  declare skills: ManyToMany<typeof Skill>

  @manyToMany(() => Media, {
    pivotTable: 'project_media',
    pivotColumns: ['sort_order'],
  })
  declare media: ManyToMany<typeof Media>
}
