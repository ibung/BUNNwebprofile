import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'

export default class ResetAdminPassword extends BaseCommand {
  static commandName = 'admin:reset-password'
  static description = 'Reset kata sandi admin secara interaktif'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const email = await this.prompt.ask('Masukkan email admin:', {
      validate: (value) => (value && value.includes('@') ? true : 'Email tidak valid'),
    })

    const user = await User.findBy('email', email.trim().toLowerCase())

    if (!user) {
      this.logger.error(`User dengan email "${email}" tidak ditemukan.`)
      this.exitCode = 1
      return
    }

    const newPassword = await this.prompt.secure(
      'Masukkan kata sandi baru (minimal 12 karakter):',
      {
        validate: (value) =>
          value && value.length >= 12 ? true : 'Kata sandi minimal 12 karakter',
      }
    )

    const confirmPassword = await this.prompt.secure('Konfirmasi kata sandi baru:')
    if (newPassword !== confirmPassword) {
      this.logger.error('Kata sandi konfirmasi tidak cocok.')
      this.exitCode = 1
      return
    }

    user.password = newPassword
    await user.save()

    this.logger.success(`Kata sandi untuk ${user.email} berhasil diperbarui!`)
  }
}
