import vine from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().maxLength(120),
    displayName: vine.string().trim().maxLength(60).nullable().optional(),
    headline: vine.string().trim().maxLength(160).nullable().optional(),
    tagline: vine.string().trim().maxLength(280).nullable().optional(),
    heroIntroMd: vine.string().trim().nullable().optional(),
    aboutMd: vine.string().trim().nullable().optional(),
    location: vine.string().trim().maxLength(120).nullable().optional(),
    emailPublic: vine.string().trim().email().nullable().optional(),
    phonePublic: vine.string().trim().maxLength(40).nullable().optional(),
    availabilityText: vine.string().trim().maxLength(160).nullable().optional(),
    avatarMediaId: vine.number().positive().nullable().optional(),
    resumeMediaId: vine.number().positive().nullable().optional(),
  })
)
