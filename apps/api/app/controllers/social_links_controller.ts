import type { HttpContext } from '@adonisjs/core/http'
import SocialLink from '#models/social_link'
import { createSocialLinkValidator, updateSocialLinkValidator } from '#validators/social_link'
import { reorderValidator } from '#validators/reorder'
import { ReorderService } from '#services/reorder_service'

export default class SocialLinksController {
  async index({ response }: HttpContext) {
    const links = await SocialLink.query().orderBy('sortOrder', 'asc')
    return response.ok({ data: links })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createSocialLinkValidator)

    if (payload.platform === 'email' && !payload.url.startsWith('mailto:')) {
      payload.url = `mailto:${payload.url.replace(/^mailto:/, '')}`
    }

    if (payload.sortOrder === undefined) {
      const maxSort = await SocialLink.query().max('sort_order as max').first()
      payload.sortOrder = (maxSort?.$extras.max ?? -1) + 1
    }

    const link = await SocialLink.create(payload)
    return response.created({ data: link })
  }

  async update({ params, request, response }: HttpContext) {
    const link = await SocialLink.findOrFail(params.id)
    const payload = await request.validateUsing(updateSocialLinkValidator)

    const effectivePlatform = payload.platform ?? link.platform
    if (payload.url && effectivePlatform === 'email' && !payload.url.startsWith('mailto:')) {
      payload.url = `mailto:${payload.url.replace(/^mailto:/, '')}`
    }

    link.merge(payload)
    await link.save()

    return response.ok({ data: link })
  }

  async destroy({ params, response }: HttpContext) {
    const link = await SocialLink.findOrFail(params.id)
    await link.delete()
    return response.ok({ data: { message: 'Tautan sosial berhasil dihapus.' } })
  }

  async reorder({ request, response }: HttpContext) {
    const { ids } = await request.validateUsing(reorderValidator)
    await ReorderService.reorder('social_links', ids)
    return response.ok({ data: { message: 'Urutan tautan sosial berhasil diperbarui.' } })
  }
}
