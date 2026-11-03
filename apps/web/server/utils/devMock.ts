import type { H3Event } from 'h3'
import type {
  PublicHomeData,
  PublicProjectItem,
  PublicProjectDetail,
  PublicSkillDetail,
  PublicMedia,
} from '@bunn/shared'

const heroMedia: PublicMedia = {
  id: 1,
  kind: 'image',
  title: 'BUNN Portfolio Hero Cover',
  altText: 'Tangkapan layar halaman utama BUNN Web Profile',
  caption: 'Desain responsif portofolio pribadi',
  width: 1200,
  height: 800,
  urls: {
    original: '/uploads/hero-cover.webp',
    thumb: '/uploads/hero-cover.webp',
    md: '/uploads/hero-cover.webp',
    lg: '/uploads/hero-cover.webp',
  },
  youtube: null,
  posterUrl: null,
  mimeType: 'image/webp',
  durationSeconds: null,
}

const avatarMedia: PublicMedia = {
  id: 2,
  kind: 'image',
  title: 'Avatar Ibnu Hilmi',
  altText: 'Foto profil Ibnu Hilmi Athaillah',
  caption: null,
  width: 400,
  height: 400,
  urls: {
    original: '/uploads/avatar.webp',
    thumb: '/uploads/avatar.webp',
    md: '/uploads/avatar.webp',
    lg: '/uploads/avatar.webp',
  },
  youtube: null,
  posterUrl: null,
  mimeType: 'image/webp',
  durationSeconds: null,
}

const videoMedia: PublicMedia = {
  id: 3,
  kind: 'youtube',
  title: 'Demo Interaktif Portofolio',
  altText: 'Video demo alur pengujian QA dan fitur CMS',
  caption: 'Walkthrough arsitektur monorepo Nuxt 4 dan AdonisJS 7',
  width: 1280,
  height: 720,
  urls: {},
  youtube: { id: 'dQw4w9WgXcQ', startSeconds: 0 },
  posterUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  mimeType: null,
  durationSeconds: 212,
}

const allMedia: PublicMedia[] = [heroMedia, avatarMedia, videoMedia]

