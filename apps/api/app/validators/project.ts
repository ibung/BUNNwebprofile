import vine from '@vinejs/vine'
import { PUBLISH_STATUSES } from '@bunn/shared'

export const createProjectValidator = vine.compile(
  vine.object({
    slug: vine
      .string()
      .trim()
      .maxLength(120)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    title: vine.string().trim().maxLength(160),
    summary: vine.string().trim().maxLength(320).optional(),
    descriptionMd: vine.string().trim().optional(),
    role: vine.string().trim().maxLength(120).nullable().optional(),
    kind: vine.string().trim().maxLength(60).nullable().optional(),
    status: vine.enum(PUBLISH_STATUSES).optional(),
    isFeatured: vine.boolean().optional(),
    demoUrl: vine.string().trim().maxLength(500).nullable().optional(),
    repoUrl: vine.string().trim().maxLength(500).nullable().optional(),
    startedOn: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable()
      .optional(),
    endedOn: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable()
      .optional(),
    coverMediaId: vine.number().positive().nullable().optional(),
    sortOrder: vine.number().optional(),
    skillIds: vine.array(vine.number().positive()).optional(),
    mediaIds: vine.array(vine.number().positive()).optional(),
  })
)

export const updateProjectValidator = vine.compile(
  vine.object({
    slug: vine
      .string()
      .trim()
      .maxLength(120)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    title: vine.string().trim().maxLength(160).optional(),
    summary: vine.string().trim().maxLength(320).optional(),
    descriptionMd: vine.string().trim().optional(),
    role: vine.string().trim().maxLength(120).nullable().optional(),
    kind: vine.string().trim().maxLength(60).nullable().optional(),
    status: vine.enum(PUBLISH_STATUSES).optional(),
    isFeatured: vine.boolean().optional(),
    demoUrl: vine.string().trim().maxLength(500).nullable().optional(),
    repoUrl: vine.string().trim().maxLength(500).nullable().optional(),
    startedOn: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable()
      .optional(),
    endedOn: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable()
      .optional(),
    coverMediaId: vine.number().positive().nullable().optional(),
    sortOrder: vine.number().optional(),
    skillIds: vine.array(vine.number().positive()).optional(),
    mediaIds: vine.array(vine.number().positive()).optional(),
  })
)

export const updateProjectStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(PUBLISH_STATUSES),
  })
)
