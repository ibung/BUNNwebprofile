import vine from '@vinejs/vine'
import { CATEGORY_ACCENTS } from '@bunn/shared'

export const createSkillCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(80),
    slug: vine
      .string()
      .trim()
      .maxLength(100)
      .regex(/^[a-z0-9-]+$/),
    description: vine.string().trim().maxLength(280).nullable().optional(),
    accent: vine.enum(CATEGORY_ACCENTS).optional(),
    sortOrder: vine.number().optional(),
    isVisible: vine.boolean().optional(),
  })
)

export const updateSkillCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(80).optional(),
    slug: vine
      .string()
      .trim()
      .maxLength(100)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    description: vine.string().trim().maxLength(280).nullable().optional(),
    accent: vine.enum(CATEGORY_ACCENTS).optional(),
    sortOrder: vine.number().optional(),
    isVisible: vine.boolean().optional(),
  })
)
