import vine from '@vinejs/vine'

export const updateSiteSettingsValidator = vine.compile(
  vine.object({
    siteTitle: vine.string().trim().maxLength(80),
    metaDescription: vine.string().trim().maxLength(300).nullable().optional(),
    ogImageMediaId: vine.number().positive().nullable().optional(),
    faviconMediaId: vine.number().positive().nullable().optional(),
    footerText: vine.string().trim().maxLength(200).nullable().optional(),
    contactFormEnabled: vine.boolean().optional(),

    aboutLabel: vine.string().trim().maxLength(80).nullable().optional(),
    aboutTitleMain: vine.string().trim().maxLength(120).nullable().optional(),
    aboutTitleAccent: vine.string().trim().maxLength(120).nullable().optional(),

    projectsLabel: vine.string().trim().maxLength(80).nullable().optional(),
    projectsTitleMain: vine.string().trim().maxLength(120).nullable().optional(),
    projectsTitleAccent: vine.string().trim().maxLength(120).nullable().optional(),
    projectsSubtitle: vine.string().trim().maxLength(500).nullable().optional(),

    skillsLabel: vine.string().trim().maxLength(80).nullable().optional(),
    skillsTitleMain: vine.string().trim().maxLength(120).nullable().optional(),
    skillsTitleAccent: vine.string().trim().maxLength(120).nullable().optional(),
    skillsSubtitle: vine.string().trim().maxLength(500).nullable().optional(),

    experiencesLabel: vine.string().trim().maxLength(80).nullable().optional(),
    experiencesTitleMain: vine.string().trim().maxLength(120).nullable().optional(),
    experiencesTitleAccent: vine.string().trim().maxLength(120).nullable().optional(),
    experiencesSubtitle: vine.string().trim().maxLength(500).nullable().optional(),

    contactLabel: vine.string().trim().maxLength(80).nullable().optional(),
    contactTitleMain: vine.string().trim().maxLength(120).nullable().optional(),
    contactTitleAccent: vine.string().trim().maxLength(120).nullable().optional(),
    contactSubtitle: vine.string().trim().maxLength(500).nullable().optional(),
  })
)
