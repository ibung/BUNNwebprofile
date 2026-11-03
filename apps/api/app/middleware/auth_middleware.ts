import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Middleware auth untuk rute admin. Default ke guard 'web' (session cookie).
 */
export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { guards?: 'web'[] } = {}) {
    await ctx.auth.authenticateUsing(options.guards ?? ['web'])
    return next()
  }
}
