import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Profile from '#models/profile'
import SiteSettings from '#models/site_settings'
import env from '#start/env'

export default class extends BaseSeeder {
  async run() {
    // 1. Buat admin pertama dari environment variable bila disediakan
    const adminEmail = env.get('ADMIN_EMAIL')
    const adminPassword = env.get('ADMIN_PASSWORD')

    if (adminEmail && adminPassword) {
      const existingUser = await User.findBy('email', adminEmail)
      if (!existingUser) {
        await User.create({
          email: adminEmail,
          password: adminPassword,
          fullName: 'Admin',
        })
      }
    }

    // 2. Baris singleton profile dengan placeholder TODO:
    const profile = await Profile.find(1)
    if (!profile) {
      await Profile.create({
        id: 1,
        fullName: 'TODO: Nama Pemilik',
        displayName: 'TODO',
        headline: 'TODO: Frontend Developer & QA Tester',
        tagline: 'TODO: Tagline singkat',
        heroIntroMd: 'TODO: Paragraf pengantar hero',
        aboutMd: 'TODO: Cerita dan latar belakang tentang diri',
        location: 'TODO: Lokasi',
        emailPublic: 'TODO: email@example.com',
        availabilityText: 'TODO: Status ketersediaan',
      })
    }

    // 3. Baris singleton site_settings dengan placeholder TODO:
    const settings = await SiteSettings.find(1)
    if (!settings) {
      await SiteSettings.create({
        id: 1,
        siteTitle: 'TODO: Judul Portofolio',
        metaDescription: 'TODO: Deskripsi meta untuk mesin pencari dan media sosial',
        footerText: 'TODO: Hak Cipta & teks footer',
        contactFormEnabled: true,
      })
    }
  }
}
