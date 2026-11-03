import vine from '@vinejs/vine'
import { SKILL_LEVELS } from '@bunn/shared'

export const createSkillValidator = vine.compile(
  vine.object({
    categoryId: vine.number().positive(),
    name: vine.string().trim().maxLength(80),
    slug: vine
      .string()
      .trim()
      .maxLength(100)
      .regex(/^[a-z0-9-]+$/),
    level: vine.enum(SKILL_LEVELS).nullable().optional(),
    summary: vine.string().trim().maxLength(280),
    descriptionMd: vine.string().trim().nullable().optional(),
    yearsExperience: vine.number().min(0).max(99.9).nullable().optional(),
    sortOrder: vine.number().optional(),
    isVisible: vine.boolean().optional(),
    mediaIds: vine.array(vine.number().positive()).optional(),
  })
)

export const updateSkillValidator = vine.compile(
  vine.object({
    categoryId: vine.number().positive().optional(),
    name: vine.string().trim().maxLength(80).optional(),
    slug: vine
      .string()
      .trim()
      .maxLength(100)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    level: vine.enum(SKILL_LEVELS).nullable().optional(),
    summary: vine.string().trim().maxLength(280).optional(),
    descriptionMd: vine.string().trim().nullable().optional(),
    yearsExperience: vine.number().min(0).max(99.9).nullable().optional(),
    sortOrder: vine.number().optional(),
    isVisible: vine.boolean().optional(),
    mediaIds: vine.array(vine.number().positive()).optional(),
  })
)
