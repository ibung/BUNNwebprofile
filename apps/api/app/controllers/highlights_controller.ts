import type { HttpContext } from '@adonisjs/core/http'
import Highlight from '#models/highlight'
import { createHighlightValidator, updateHighlightValidator } from '#validators/highlight'
import { reorderValidator } from '#validators/reorder'
import { ReorderService } from '#services/reorder_service'
import type { HighlightPlacement } from '@bunn/shared'

export default class HighlightsController {
  async index({ request, response }: HttpContext) {
    const placement = request.input('placement') as HighlightPlacement | undefined
    const query = Highlight.query().orderBy('sortOrder', 'asc')

    if (placement) {
      query.where('placement', placement)
    }

    const highlights = await query
    return response.ok({ data: highlights })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createHighlightValidator)

    if (payload.sortOrder === undefined) {
      const maxSort = await Highlight.query()
        .where('placement', payload.placement)
        .max('sort_order as max')
        .first()
      payload.sortOrder = (maxSort?.$extras.max ?? -1) + 1
    }

    const highlight = await Highlight.create(payload)
    return response.created({ data: highlight })
  }

  async update({ params, request, response }: HttpContext) {
    const highlight = await Highlight.findOrFail(params.id)
    const payload = await request.validateUsing(updateHighlightValidator)

    highlight.merge(payload)
    await highlight.save()

    return response.ok({ data: highlight })
  }

  async destroy({ params, response }: HttpContext) {
    const highlight = await Highlight.findOrFail(params.id)
    await highlight.delete()
    return response.ok({ data: { message: 'Sorotan angka berhasil dihapus.' } })
  }

  async reorder({ request, response }: HttpContext) {
    const { ids } = await request.validateUsing(reorderValidator)
    const placement = request.input('placement') as HighlightPlacement | undefined

    await ReorderService.reorder('highlights', ids, (query) => {
      if (placement) {
        query.where('placement', placement)
      }
    })

    return response.ok({ data: { message: 'Urutan sorotan berhasil diperbarui.' } })
  }
}
