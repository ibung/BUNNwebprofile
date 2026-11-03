import type { HttpContext } from '@adonisjs/core/http'
import Skill from '#models/skill'
import SkillCategory from '#models/skill_category'
import { createSkillValidator, updateSkillValidator } from '#validators/skill'
import { reorderValidator } from '#validators/reorder'
import { ReorderService } from '#services/reorder_service'

export default class SkillsController {
  async index({ request, response }: HttpContext) {
    const categoryId = request.input('categoryId')
    const query = Skill.query()
      .preload('category')
      .preload('media', (q) => q.pivotColumns(['sort_order']).orderBy('pivot_sort_order', 'asc'))
      .orderBy('sortOrder', 'asc')

    if (categoryId) {
      query.where('categoryId', categoryId)
    }

    const skills = await query
    return response.ok({ data: skills })
  }

  async show({ params, response }: HttpContext) {
    const skill = await Skill.query()
      .where('id', params.id)
      .preload('category')
      .preload('media', (q) => q.pivotColumns(['sort_order']).orderBy('pivot_sort_order', 'asc'))
      .preload('projects', (q) => q.select('id', 'title', 'slug', 'status'))
      .firstOrFail()

    return response.ok({ data: skill })
  }

  async store({ request, response }: HttpContext) {
    const { mediaIds, ...payload } = await request.validateUsing(createSkillValidator)

    // Validasi kategori harus ada
    const category = await SkillCategory.find(payload.categoryId)
    if (!category) {
      return response.badRequest({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Kategori keahlian yang dipilih tidak ditemukan.',
          details: [{ field: 'categoryId', message: 'Kategori tidak valid.' }],
        },
      })
    }

    // Validasi keunikan slug global
    const existingSlug = await Skill.findBy('slug', payload.slug)
    if (existingSlug) {
      return response.conflict({
        error: {
          code: 'CONFLICT',
          message: `Slug "${payload.slug}" sudah digunakan oleh keahlian lain.`,
          details: [{ field: 'slug', message: 'Slug harus unik global.' }],
        },
      })
    }

    // Validasi keunikan nama dalam kategori
    const existingName = await Skill.query()
      .where('categoryId', payload.categoryId)
      .whereILike('name', payload.name)
      .first()
    if (existingName) {
      return response.conflict({
        error: {
          code: 'CONFLICT',
          message: `Keahlian dengan nama "${payload.name}" sudah ada dalam kategori ini.`,
          details: [{ field: 'name', message: 'Nama harus unik per kategori.' }],
        },
      })
    }

    if (payload.sortOrder === undefined) {
      const maxSort = await Skill.query()
        .where('categoryId', payload.categoryId)
        .max('sort_order as max')
        .first()
      payload.sortOrder = (maxSort?.$extras.max ?? -1) + 1
    }

    const skill = await Skill.create(payload)

    if (mediaIds && mediaIds.length > 0) {
      const syncMap: Record<number, { sort_order: number }> = {}
      mediaIds.forEach((id, idx) => {
        syncMap[id] = { sort_order: idx }
      })
      await skill.related('media').sync(syncMap)
    }

    await skill.load('category')
    await skill.load('media', (q) =>
      q.pivotColumns(['sort_order']).orderBy('pivot_sort_order', 'asc')
    )

    return response.created({ data: skill })
  }

  async update({ params, request, response }: HttpContext) {
    const skill = await Skill.findOrFail(params.id)
    const { mediaIds, ...payload } = await request.validateUsing(updateSkillValidator)

    if (payload.slug && payload.slug !== skill.slug) {
      const existingSlug = await Skill.query()
        .where('slug', payload.slug)
        .whereNot('id', skill.id)
        .first()
      if (existingSlug) {
        return response.conflict({
          error: {
            code: 'CONFLICT',
            message: `Slug "${payload.slug}" sudah digunakan oleh keahlian lain.`,
            details: [{ field: 'slug', message: 'Slug harus unik global.' }],
          },
        })
      }
    }

    const targetCategoryId = payload.categoryId ?? skill.categoryId
    const targetName = payload.name ?? skill.name
    if (payload.categoryId || payload.name) {
      const existingName = await Skill.query()
        .where('categoryId', targetCategoryId)
        .whereILike('name', targetName)
        .whereNot('id', skill.id)
        .first()
      if (existingName) {
        return response.conflict({
          error: {
            code: 'CONFLICT',
            message: `Keahlian dengan nama "${targetName}" sudah ada dalam kategori ini.`,
            details: [{ field: 'name', message: 'Nama harus unik per kategori.' }],
          },
        })
      }
    }

    skill.merge(payload)
    await skill.save()

    if (mediaIds !== undefined) {
      const syncMap: Record<number, { sort_order: number }> = {}
      mediaIds.forEach((id, idx) => {
        syncMap[id] = { sort_order: idx }
      })
      await skill.related('media').sync(syncMap)
    }

    await skill.load('category')
    await skill.load('media', (q) =>
      q.pivotColumns(['sort_order']).orderBy('pivot_sort_order', 'asc')
    )

    return response.ok({ data: skill })
  }

  async destroy({ params, response }: HttpContext) {
    const skill = await Skill.findOrFail(params.id)
    await skill.delete()
    return response.ok({ data: { message: 'Keahlian berhasil dihapus.' } })
  }

  async reorder({ request, response }: HttpContext) {
    const { ids } = await request.validateUsing(reorderValidator)
    const categoryId = request.input('categoryId')

    await ReorderService.reorder('skills', ids, (query) => {
      if (categoryId) {
        query.where('category_id', categoryId)
      }
    })

    return response.ok({ data: { message: 'Urutan keahlian berhasil diperbarui.' } })
  }
}
