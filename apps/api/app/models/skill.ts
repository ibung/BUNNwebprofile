import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import type { SkillLevel } from '@bunn/shared'
import SkillCategory from '#models/skill_category'
import Media from '#models/media'
import Project from '#models/project'

export default class Skill extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare categoryId: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare level: SkillLevel | null

  @column()
  declare summary: string

  @column()
  declare descriptionMd: string | null

  @column()
  declare yearsExperience: number | null

  @column()
  declare isVisible: boolean

  @column()
  declare sortOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => SkillCategory)
  declare category: BelongsTo<typeof SkillCategory>

  @manyToMany(() => Media, {
    pivotTable: 'skill_media',
    pivotColumns: ['sort_order'],
  })
  declare media: ManyToMany<typeof Media>

  @manyToMany(() => Project, {
    pivotTable: 'project_skills',
    pivotColumns: ['sort_order'],
  })
  declare projects: ManyToMany<typeof Project>
}
