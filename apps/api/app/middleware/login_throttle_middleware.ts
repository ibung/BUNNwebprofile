import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Pembatas laju sederhana berbasis memori.
 * Cocok untuk admin tunggal. Untuk skala besar ganti dengan Redis/database.
 */
const attempts = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 15 * 60 * 1000 // 15 menit
const MAX_ATTEMPTS = 5

export default class LoginThrottleMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const ip = ctx.request.ip()
    const email = (ctx.request.body() as { email?: string }).email ?? ''
    const key = `login:${ip}:${email.toLowerCase()}`

    const now = Date.now()
    const entry = attempts.get(key)

    if (entry && now < entry.resetAt) {
      if (entry.count >= MAX_ATTEMPTS) {
        ctx.response.status(429).send({
          error: {
            code: 'RATE_LIMITED',
            message: `Terlalu banyak percobaan login. Coba lagi dalam ${Math.ceil((entry.resetAt - now) / 60_000)} menit.`,
          },
        })
        return
      }
      entry.count++
    } else {
      attempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    }

    const result = await next()

    // Bersihkan entri lama secara periodik (setiap 100 permintaan)
    if (attempts.size > 100) {
      for (const [k, v] of attempts) {
        if (now > v.resetAt) attempts.delete(k)
      }
    }

    return result
  }
}
