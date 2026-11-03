import vine from '@vinejs/vine'

export const updateSiteSettingsValidator = vine.compile(
  vine.object({
    siteTitle: vine.string().trim().maxLength(80),
    metaDescription: vine.string().trim().maxLength(300).nullable().optional(),
    ogImageMediaId: vine.number().positive().nullable().optional(),
    footerText: vine.string().trim().maxLength(200).nullable().optional(),
    contactFormEnabled: vine.boolean().optional(),
  })
)
