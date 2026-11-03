import vine from '@vinejs/vine'
import { SOCIAL_PLATFORMS } from '@bunn/shared'

export const createSocialLinkValidator = vine.compile(
  vine.object({
    platform: vine.enum(SOCIAL_PLATFORMS),
    label: vine.string().trim().maxLength(60),
    url: vine.string().trim(),
    sortOrder: vine.number().optional(),
    isVisible: vine.boolean().optional(),
  })
)

export const updateSocialLinkValidator = vine.compile(
  vine.object({
    platform: vine.enum(SOCIAL_PLATFORMS).optional(),
    label: vine.string().trim().maxLength(60).optional(),
    url: vine.string().trim().optional(),
    sortOrder: vine.number().optional(),
    isVisible: vine.boolean().optional(),
  })
)
