import vine from '@vinejs/vine'

export const createYoutubeValidator = vine.compile(
  vine.object({
    url: vine.string().trim(),
    title: vine.string().trim().maxLength(160).optional(),
  })
)

export const updateMediaValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(160).nullable().optional(),
    altText: vine.string().trim().maxLength(300).nullable().optional(),
    caption: vine.string().trim().maxLength(300).nullable().optional(),
  })
)
