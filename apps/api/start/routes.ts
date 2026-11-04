/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import path from 'node:path'
import fs from 'node:fs/promises'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { MediaService } from '#services/media_service'

const AuthController = () => import('#controllers/auth_controller')
const MediaController = () => import('#controllers/media_controller')
const ProfileController = () => import('#controllers/profile_controller')
const SiteSettingsController = () => import('#controllers/site_settings_controller')
const ProfileFactsController = () => import('#controllers/profile_facts_controller')
const SocialLinksController = () => import('#controllers/social_links_controller')
const HighlightsController = () => import('#controllers/highlights_controller')
const SkillCategoriesController = () => import('#controllers/skill_categories_controller')
const SkillsController = () => import('#controllers/skills_controller')
const ProjectsController = () => import('#controllers/projects_controller')
const ExperiencesController = () => import('#controllers/experiences_controller')
const MessagesController = () => import('#controllers/messages_controller')
const ContactController = () => import('#controllers/contact_controller')
const PublicController = () => import('#controllers/public_controller')

// ─── Health check — Docker & monitoring ──────────────────────────────────────
router.get('/api/health', () => {
  return { data: { status: 'ok' } }
})

// ─── Publik ──────────────────────────────────────────────────────────────────
router
  .group(() => {
    router.get('home', [PublicController, 'home'])
    router.get('settings', [PublicController, 'settings'])
    router.get('projects', [PublicController, 'projects'])
    router.get('projects/:slug', [PublicController, 'projectDetail'])
    router.get('skills/:slug', [PublicController, 'skillDetail'])
    router.get('sitemap', [PublicController, 'sitemap'])
    router.post('contact', [ContactController, 'submit'])
  })
  .prefix('/api/public')

// ─── Auth (publik) ───────────────────────────────────────────────────────────
router
  .group(() => {
    router.post('login', [AuthController, 'login']).use(middleware.loginThrottle())
  })
  .prefix('/api/admin/auth')