const mockPublicHome: PublicHomeData = {
  settings: {
    siteTitle: 'Ibnu Hilmi Athaillah — Frontend Developer & QA Tester',
    metaDescription:
      'Portofolio pribadi dan CMS kustom Ibnu Hilmi Athaillah (bunn.my.id). Frontend Developer & QA Tester berbasis di Bandung.',
    footerText: '© 2026 Ibnu Hilmi Athaillah. Dibuat dengan Nuxt 4 & AdonisJS 7.',
    ogImage: heroMedia,
    contactFormEnabled: true,
  },
  profile: {
    fullName: 'Ibnu Hilmi Athaillah',
    displayName: 'Ibnu Hilmi (Bunn)',
    headline: 'Frontend Developer & QA Tester',
    tagline: 'Membangun antarmuka web presisi dan menguji keandalan sistem tanpa kompromi.',
    heroIntroHtml:
      '<p>Halo! Saya <strong>Ibnu Hilmi Athaillah</strong>, seorang <em>Frontend Developer</em> dan <em>QA Tester</em> yang berfokus pada performa, aksesibilitas semantik, dan keandalan sistem web modern.</p>',
    aboutHtml:
      '<p>Saya memiliki ketertarikan mendalam pada ekosistem JavaScript/TypeScript modern (Vue, Nuxt) dan otomasi pengujian kualitas perangkat lunak (Playwright, Jest, E2E). Terbiasa merancang UI yang solid sesuai token desain serta memastikan produk teruji secara menyeluruh sebelum rilis ke pengguna akhir.</p>',
    location: 'Bandung, Indonesia',
    emailPublic: 'ibnupisces08@gmail.com',
    phonePublic: null,
    availabilityText: 'Tersedia untuk proyek freelance & kerja sama',
    avatar: avatarMedia,
    resume: null,
  },
  facts: [
    { label: 'Pendidikan', value: 'S1 Teknik Informatika' },
    { label: 'Domisili', value: 'Bandung, Indonesia' },
    { label: 'Fokus', value: 'Vue/Nuxt & QA Automation' },
    { label: 'Pengalaman', value: '2+ Tahun' },
  ],
  socials: [
    { platform: 'github', label: 'GitHub', url: 'https://github.com/ibung' },
    { platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
    { platform: 'instagram', label: 'Instagram', url: 'https://instagram.com' },
  ],
  highlights: {
    about: [
      { id: 1, value: '15+', label: 'Proyek Web Selesai', note: 'Frontend SPA & SSR' },
      { id: 2, value: '99%', label: 'Skor Aksesibilitas', note: 'WCAG 2.1 AA Compliant' },
    ],
    skills: [
      { id: 3, value: '500+', label: 'Test Case Dirancang', note: 'E2E & Unit Test Suites' },
      { id: 4, value: '<100ms', label: 'Waktu Respons API', note: 'Optimasi query & caching' },
    ],
  },
  featuredProjects: [
    {
      id: 1,
      slug: 'bunn-web-portfolio',
      title: 'BUNN Personal Profile & Custom CMS',
      summary:
        'Situs portofolio pribadi dengan arsitektur monorepo, backend tak terlihat, dan panel admin CMS mandiri.',
      role: 'Fullstack Developer & QA',
      kind: 'Personal Website',
      isFeatured: true,
      demoUrl: 'https://bunn.my.id',
      repoUrl: 'https://github.com/ibung/BUNNwebprofile',
      startedOn: '2026-01-01',
      endedOn: null,
      publishedAt: '2026-11-01T00:00:00Z',
      cover: heroMedia,
      skills: [
        { id: 1, name: 'Nuxt 4', slug: 'nuxt' },
        { id: 2, name: 'AdonisJS 7', slug: 'adonisjs' },
        { id: 3, name: 'TypeScript', slug: 'typescript' },
        { id: 4, name: 'PostgreSQL', slug: 'postgresql' },
      ],
    },
    {
      id: 2,
      slug: 'qa-automation-framework',
      title: 'E2E Test Automation Suite',
      summary:
        'Framework otomasi pengujian end-to-end berbasis Playwright dengan pelaporan CI/CD terintegrasi.',
      role: 'QA Engineer',
      kind: 'Testing Framework',
      isFeatured: true,
      demoUrl: null,
      repoUrl: 'https://github.com/ibung',
      startedOn: '2025-06-01',
      endedOn: '2025-12-01',
      publishedAt: '2025-12-10T00:00:00Z',
      cover: heroMedia,
      skills: [
        { id: 5, name: 'Playwright', slug: 'playwright' },
        { id: 3, name: 'TypeScript', slug: 'typescript' },
      ],
    },
  ],
  skillCategories: [
    {
      slug: 'frontend-development',
      name: 'Frontend Development',
      description: 'Membangun antarmuka web interaktif, responsif, dan ramah aksesibilitas.',
      accent: 'red',
      skills: [
        {
          id: 1,
          name: 'Nuxt 4 & Vue 3',
          slug: 'nuxt',
          level: 'strong',
          summary: 'Composition API, SSR, optimasi Nitro, dan arsitektur komponen.',
          yearsExperience: 2.5,
        },
        {
          id: 3,
          name: 'TypeScript',
          slug: 'typescript',
          level: 'strong',
          summary: 'Pengetikan ketat, generic types, dan monorepo shared contract.',
          yearsExperience: 2,
        },
        {
          id: 6,
          name: 'CSS & Design Tokens',
          slug: 'css-design-tokens',
          level: 'strong',
          summary: 'Responsive layout, semantic styling, dan fluid typography.',
          yearsExperience: 3,
        },
      ],
    },
    {
      slug: 'qa-and-testing',
      name: 'Quality Assurance & Testing',
      description: 'Pengujian perangkat lunak sistematis untuk memastikan integritas produk.',
      accent: 'yellow',
      skills: [
        {
          id: 5,
          name: 'Playwright & E2E',
          slug: 'playwright',
          level: 'strong',
          summary: 'Cross-browser automated testing, visual regression, dan CI pipeline.',
          yearsExperience: 1.5,
        },
        {
          id: 7,
          name: 'API Testing & Japa',
          slug: 'api-testing',
          level: 'comfortable',
          summary: 'Validasi endpoint, session auth, rate limiting, dan stress test.',
          yearsExperience: 1.5,
        },
      ],
    },
  ],
  experiences: [
    {
      id: 1,
      kind: 'project',
      title: 'Fullstack Monorepo Portfolio',
      organization: 'BUNN Profile',
      descriptionHtml:
        '<p>Membangun situs web profil pribadi lengkap dengan backend AdonisJS 7 terisolasi, panel CMS mandiri, dan integrasi Docker.</p>',
      startedOn: '2026-01-01',
      endedOn: null,
      media: [heroMedia],
    },
    {
      id: 2,
      kind: 'work',
      title: 'Frontend Developer & QA Intern',
      organization: 'Digital Software House',
      descriptionHtml:
        '<p>Bertanggung jawab atas implementasi antarmuka klien berbasis Vue.js dan merancang automated test script untuk memangkas regresi rilis sebesar 40%.</p>',
      startedOn: '2025-02-01',
      endedOn: '2025-10-01',
      media: [],
    },
    {
      id: 3,
      kind: 'education',
      title: 'S1 Teknik Informatika',
      organization: 'Universitas',
      descriptionHtml:
        '<p>Fokus studi pada Rekayasa Perangkat Lunak, Pengujian Kualitas, dan Sistem Terdistribusi.</p>',
      startedOn: '2021-09-01',
      endedOn: '2025-08-01',
      media: [],
    },
  ],
}

export function handleDevMock(event: H3Event): unknown {
  const path = event.path
  const method = event.method

  // Public Endpoints
  if (path === '/api/public/home' || path === '/public/home') {
    return mockPublicHome
  }

  if (path === '/api/public/projects' || path === '/public/projects') {
    return { data: mockPublicHome.featuredProjects }
  }

  if (path.startsWith('/api/public/projects/') || path.startsWith('/public/projects/')) {
    const slug = path.split('/').pop()
    const firstProject = mockPublicHome.featuredProjects[0]!
    const found: PublicProjectItem =
      mockPublicHome.featuredProjects.find((p) => p.slug === slug) ?? firstProject
    const detail: PublicProjectDetail = {
      id: found.id,
      slug: found.slug,
      title: found.title,
      summary: found.summary,
      role: found.role,
      kind: found.kind,
      isFeatured: found.isFeatured,
      demoUrl: found.demoUrl,
      repoUrl: found.repoUrl,
      startedOn: found.startedOn,
      endedOn: found.endedOn,
      publishedAt: found.publishedAt,
      cover: found.cover,
      skills: found.skills,
      descriptionHtml: `<h2>${found.title}</h2><p>${found.summary}</p><p>Proyek ini dibangun menggunakan teknologi mutakhir untuk memberikan pengalaman pengguna yang mulus dan performa maksimal.</p><h3>Fitur Utama</h3><ul><li>Arsitektur monorepo pnpm workspace</li><li>Kontrak tipe bersama melalui @bunn/shared</li><li>CMS kustom terisolasi untuk pengelolaan konten dinamis</li></ul>`,
      media: allMedia,
    }
    return { data: detail }
  }

  if (path === '/api/public/skills' || path === '/public/skills') {
    return { data: mockPublicHome.skillCategories }
  }

  if (path.startsWith('/api/public/skills/') || path.startsWith('/public/skills/')) {
    const slug = path.split('/').pop()
    const detail: PublicSkillDetail = {
      id: 1,
      slug: slug || 'nuxt',
      name: 'Nuxt 4 & Vue 3',
      level: 'strong',
      summary: 'Composition API, SSR, optimasi Nitro, dan arsitektur komponen.',
      descriptionHtml:
        '<p>Pengalaman mendalam mengembangkan aplikasi web skala produksi dengan Nuxt 4, Vue 3, dan TypeScript. Mengutamakan performa loading, SEO friendly, dan struktur kode yang rapi.</p>',
      yearsExperience: 2.5,
      category: {
        slug: 'frontend-development',
        name: 'Frontend Development',
        accent: 'red',
      },
      media: [heroMedia],
      projects: mockPublicHome.featuredProjects,
    }
    return { data: detail }
  }

  if (path === '/api/public/contact' || path === '/public/contact') {
    return { success: true, message: 'Pesan Anda telah berhasil dikirim! (Dev Mode)' }
  }

  // Admin Auth
  if (path.includes('/admin/auth/me')) {
    return { user: { id: 1, email: 'ibnupisces08@gmail.com' } }
  }

  if (path.includes('/admin/auth/login')) {
    return { success: true, user: { id: 1, email: 'ibnupisces08@gmail.com' } }
  }

  if (path.includes('/admin/auth/logout')) {
    return { success: true }
  }

  // Admin Dashboard
  if (path.includes('/admin/dashboard')) {
    return {
      metrics: {
        publishedProjects: mockPublicHome.featuredProjects.length,
        draftProjects: 1,
        newMessages: 2,
        totalMedia: allMedia.length,
      },
      attention: {
        missingAltText: 1,
        projectsWithoutCover: 0,
        unreadMessages: 2,
      },
    }
  }

  // Admin Media
  if (path.includes('/admin/media')) {
    if (method === 'POST') {
      return { data: heroMedia }
    }
    if (method === 'PATCH') {
      return { data: heroMedia }
    }
    if (method === 'DELETE') {
      return { success: true }
    }
    return {
      data: allMedia.map((m) => ({
        ...m,
        storageKey: `uploads/${m.id}.webp`,
        originalName: `${m.title}.webp`,
        sizeBytes: 154200,
        checksumSha256: 'mock-sha256-hash-value',
        createdAt: '2026-11-01T10:00:00Z',
        usages: [{ entity: 'project', id: 1, title: 'BUNN Personal Profile' }],
      })),
    }
  }

  // Admin Profile
  if (path.includes('/admin/profile')) {
    if (method === 'PUT') {
      return { data: mockPublicHome.profile }
    }
    return {
      data: {
        profile: {
          id: 1,
          fullName: mockPublicHome.profile.fullName,
          displayName: mockPublicHome.profile.displayName,
          headline: mockPublicHome.profile.headline,
          tagline: mockPublicHome.profile.tagline,
          heroIntroMd:
            'Halo! Saya **Ibnu Hilmi Athaillah**, seorang *Frontend Developer* dan *QA Tester*.',
          aboutMd:
            'Saya memiliki ketertarikan mendalam pada ekosistem JavaScript/TypeScript modern dan otomasi pengujian kualitas.',
          location: mockPublicHome.profile.location,
          emailPublic: mockPublicHome.profile.emailPublic,
          phonePublic: mockPublicHome.profile.phonePublic,
          availabilityText: mockPublicHome.profile.availabilityText,
          avatarMediaId: 2,
          resumeMediaId: null,
          avatar: avatarMedia,
          resume: null,
        },
        facts: mockPublicHome.facts.map((f, i) => ({
          id: i + 1,
          label: f.label,
          value: f.value,
          sortOrder: i + 1,
          isVisible: true,
        })),
        socials: mockPublicHome.socials.map((s, i) => ({
          id: i + 1,
          platform: s.platform,
          label: s.label,
          url: s.url,
          sortOrder: i + 1,
          isVisible: true,
        })),
        highlights: [
          ...mockPublicHome.highlights.about.map((h, i) => ({
            id: h.id,
            placement: 'about' as const,
            value: h.value,
            label: h.label,
            note: h.note,
            sortOrder: i + 1,
            isVisible: true,
          })),
          ...mockPublicHome.highlights.skills.map((h, i) => ({
            id: h.id,
            placement: 'skills' as const,
            value: h.value,
            label: h.label,
            note: h.note,
            sortOrder: i + 1,
            isVisible: true,
          })),
        ],
      },
    }
  }

  // Admin Settings
  if (path.includes('/admin/settings')) {
    if (method === 'PUT') {
      return { data: mockPublicHome.settings }
    }
    return {
      data: {
        id: 1,
        siteTitle: mockPublicHome.settings.siteTitle,
        metaDescription: mockPublicHome.settings.metaDescription,
        ogImageMediaId: 1,
        footerText: mockPublicHome.settings.footerText,
        contactFormEnabled: mockPublicHome.settings.contactFormEnabled,
        ogImage: heroMedia,
      },
    }
  }

  // Admin Projects
  if (path.includes('/admin/projects')) {
    if (method === 'POST' || method === 'PUT') {
      return { data: mockPublicHome.featuredProjects[0] }
    }
    if (method === 'DELETE') {
      return { success: true }
    }
    return {
      data: mockPublicHome.featuredProjects.map((p) => ({
        ...p,
        descriptionMd: `## ${p.title}\n\n${p.summary}`,
        status: 'published',
        coverMediaId: 1,
        coverMedia: heroMedia,
        sortOrder: p.id,
      })),
    }
  }

  // Admin Skills
  if (path.includes('/admin/skills')) {
    if (path.includes('/categories')) {
      return {
        data: mockPublicHome.skillCategories.map((c, i) => ({
          id: i + 1,
          name: c.name,
          slug: c.slug,
          description: c.description,
          accent: c.accent,
          sortOrder: i + 1,
          isVisible: true,
          skills: c.skills.map((s) => ({
            id: s.id,
            categoryId: i + 1,
            name: s.name,
            slug: s.slug,
            level: s.level,
            summary: s.summary,
            descriptionMd: `### ${s.name}\n\n${s.summary}`,
            yearsExperience: s.yearsExperience,
            isVisible: true,
            sortOrder: s.id,
            media: [heroMedia],
          })),
        })),
      }
    }
    return {
      data: mockPublicHome.skillCategories.flatMap((c) => c.skills),
    }
  }

  // Admin Experiences
  if (path.includes('/admin/experiences')) {
    if (method === 'POST' || method === 'PUT') {
      return { data: mockPublicHome.experiences[0] }
    }
    if (method === 'DELETE') {
      return { success: true }
    }
    return {
      data: mockPublicHome.experiences.map((e) => ({
        id: e.id,
        kind: e.kind,
        title: e.title,
        organization: e.organization,
        descriptionMd: 'Pengalaman kerja dan kontribusi dalam pengembangan perangkat lunak.',
        startedOn: e.startedOn,
        endedOn: e.endedOn,
        sortOrder: e.id,
        isVisible: true,
        media: e.media,
      })),
    }
  }

  // Admin Messages
  if (path.includes('/admin/messages')) {
    return {
      data: [
        {
          id: 1,
          name: 'Budi Santoso',
          email: 'budi@example.com',
          subject: 'Tawaran Kolaborasi Frontend',
          body: 'Halo Mas Ibnu, saya melihat portofolio Anda dan sangat tertarik untuk mengajak kerja sama dalam proyek web kami.',
          status: 'new',
          ipHash: 'a1b2c3d4e5f6',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          createdAt: '2026-11-03T08:30:00Z',
          readAt: null,
        },
        {
          id: 2,
          name: 'Siti Rahma',
          email: 'siti.rahma@perusahaan.id',
          subject: 'Pertanyaan Mengenai QA Testing',
          body: 'Selamat siang, apakah Anda membuka jasa konsultasi untuk automated testing dengan Playwright?',
          status: 'read',
          ipHash: 'f6e5d4c3b2a1',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          createdAt: '2026-11-02T14:15:00Z',
          readAt: '2026-11-02T15:00:00Z',
        },
      ],
    }
  }

  // Default fallback
  return { data: null }
}
