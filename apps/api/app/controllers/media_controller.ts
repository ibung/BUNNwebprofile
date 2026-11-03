import fs from 'node:fs/promises'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Media from '#models/media'
import { MediaService } from '#services/media_service'
import { YouTubeService } from '#services/youtube_service'
import PublicMediaTransformer from '#transformers/public_media_transformer'
import { createYoutubeValidator, updateMediaValidator } from '#validators/media'
import type { MediaKind } from '@bunn/shared'

export default class MediaController {
  /**
   * GET /api/admin/media
   * Daftar media dengan filter jenis, pencarian kata kunci, dan pagination.
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = Math.min(request.input('perPage', 20), 50)
    const kind = request.input('kind') as MediaKind | undefined
    const q = request.input('q', '').trim()

    const query = Media.query().orderBy('createdAt', 'desc')

    if (kind) {
      query.where('kind', kind)
    }

    if (q) {
      query.where((builder) => {
        builder
          .whereILike('title', `%${q}%`)
          .orWhereILike('caption', `%${q}%`)
          .orWhereILike('originalName', `%${q}%`)
          .orWhereILike('altText', `%${q}%`)
      })
    }

    const paginated = await query.paginate(page, perPage)

    return response.ok({
      data: PublicMediaTransformer.transformMany(paginated.all()),
      meta: {
        total: paginated.total,
        page: paginated.currentPage,
        perPage: paginated.perPage,
      },
    })
  }

  /**
   * GET /api/admin/media/:id
   * Detail media beserta daftar entitas yang sedang memakainya.
   */
  async show({ params, response }: HttpContext) {
    const media = await Media.findOrFail(params.id)

    // Deteksi penggunaan di seluruh tabel relasi
    const usages: Array<{ type: string; id?: number; label: string }> = []

    const profileAvatar = await db.from('profile').where('avatar_media_id', media.id).first()
    if (profileAvatar) {
      usages.push({ type: 'profile', label: 'Foto Avatar Profil' })
    }

    const profileResume = await db.from('profile').where('resume_media_id', media.id).first()
    if (profileResume) {
      usages.push({ type: 'profile', label: 'Berkas CV / Resume' })
    }

    const siteOg = await db.from('site_settings').where('og_image_media_id', media.id).first()
    if (siteOg) {
      usages.push({ type: 'site_settings', label: 'Gambar Open Graph (OG)' })
    }

    const projectCovers = await db
      .from('projects')
      .where('cover_media_id', media.id)
      .select('id', 'title')
    for (const p of projectCovers) {
      usages.push({ type: 'project', id: p.id, label: `Cover Proyek: ${p.title}` })
    }

    const projectGalleries = await db
      .from('project_media')
      .join('projects', 'projects.id', 'project_media.project_id')
      .where('project_media.media_id', media.id)
      .select('projects.id', 'projects.title')
    for (const p of projectGalleries) {
      usages.push({ type: 'project_gallery', id: p.id, label: `Galeri Proyek: ${p.title}` })
    }

    const skillGalleries = await db
      .from('skill_media')
      .join('skills', 'skills.id', 'skill_media.skill_id')
      .where('skill_media.media_id', media.id)
      .select('skills.id', 'skills.name')
    for (const s of skillGalleries) {
      usages.push({ type: 'skill', id: s.id, label: `Galeri Skill: ${s.name}` })
    }

    const expGalleries = await db
      .from('experience_media')
      .join('experiences', 'experiences.id', 'experience_media.experience_id')
      .where('experience_media.media_id', media.id)
      .select('experiences.id', 'experiences.title')
    for (const e of expGalleries) {
      usages.push({ type: 'experience', id: e.id, label: `Galeri Pengalaman: ${e.title}` })
    }

    const transformed = PublicMediaTransformer.transform(media)
    return response.ok({
      data: {
        ...transformed,
        usages,
      },
    })
  }

  /**
   * POST /api/admin/media/upload
   * Unggah satu atau beberapa berkas (multipart).
   */
  async upload({ request, response }: HttpContext) {
    const rawFiles = request.files('files')
    const singleFile = request.file('file')

    const uploadedFiles = rawFiles.length > 0 ? rawFiles : singleFile ? [singleFile] : []

    if (uploadedFiles.length === 0) {
      return response.badRequest({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Tidak ada berkas yang diunggah.',
          details: [{ field: 'file', message: 'Silakan pilih berkas yang ingin diunggah.' }],
        },
      })
    }

    const createdRecords: Media[] = []

    for (const file of uploadedFiles) {
      if (!file.tmpPath) {
        continue
      }

      const buffer = await fs.readFile(file.tmpPath)
      const processed = await MediaService.processAndStore(buffer, file.clientName ?? 'unknown')

      const sniffed = MediaService.sniffType(buffer)!
      const media = await Media.create({
        kind: sniffed.kind,
        title: null,
        altText: null,
        caption: null,
        storageKey: processed.storageKey,
        originalName: processed.originalName,
        mimeType: processed.mimeType,
        sizeBytes: processed.sizeBytes,
        width: processed.width,
        height: processed.height,
        variants: processed.variants,
        checksumSha256: processed.checksumSha256,
      })

      createdRecords.push(media)
    }

    const transformed = PublicMediaTransformer.transformMany(createdRecords)

    return response.created({
      data: createdRecords.length === 1 ? transformed[0] : transformed,
    })
  }

  /**
   * POST /api/admin/media/youtube
   * Mendaftarkan tautan video YouTube.
   */
  async createYoutube({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createYoutubeValidator)

    const parsed = YouTubeService.parse(payload.url)
    if (!parsed) {
      return response.unprocessableEntity({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Format tautan YouTube tidak valid atau tidak dikenali.',
          details: [{ field: 'url', message: 'Pastikan format URL YouTube benar.' }],
        },
      })
    }

    const media = await Media.create({
      kind: 'youtube',
      youtubeId: parsed.id,
      youtubeStartSeconds: parsed.startSeconds,
      title: payload.title ?? null,
      altText: null,
      caption: null,
    })

    return response.created({ data: PublicMediaTransformer.transform(media) })
  }

  /**
   * PATCH /api/admin/media/:id
   * Memperbarui metadata media (title, altText, caption).
   */
  async update({ params, request, response }: HttpContext) {
    const media = await Media.findOrFail(params.id)
    const payload = await request.validateUsing(updateMediaValidator)

    if (payload.title !== undefined) media.title = payload.title
    if (payload.altText !== undefined) media.altText = payload.altText
    if (payload.caption !== undefined) media.caption = payload.caption

    await media.save()

    return response.ok({ data: PublicMediaTransformer.transform(media) })
  }

  /**
   * DELETE /api/admin/media/:id
   * Menghapus media dari database dan menghapus berkas fisiknya dari disk.
   */
  async destroy({ params, response }: HttpContext) {
    const media = await Media.findOrFail(params.id)

    const storageKey = media.storageKey
    const variants = media.variants
    const posterKey = media.posterKey

    // Hapus baris DB (foreign key pivot akan CASCADE, kolom lain akan SET NULL)
    await media.delete()

    // Hapus berkas fisik setelah DB berhasil terhapus
    if (storageKey) {
      await MediaService.deletePhysicalFiles(storageKey, variants, posterKey)
    }

    return response.ok({
      data: { message: 'Berkas media berhasil dihapus.' },
    })
  }
}
