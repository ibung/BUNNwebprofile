import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, changePasswordValidator } from '#validators/auth'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  /**
   * POST /api/admin/auth/login
   */
  async login({ request, auth, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)

    return response.ok({
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    })
  }

  /**
   * POST /api/admin/auth/logout
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.ok({ data: { message: 'Berhasil keluar.' } })
  }

  /**
   * GET /api/admin/auth/me
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.use('web').getUserOrFail()
    return response.ok({
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    })
  }

  /**
   * PUT /api/admin/auth/password
   */
  async changePassword({ request, auth, response }: HttpContext) {
    const user = auth.use('web').getUserOrFail()
    const { currentPassword, newPassword } = await request.validateUsing(changePasswordValidator)

    const isValid = await hash.verify(user.password, currentPassword)
    if (!isValid) {
      return response.unprocessableEntity({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Kata sandi saat ini salah.',
          details: [{ field: 'currentPassword', message: 'Kata sandi saat ini salah.' }],
        },
      })
    }

    user.password = newPassword
    await user.save()

    return response.ok({ data: { message: 'Kata sandi berhasil diubah.' } })
  }
}
