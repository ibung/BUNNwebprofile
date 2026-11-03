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

// ─── Health check — Docker & monitoring ──────────────────────────────────────
router.get('/api/health', () => {
  return { data: { status: 'ok' } }
})

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
