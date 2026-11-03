import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'
import SkillCategory from '#models/skill_category'
import Skill from '#models/skill'
import Project from '#models/project'
import Highlight from '#models/highlight'
import ProfileFact from '#models/profile_fact'
import SocialLink from '#models/social_link'
import Experience from '#models/experience'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    if (app.inProduction) {
      throw new Error(
        '[DEMO SEEDER] Dilarang keras menjalankan demo seeder di lingkungan produksi!'
      )
    }

    // 1. Fakta Profil Demo
    await ProfileFact.updateOrCreateMany('label', [
      {
        label: 'Pendidikan',
        value: '[DEMO] S1 Teknik Informatika',
        sortOrder: 1,
        isVisible: true,
      },
      {
        label: 'Domisili',
        value: '[DEMO] Bandung, Indonesia',
        sortOrder: 2,
        isVisible: true,
      },
      {
        label: 'Fokus',
        value: '[DEMO] Web Frontend & Automation Testing',
        sortOrder: 3,
        isVisible: true,
      },
    ])

    // 2. Tautan Sosial Demo
    await SocialLink.updateOrCreateMany('url', [
      {
        platform: 'github',
        label: 'GitHub [DEMO]',
        url: 'https://github.com/demo-user',
        sortOrder: 1,
        isVisible: true,
      },
      {
        platform: 'linkedin',
        label: 'LinkedIn [DEMO]',
        url: 'https://linkedin.com/in/demo-user',
        sortOrder: 2,
        isVisible: true,
      },
    ])

    // 3. Sorotan Angka Demo
    await Highlight.updateOrCreateMany(
      ['label', 'placement'],
      [
        {
          placement: 'about',
          value: '15+',
          label: '[DEMO] Proyek Selesai',
          note: 'Website & Web Apps',
          sortOrder: 1,
          isVisible: true,
        },
        {
          placement: 'skills',
          value: '±500',
          label: '[DEMO] Test Case Dirancang',
          note: 'E2E & API test suites',
          sortOrder: 1,
          isVisible: true,
        },
      ]
    )

    // 4. Kategori & Skill Demo
    const frontendCategory = await SkillCategory.firstOrCreate(
      { slug: 'frontend-demo' },
      {
        name: '[DEMO] Frontend Development',
        slug: 'frontend-demo',
        description: 'Pengembangan antarmuka web modern dan responsif.',
        accent: 'red',
        sortOrder: 1,
        isVisible: true,
      }
    )

    const qaCategory = await SkillCategory.firstOrCreate(
      { slug: 'qa-testing-demo' },
      {
        name: '[DEMO] Quality Assurance',
        slug: 'qa-testing-demo',
        description: 'Pengujian perangkat lunak manual & otomatis.',
        accent: 'yellow',
        sortOrder: 2,
        isVisible: true,
      }
    )

    const vueSkill = await Skill.firstOrCreate(
      { slug: 'vue-nuxt-demo' },
      {
        categoryId: frontendCategory.id,
        name: 'Vue.js & Nuxt [DEMO]',
        slug: 'vue-nuxt-demo',
        level: 'strong',
        summary: 'Pengalaman membangun aplikasi SPA & SSR dengan Nuxt 3/4.',
        descriptionMd: '### Vue.js & Nuxt\n\nMenguasai Vue 3 Composition API, Pinia, dan Nuxt SSR.',
        yearsExperience: 2.5,
        sortOrder: 1,
        isVisible: true,
      }
    )

    const playwrightSkill = await Skill.firstOrCreate(
      { slug: 'playwright-demo' },
      {
        categoryId: qaCategory.id,
        name: 'Playwright & E2E [DEMO]',
        slug: 'playwright-demo',
        level: 'comfortable',
        summary: 'Automated end-to-end browser testing.',
        descriptionMd:
          '### Playwright E2E\n\nMampu menyusun automated test runner, cross-browser test suites, dan CI integration.',
        yearsExperience: 1.5,
        sortOrder: 1,
        isVisible: true,
      }
    )

    // 5. Proyek Demo
    const demoProject = await Project.firstOrCreate(
      { slug: 'bunn-portfolio-demo' },
      {
        slug: 'bunn-portfolio-demo',
        title: '[DEMO] Portofolio Pribadi & CMS',
        summary: 'Situs portofolio pribadi berbasis Nuxt dan AdonisJS dengan CMS mandiri.',
        descriptionMd:
          '## Deskripsi Proyek\n\nProyek showcase portofolio dengan sistem manajemen konten dinamis.',
        role: 'Fullstack Developer',
        kind: 'Website',
        status: 'published',
        isFeatured: true,
        demoUrl: 'https://bunn.my.id',
        repoUrl: 'https://github.com/demo/repo',
        startedOn: DateTime.fromISO('2026-01-01'),
        endedOn: null,
        sortOrder: 1,
        publishedAt: DateTime.now(),
      }
    )

    // Pasangkan skill ke proyek demo
    await demoProject.related('skills').sync([vueSkill.id, playwrightSkill.id])

    // 6. Perjalanan / Pengalaman Demo
    await Experience.firstOrCreate(
      { title: '[DEMO] Frontend Engineer Intern' },
      {
        kind: 'work',
        title: '[DEMO] Frontend Engineer Intern',
        organization: 'Tech Innovators Corp',
        descriptionMd:
          'Mengembangkan fitur-fitur antarmuka web dan mengoptimalkan performa halaman.',
        startedOn: DateTime.fromISO('2025-06-01'),
        endedOn: DateTime.fromISO('2025-12-01'),
        sortOrder: 1,
        isVisible: true,
      }
    )
  }
}
