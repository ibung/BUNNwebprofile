import vine from '@vinejs/vine'

export const createProfileFactValidator = vine.compile(
  vine.object({
    label: vine.string().trim().maxLength(60),
    value: vine.string().trim().maxLength(200),
    sortOrder: vine.number().optional(),
    isVisible: vine.boolean().optional(),
  })
)

export const updateProfileFactValidator = vine.compile(
  vine.object({
    label: vine.string().trim().maxLength(60).optional(),
    value: vine.string().trim().maxLength(200).optional(),
    sortOrder: vine.number().optional(),
    isVisible: vine.boolean().optional(),
  })
)
