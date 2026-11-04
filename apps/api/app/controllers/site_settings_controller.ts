import type { HttpContext } from '@adonisjs/core/http'
import SiteSettings from '#models/site_settings'
import Media from '#models/media'
import { updateSiteSettingsValidator } from '#validators/site_settings'

export default class SiteSettingsController {
  /**
   * GET /api/admin/settings
   */
  async show({ response }: HttpContext) {
    let settings = await SiteSettings.query()
      .where('id', 1)
      .preload('ogImage')
      .preload('favicon')
      .first()

    if (!settings) {
      settings = await SiteSettings.create({
        id: 1,
        siteTitle: 'TODO: Judul Portofolio',
        metaDescription: 'TODO: Deskripsi',
        contactFormEnabled: true,
      })
      await settings.load('ogImage')
      await settings.load('favicon')
    }

    return response.ok({ data: settings })
  }

  /**
   * PUT /api/admin/settings
   */
  async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateSiteSettingsValidator)

    if (payload.ogImageMediaId) {
      const media = await Media.find(payload.ogImageMediaId)
      if (!media) {
        return response.badRequest({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Media OG Image yang dipilih tidak ditemukan.',
            details: [{ field: 'ogImageMediaId', message: 'Media tidak ditemukan.' }],
          },
        })
      }
    }

    if (payload.faviconMediaId) {
      const media = await Media.find(payload.faviconMediaId)
      if (!media) {
        return response.badRequest({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Media Favicon yang dipilih tidak ditemukan.',
            details: [{ field: 'faviconMediaId', message: 'Media tidak ditemukan.' }],
          },
        })
      }
    }

    let settings = await SiteSettings.find(1)
    if (!settings) {
      settings = new SiteSettings()
      settings.id = 1
    }

    settings.merge(payload)
    await settings.save()

    await settings.load('ogImage')
    await settings.load('favicon')

    return response.ok({ data: settings })
  }
}
