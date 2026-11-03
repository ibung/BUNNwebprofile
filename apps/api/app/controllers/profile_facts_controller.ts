import type { HttpContext } from '@adonisjs/core/http'
import ProfileFact from '#models/profile_fact'
import { createProfileFactValidator, updateProfileFactValidator } from '#validators/profile_fact'
import { reorderValidator } from '#validators/reorder'
import { ReorderService } from '#services/reorder_service'

export default class ProfileFactsController {
  async index({ response }: HttpContext) {
    const facts = await ProfileFact.query().orderBy('sortOrder', 'asc')
    return response.ok({ data: facts })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProfileFactValidator)

    if (payload.sortOrder === undefined) {
      const maxSort = await ProfileFact.query().max('sort_order as max').first()
      payload.sortOrder = (maxSort?.$extras.max ?? -1) + 1
    }

    const fact = await ProfileFact.create(payload)
    return response.created({ data: fact })
  }

  async update({ params, request, response }: HttpContext) {
    const fact = await ProfileFact.findOrFail(params.id)
    const payload = await request.validateUsing(updateProfileFactValidator)

    fact.merge(payload)
    await fact.save()

    return response.ok({ data: fact })
  }

  async destroy({ params, response }: HttpContext) {
    const fact = await ProfileFact.findOrFail(params.id)
    await fact.delete()
    return response.ok({ data: { message: 'Fakta profil berhasil dihapus.' } })
  }

  async reorder({ request, response }: HttpContext) {
    const { ids } = await request.validateUsing(reorderValidator)
    await ReorderService.reorder('profile_facts', ids)
    return response.ok({ data: { message: 'Urutan fakta berhasil diperbarui.' } })
  }
}
