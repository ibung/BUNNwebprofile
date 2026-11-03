import type { HttpContext } from '@adonisjs/core/http'
import SkillCategory from '#models/skill_category'
import Skill from '#models/skill'
import {
  createSkillCategoryValidator,
  updateSkillCategoryValidator,
} from '#validators/skill_category'
import { reorderValidator } from '#validators/reorder'
import { ReorderService } from '#services/reorder_service'

export default class SkillCategoriesController {
  async index({ response }: HttpContext) {
    const categories = await SkillCategory.query().withCount('skills').orderBy('sortOrder', 'asc')
    return response.ok({ data: categories })
  }

  async show({ params, response }: HttpContext) {
    const category = await SkillCategory.query()
      .where('id', params.id)
      .preload('skills', (q) => q.orderBy('sortOrder', 'asc'))
      .firstOrFail()
    return response.ok({ data: category })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createSkillCategoryValidator)

    const existingSlug = await SkillCategory.findBy('slug', payload.slug)
    if (existingSlug) {
      return response.conflict({
        error: {
          code: 'CONFLICT',
          message: `Slug "${payload.slug}" sudah digunakan oleh kategori lain.`,
          details: [{ field: 'slug', message: 'Slug harus unik.' }],
        },
      })
    }

    if (payload.sortOrder === undefined) {
      const maxSort = await SkillCategory.query().max('sort_order as max').first()
      payload.sortOrder = (maxSort?.$extras.max ?? -1) + 1
    }

    const category = await SkillCategory.create(payload)
    return response.created({ data: category })
  }

  async update({ params, request, response }: HttpContext) {
    const category = await SkillCategory.findOrFail(params.id)
    const payload = await request.validateUsing(updateSkillCategoryValidator)

    if (payload.slug && payload.slug !== category.slug) {
      const existingSlug = await SkillCategory.query()
        .where('slug', payload.slug)
        .whereNot('id', category.id)
        .first()
      if (existingSlug) {
        return response.conflict({
          error: {
            code: 'CONFLICT',
            message: `Slug "${payload.slug}" sudah digunakan oleh kategori lain.`,
            details: [{ field: 'slug', message: 'Slug harus unik.' }],
          },
        })
      }
    }

    category.merge(payload)
    await category.save()

    return response.ok({ data: category })
  }

  async destroy({ params, response }: HttpContext) {
    const category = await SkillCategory.findOrFail(params.id)

    // Proteksi ON DELETE RESTRICT: cegah hapus jika masih memiliki skill
    const skillCount = await Skill.query()
      .where('categoryId', category.id)
      .count('* as total')
      .first()

    if (Number(skillCount?.$extras.total ?? 0) > 0) {
      return response.conflict({
        error: {
          code: 'CONFLICT',
          message:
            'Kategori ini tidak dapat dihapus karena masih memuat keahlian (skill). Pindahkan atau hapus keahlian terkait terlebih dahulu.',
        },
      })
    }

    await category.delete()
    return response.ok({ data: { message: 'Kategori keahlian berhasil dihapus.' } })
  }

  async reorder({ request, response }: HttpContext) {
    const { ids } = await request.validateUsing(reorderValidator)
    await ReorderService.reorder('skill_categories', ids)
    return response.ok({ data: { message: 'Urutan kategori berhasil diperbarui.' } })
  }
}
