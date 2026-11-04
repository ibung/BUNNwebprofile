import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Project from '#models/project'
import Media from '#models/media'
import {
  createProjectValidator,
  updateProjectValidator,
  updateProjectStatusValidator,
} from '#validators/project'
import { reorderValidator } from '#validators/reorder'
import { ReorderService } from '#services/reorder_service'
import type { PublishStatus } from '@bunn/shared'

export default class ProjectsController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = Math.min(request.input('perPage', 20), 50)
    const status = request.input('status') as PublishStatus | undefined
    const q = request.input('q', '').trim()

    const query = Project.query()
      .preload('coverMedia')
      .preload('skills', (qSkills) => qSkills.orderBy('pivot_sort_order', 'asc'))
      .preload('media', (qMedia) => qMedia.orderBy('pivot_sort_order', 'asc'))
      .orderBy('sortOrder', 'asc')

    if (status) {
      query.where('status', status)
    }

    if (q) {
      query.where((builder) => {
        builder.whereILike('title', `%${q}%`).orWhereILike('summary', `%${q}%`)
      })
    }

    const paginated = await query.paginate(page, perPage)

    return response.ok({
      data: paginated.all(),
      meta: {
        total: paginated.total,
        page: paginated.currentPage,
        perPage: paginated.perPage,
      },
    })
  }

  async show({ params, response }: HttpContext) {
    const project = await Project.query()
      .where('id', params.id)
      .preload('coverMedia')
      .preload('skills', (qSkills) => qSkills.orderBy('pivot_sort_order', 'asc'))
      .preload('media', (qMedia) => qMedia.orderBy('pivot_sort_order', 'asc'))
      .firstOrFail()

    return response.ok({ data: project })
  }

  async store({ request, response }: HttpContext) {
    const { skillIds, mediaIds, startedOn, endedOn, ...payload } =
      await request.validateUsing(createProjectValidator)

    const rawSlug =
      payload.slug && payload.slug.trim() !== ''
        ? payload.slug.trim()
        : payload.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || `proyek-${Date.now()}`

    const existingSlug = await Project.findBy('slug', rawSlug)
    if (existingSlug) {
      return response.conflict({
        error: {
          code: 'CONFLICT',
          message: `Slug "${rawSlug}" sudah digunakan oleh proyek lain.`,
          details: [{ field: 'slug', message: 'Slug harus unik.' }],
        },
      })
    }

    if (payload.coverMediaId) {
      const cover = await Media.find(payload.coverMediaId)
      if (!cover) {
        return response.badRequest({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Cover media tidak ditemukan.',
            details: [{ field: 'coverMediaId', message: 'Media tidak valid.' }],
          },
        })
      }
    }

    if (payload.sortOrder === undefined) {
      const maxSort = await Project.query().max('sort_order as max').first()
      payload.sortOrder = (maxSort?.$extras.max ?? -1) + 1
    }

    const isPublished = payload.status === 'published'
    if (isPublished) {
      if (!payload.summary || payload.summary.trim() === '') {
        return response.badRequest({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Ringkasan proyek wajib diisi sebelum diterbitkan.',
            details: [{ field: 'summary', message: 'Ringkasan wajib diisi.' }],
          },
        })
      }
      if (!payload.coverMediaId) {
        return response.badRequest({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Cover media wajib dipilih sebelum diterbitkan.',
            details: [{ field: 'coverMediaId', message: 'Cover media wajib dipilih.' }],
          },
        })
      }
    }

    const project = new Project()
    project.merge({
      ...payload,
      slug: rawSlug,
      summary: payload.summary ?? '',
      descriptionMd: payload.descriptionMd ?? '',
    })

    if (startedOn) project.startedOn = DateTime.fromISO(startedOn)
    if (endedOn) project.endedOn = DateTime.fromISO(endedOn)

    if (isPublished) {
      project.publishedAt = DateTime.now()
    }

    await project.save()

    // Sync relasi skills
    if (skillIds && skillIds.length > 0) {
      const syncSkills: Record<number, { sort_order: number }> = {}
      skillIds.forEach((id, idx) => {
        syncSkills[id] = { sort_order: idx }
      })
      await project.related('skills').sync(syncSkills)
    }

    // Sync relasi galeri media
    if (mediaIds && mediaIds.length > 0) {
      const syncMedia: Record<number, { sort_order: number }> = {}
      mediaIds.forEach((id, idx) => {
        syncMedia[id] = { sort_order: idx }
      })
      await project.related('media').sync(syncMedia)
    }

    await project.load('coverMedia')
    await project.load('skills', (q) => q.orderBy('pivot_sort_order', 'asc'))
    await project.load('media', (q) => q.orderBy('pivot_sort_order', 'asc'))

    return response.created({ data: project })
  }

  async update({ params, request, response }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    const { skillIds, mediaIds, startedOn, endedOn, ...payload } =
      await request.validateUsing(updateProjectValidator)

    if (payload.slug && payload.slug !== project.slug) {
      const existingSlug = await Project.query()
        .where('slug', payload.slug)
        .whereNot('id', project.id)
        .first()
      if (existingSlug) {
        return response.conflict({
          error: {
            code: 'CONFLICT',
            message: `Slug "${payload.slug}" sudah digunakan oleh proyek lain.`,
            details: [{ field: 'slug', message: 'Slug harus unik.' }],
          },
        })
      }
    }

    if (payload.coverMediaId) {
      const cover = await Media.find(payload.coverMediaId)
      if (!cover) {
        return response.badRequest({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Cover media tidak ditemukan.',
            details: [{ field: 'coverMediaId', message: 'Media tidak valid.' }],
          },
        })
      }
    }

    if (payload.status === 'published') {
      const finalSummary = payload.summary !== undefined ? payload.summary : project.summary
      const finalCoverId =
        payload.coverMediaId !== undefined ? payload.coverMediaId : project.coverMediaId

      if (!finalSummary || finalSummary.trim() === '') {
        return response.badRequest({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Ringkasan proyek wajib diisi sebelum diterbitkan.',
            details: [{ field: 'summary', message: 'Ringkasan wajib diisi.' }],
          },
        })
      }
      if (!finalCoverId) {
        return response.badRequest({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Cover media wajib dipilih sebelum diterbitkan.',
            details: [{ field: 'coverMediaId', message: 'Cover media wajib dipilih.' }],
          },
        })
      }
    }

    project.merge({
      ...payload,
      ...(payload.summary !== undefined ? { summary: payload.summary ?? '' } : {}),
      ...(payload.descriptionMd !== undefined
        ? { descriptionMd: payload.descriptionMd ?? '' }
        : {}),
    })

    if (startedOn !== undefined) {
      project.startedOn = startedOn ? DateTime.fromISO(startedOn) : null
    }
    if (endedOn !== undefined) {
      project.endedOn = endedOn ? DateTime.fromISO(endedOn) : null
    }

    // Aturan publikasi: jika beralih ke published dan belum ada tanggal terbit
    if (payload.status === 'published' && !project.publishedAt) {
      project.publishedAt = DateTime.now()
    }

    await project.save()

    if (skillIds !== undefined) {
      const syncSkills: Record<number, { sort_order: number }> = {}
      skillIds.forEach((id, idx) => {
        syncSkills[id] = { sort_order: idx }
      })
      await project.related('skills').sync(syncSkills)
    }

    if (mediaIds !== undefined) {
      const syncMedia: Record<number, { sort_order: number }> = {}
      mediaIds.forEach((id, idx) => {
        syncMedia[id] = { sort_order: idx }
      })
      await project.related('media').sync(syncMedia)
    }

    await project.load('coverMedia')
    await project.load('skills', (q) => q.orderBy('pivot_sort_order', 'asc'))
    await project.load('media', (q) => q.orderBy('pivot_sort_order', 'asc'))

    return response.ok({ data: project })
  }

  async updateStatus({ params, request, response }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    const { status } = await request.validateUsing(updateProjectStatusValidator)

    if (status === 'published') {
      if (!project.summary || project.summary.trim() === '') {
        return response.badRequest({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Ringkasan proyek wajib diisi sebelum diterbitkan.',
            details: [{ field: 'summary', message: 'Ringkasan proyek wajib diisi.' }],
          },
        })
      }
      if (!project.coverMediaId) {
        return response.badRequest({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Cover media wajib dipilih sebelum diterbitkan.',
            details: [{ field: 'coverMediaId', message: 'Cover media wajib dipilih.' }],
          },
        })
      }
    }

    project.status = status
    if (status === 'published' && !project.publishedAt) {
      project.publishedAt = DateTime.now()
    }

    await project.save()
    return response.ok({ data: project })
  }

  async destroy({ params, response }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    await project.delete()
    return response.ok({ data: { message: 'Proyek berhasil dihapus.' } })
  }

  async reorder({ request, response }: HttpContext) {
    const { ids } = await request.validateUsing(reorderValidator)
    await ReorderService.reorder('projects', ids)
    return response.ok({ data: { message: 'Urutan proyek berhasil diperbarui.' } })
  }
}
