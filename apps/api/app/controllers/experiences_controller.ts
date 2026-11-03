import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Experience from '#models/experience'
import { createExperienceValidator, updateExperienceValidator } from '#validators/experience'
import { reorderValidator } from '#validators/reorder'
import { ReorderService } from '#services/reorder_service'
import type { ExperienceKind } from '@bunn/shared'

export default class ExperiencesController {
  async index({ request, response }: HttpContext) {
    const kind = request.input('kind') as ExperienceKind | undefined
    const query = Experience.query()
      .preload('media', (q) => q.orderBy('pivot_sort_order', 'asc'))
      .orderBy('sortOrder', 'asc')

    if (kind) {
      query.where('kind', kind)
    }

    const experiences = await query
    return response.ok({ data: experiences })
  }

  async show({ params, response }: HttpContext) {
    const experience = await Experience.query()
      .where('id', params.id)
      .preload('media', (q) => q.orderBy('pivot_sort_order', 'asc'))
      .firstOrFail()

    return response.ok({ data: experience })
  }

  async store({ request, response }: HttpContext) {
    const { mediaIds, startedOn, endedOn, ...payload } =
      await request.validateUsing(createExperienceValidator)

    if (payload.sortOrder === undefined) {
      const maxSort = await Experience.query().max('sort_order as max').first()
      payload.sortOrder = (maxSort?.$extras.max ?? -1) + 1
    }

    const experience = new Experience()
    experience.merge(payload)
    experience.startedOn = DateTime.fromISO(startedOn)
    if (endedOn) experience.endedOn = DateTime.fromISO(endedOn)

    await experience.save()

    if (mediaIds && mediaIds.length > 0) {
      const syncMap: Record<number, { sort_order: number }> = {}
      mediaIds.forEach((id, idx) => {
        syncMap[id] = { sort_order: idx }
      })
      await experience.related('media').sync(syncMap)
    }

    await experience.load('media', (q) => q.orderBy('pivot_sort_order', 'asc'))

    return response.created({ data: experience })
  }

  async update({ params, request, response }: HttpContext) {
    const experience = await Experience.findOrFail(params.id)
    const { mediaIds, startedOn, endedOn, ...payload } =
      await request.validateUsing(updateExperienceValidator)

    experience.merge(payload)

    if (startedOn) {
      experience.startedOn = DateTime.fromISO(startedOn)
    }
    if (endedOn !== undefined) {
      experience.endedOn = endedOn ? DateTime.fromISO(endedOn) : null
    }

    await experience.save()

    if (mediaIds !== undefined) {
      const syncMap: Record<number, { sort_order: number }> = {}
      mediaIds.forEach((id, idx) => {
        syncMap[id] = { sort_order: idx }
      })
      await experience.related('media').sync(syncMap)
    }

    await experience.load('media', (q) => q.orderBy('pivot_sort_order', 'asc'))

    return response.ok({ data: experience })
  }

  async destroy({ params, response }: HttpContext) {
    const experience = await Experience.findOrFail(params.id)
    await experience.delete()
    return response.ok({ data: { message: 'Pengalaman berhasil dihapus.' } })
  }

  async reorder({ request, response }: HttpContext) {
    const { ids } = await request.validateUsing(reorderValidator)
    await ReorderService.reorder('experiences', ids)
    return response.ok({ data: { message: 'Urutan pengalaman berhasil diperbarui.' } })
  }
}
