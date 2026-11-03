import vine from '@vinejs/vine'
import { EXPERIENCE_KINDS } from '@bunn/shared'

export const createExperienceValidator = vine.compile(
  vine.object({
    kind: vine.enum(EXPERIENCE_KINDS),
    title: vine.string().trim().maxLength(160),
    organization: vine.string().trim().maxLength(160).nullable().optional(),
    descriptionMd: vine.string().trim().nullable().optional(),
    startedOn: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endedOn: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable()
      .optional(),
    sortOrder: vine.number().optional(),
    isVisible: vine.boolean().optional(),
    mediaIds: vine.array(vine.number().positive()).optional(),
  })
)

export const updateExperienceValidator = vine.compile(
  vine.object({
    kind: vine.enum(EXPERIENCE_KINDS).optional(),
    title: vine.string().trim().maxLength(160).optional(),
    organization: vine.string().trim().maxLength(160).nullable().optional(),
    descriptionMd: vine.string().trim().nullable().optional(),
    startedOn: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    endedOn: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable()
      .optional(),
    sortOrder: vine.number().optional(),
    isVisible: vine.boolean().optional(),
    mediaIds: vine.array(vine.number().positive()).optional(),
  })
)
