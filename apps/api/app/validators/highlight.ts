import vine from '@vinejs/vine'
import { HIGHLIGHT_PLACEMENTS } from '@bunn/shared'

export const createHighlightValidator = vine.compile(
  vine.object({
    placement: vine.enum(HIGHLIGHT_PLACEMENTS),
    value: vine.string().trim().maxLength(40),
    label: vine.string().trim().maxLength(120),
    note: vine.string().trim().maxLength(200).nullable().optional(),
    sortOrder: vine.number().optional(),
    isVisible: vine.boolean().optional(),
  })
)

export const updateHighlightValidator = vine.compile(
  vine.object({
    placement: vine.enum(HIGHLIGHT_PLACEMENTS).optional(),
    value: vine.string().trim().maxLength(40).optional(),
    label: vine.string().trim().maxLength(120).optional(),
    note: vine.string().trim().maxLength(200).nullable().optional(),
    sortOrder: vine.number().optional(),
    isVisible: vine.boolean().optional(),
  })
)