// ─── Rute Admin (memerlukan autentikasi) ──────────────────────────────────────
router
  .group(() => {
    // Auth sesi
    router.post('auth/logout', [AuthController, 'logout'])
    router.get('auth/me', [AuthController, 'me'])
    router.put('auth/password', [AuthController, 'changePassword'])

    // Profil & Pengaturan Situs (Singleton)
    router.get('profile', [ProfileController, 'show'])
    router.put('profile', [ProfileController, 'update'])
    router.get('settings', [SiteSettingsController, 'show'])
    router.put('settings', [SiteSettingsController, 'update'])

    // Fakta Profil
    router.get('profile-facts', [ProfileFactsController, 'index'])
    router.post('profile-facts', [ProfileFactsController, 'store'])
    router.patch('profile-facts/reorder', [ProfileFactsController, 'reorder'])
    router.patch('profile-facts/:id', [ProfileFactsController, 'update'])
    router.delete('profile-facts/:id', [ProfileFactsController, 'destroy'])

    // Tautan Sosial
    router.get('social-links', [SocialLinksController, 'index'])
    router.post('social-links', [SocialLinksController, 'store'])
    router.patch('social-links/reorder', [SocialLinksController, 'reorder'])
    router.patch('social-links/:id', [SocialLinksController, 'update'])
    router.delete('social-links/:id', [SocialLinksController, 'destroy'])

    // Sorotan Angka
    router.get('highlights', [HighlightsController, 'index'])
    router.post('highlights', [HighlightsController, 'store'])
    router.patch('highlights/reorder', [HighlightsController, 'reorder'])
    router.patch('highlights/:id', [HighlightsController, 'update'])
    router.delete('highlights/:id', [HighlightsController, 'destroy'])

    // Kategori Keahlian
    router.get('skill-categories', [SkillCategoriesController, 'index'])
    router.post('skill-categories', [SkillCategoriesController, 'store'])
    router.patch('skill-categories/reorder', [SkillCategoriesController, 'reorder'])
    router.get('skill-categories/:id', [SkillCategoriesController, 'show'])
    router.patch('skill-categories/:id', [SkillCategoriesController, 'update'])
    router.delete('skill-categories/:id', [SkillCategoriesController, 'destroy'])

    // Keahlian (Skills)
    router.get('skills', [SkillsController, 'index'])
    router.post('skills', [SkillsController, 'store'])
    router.patch('skills/reorder', [SkillsController, 'reorder'])
    router.get('skills/:id', [SkillsController, 'show'])
    router.patch('skills/:id', [SkillsController, 'update'])
    router.delete('skills/:id', [SkillsController, 'destroy'])

    // Proyek
    router.get('projects', [ProjectsController, 'index'])
    router.post('projects', [ProjectsController, 'store'])
    router.patch('projects/reorder', [ProjectsController, 'reorder'])
    router.get('projects/:id', [ProjectsController, 'show'])
    router.patch('projects/:id', [ProjectsController, 'update'])
    router.patch('projects/:id/status', [ProjectsController, 'updateStatus'])
    router.delete('projects/:id', [ProjectsController, 'destroy'])

    // Pengalaman / Perjalanan
    router.get('experiences', [ExperiencesController, 'index'])
    router.post('experiences', [ExperiencesController, 'store'])
    router.patch('experiences/reorder', [ExperiencesController, 'reorder'])
    router.get('experiences/:id', [ExperiencesController, 'show'])
    router.patch('experiences/:id', [ExperiencesController, 'update'])
    router.delete('experiences/:id', [ExperiencesController, 'destroy'])

    // Kotak Pesan
    router.get('messages', [MessagesController, 'index'])
    router.get('messages/:id', [MessagesController, 'show'])
    router.patch('messages/:id', [MessagesController, 'update'])
    router.delete('messages/:id', [MessagesController, 'destroy'])

    // Media
    router.get('media', [MediaController, 'index'])
    router.post('media/upload', [MediaController, 'upload'])
    router.post('media/youtube', [MediaController, 'createYoutube'])
    router.get('media/:id', [MediaController, 'show'])
    router.patch('media/:id', [MediaController, 'update'])
    router.delete('media/:id', [MediaController, 'destroy'])
  })
  .prefix('/api/admin')
  .use(middleware.auth())

// ─── Penyajian Berkas Unggahan Statis (/uploads/*) ────────────────────────────
router.get('/uploads/*', async ({ request, response }) => {
  const segments = request.param('*')
  const filePathParam = Array.isArray(segments) ? segments.join('/') : String(segments ?? '')

  // 1. Tolak potensi path traversal atau karakter ilegal
  if (
    !filePathParam ||
    filePathParam.includes('..') ||
    filePathParam.includes('\0') ||
    filePathParam.startsWith('/') ||
    filePathParam.startsWith('\\')
  ) {
    return response.forbidden({
      error: { code: 'FORBIDDEN', message: 'Akses ditolak.' },
    })
  }

  // 2. Tentukan path absolut aman dan pastikan di dalam UPLOADS_DIR
  const uploadsDir = MediaService.getUploadsDir()
  const safePath = path.resolve(uploadsDir, filePathParam)
  const relative = path.relative(uploadsDir, safePath)

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return response.forbidden({
      error: { code: 'FORBIDDEN', message: 'Akses ditolak.' },
    })
  }

  // 3. Pastikan berkas benar-benar ada dan berupa file reguler
  try {
    const stat = await fs.stat(safePath)
    if (!stat.isFile()) {
      return response.notFound({
        error: { code: 'NOT_FOUND', message: 'Berkas tidak ditemukan.' },
      })
    }
  } catch {
    return response.notFound({
      error: { code: 'NOT_FOUND', message: 'Berkas tidak ditemukan.' },
    })
  }

  // 4. Header cache dan proteksi MIME
  response.header('Cache-Control', 'public, max-age=31536000, immutable')
  response.header('X-Content-Type-Options', 'nosniff')

  return response.download(safePath)
})
