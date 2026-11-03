import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import ContactMessage from '#models/contact_message'
import { updateMessageStatusValidator } from '#validators/contact'
import type { MessageStatus } from '@bunn/shared'

export default class MessagesController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = Math.min(request.input('perPage', 20), 50)
    const status = request.input('status') as MessageStatus | undefined
    const q = request.input('q', '').trim()

    const query = ContactMessage.query().orderBy('createdAt', 'desc')

    if (status) {
      query.where('status', status)
    }

    if (q) {
      query.where((builder) => {
        builder
          .whereILike('name', `%${q}%`)
          .orWhereILike('email', `%${q}%`)
          .orWhereILike('subject', `%${q}%`)
          .orWhereILike('body', `%${q}%`)
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
    const message = await ContactMessage.findOrFail(params.id)

    // Jika pesan masih baru, tandai telah dibaca secara otomatis
    if (message.status === 'new') {
      message.status = 'read'
      message.readAt = DateTime.now()
      await message.save()
    }

    return response.ok({ data: message })
  }

  async update({ params, request, response }: HttpContext) {
    const message = await ContactMessage.findOrFail(params.id)
    const payload = await request.validateUsing(updateMessageStatusValidator)

    message.status = payload.status
    if (payload.status === 'read' && !message.readAt) {
      message.readAt = DateTime.now()
    }

    await message.save()
    return response.ok({ data: message })
  }

  async destroy({ params, response }: HttpContext) {
    const message = await ContactMessage.findOrFail(params.id)
    await message.delete()
    return response.ok({ data: { message: 'Pesan berhasil dihapus.' } })
  }
}
