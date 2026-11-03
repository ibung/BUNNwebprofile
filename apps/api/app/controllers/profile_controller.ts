import type { HttpContext } from '@adonisjs/core/http'
import Profile from '#models/profile'
import Media from '#models/media'
import { updateProfileValidator } from '#validators/profile'

export default class ProfileController {
  /**
   * GET /api/admin/profile
   */
  async show({ response }: HttpContext) {
    let profile = await Profile.query().where('id', 1).preload('avatar').preload('resume').first()

    if (!profile) {
      profile = await Profile.create({
        id: 1,
        fullName: 'TODO: Nama Pemilik',
        displayName: 'TODO',
        headline: 'TODO: Headline',
      })
      await profile.load('avatar')
      await profile.load('resume')
    }

    return response.ok({ data: profile })
  }

  /**
   * PUT /api/admin/profile
   */
  async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProfileValidator)

    if (payload.avatarMediaId) {
      const media = await Media.find(payload.avatarMediaId)
      if (!media) {
        return response.badRequest({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Media avatar yang dipilih tidak ditemukan.',
            details: [{ field: 'avatarMediaId', message: 'Media tidak ditemukan.' }],
          },
        })
      }
    }

    if (payload.resumeMediaId) {
      const media = await Media.find(payload.resumeMediaId)
      if (!media) {
        return response.badRequest({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Media resume yang dipilih tidak ditemukan.',
            details: [{ field: 'resumeMediaId', message: 'Media tidak ditemukan.' }],
          },
        })
      }
    }

    let profile = await Profile.find(1)
    if (!profile) {
      profile = new Profile()
      profile.id = 1
    }

    profile.merge(payload)
    await profile.save()

    await profile.load('avatar')
    await profile.load('resume')

    return response.ok({ data: profile })
  }
}
