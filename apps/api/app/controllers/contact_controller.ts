import crypto from 'node:crypto'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import ContactMessage from '#models/contact_message'
import SiteSettings from '#models/site_settings'
import { publicContactValidator } from '#validators/contact'
import env from '#start/env'

export default class ContactController {
  /**
   * POST /api/public/contact
   * Menerima pesan kontak dari pengunjung publik.
   */
  async submit({ request, response }: HttpContext) {
    const payload = await request.validateUsing(publicContactValidator)

    // 1. Bot Honeypot: jika input 'website' terisi, pura-pura sukses tanpa menyimpan ke DB
    if (payload.website && payload.website.trim().length > 0) {
      return response.ok({
        data: { message: 'Pesan berhasil dikirim. Terima kasih!' },
      })
    }

    // 2. Periksa apakah form kontak aktif di pengaturan situs
    const settings = await SiteSettings.find(1)
    if (settings && !settings.contactFormEnabled) {
      return response.forbidden({
        error: {
          code: 'FORBIDDEN',
          message: 'Formulir kontak sedang dinonaktifkan untuk sementara.',
        },
      })
    }

    // 3. Hash IP address dengan salt env (alamat IP mentah tidak pernah disimpan)
    const clientIp = request.ip()
    const salt = env.get('IP_HASH_SALT')
    const ipHash = crypto
      .createHash('sha256')
      .update(clientIp + salt)
      .digest('hex')

    // 4. Rate Limiting: maksimal 5 pesan per 1 jam per IP hash
    const oneHourAgo = DateTime.now().minus({ hours: 1 })
    const recentMessages = await ContactMessage.query()
      .where('ipHash', ipHash)
      .where('createdAt', '>=', oneHourAgo.toSQL()!)
      .count('* as total')
      .first()

    const sentCount = Number(recentMessages?.$extras.total ?? 0)
    if (sentCount >= 5) {
      return response.tooManyRequests({
        error: {
          code: 'RATE_LIMITED',
          message:
            'Terlalu banyak pesan yang dikirim dari perangkat ini. Silakan coba lagi setelah 1 jam.',
        },
      })
    }

    // 5. Simpan pesan kontak ke database
    const userAgent = request.header('user-agent')?.slice(0, 300) ?? null
    await ContactMessage.create({
      name: payload.name,
      email: payload.email,
      subject: payload.subject ?? null,
      body: payload.body,
      status: 'new',
      ipHash,
      userAgent,
    })

    return response.ok({
      data: { message: 'Pesan berhasil dikirim. Terima kasih!' },
    })
  }
}
