/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')

// Health check — Docker & monitoring
router.get('/api/health', () => {
  return { data: { status: 'ok' } }
})

// ─── Auth (publik) ───────────────────────────────────────────────────────────
router
  .group(() => {
    router.post('login', [AuthController, 'login']).use(middleware.loginThrottle())
  })
  .prefix('/api/admin/auth')

// ─── Auth (memerlukan login) ─────────────────────────────────────────────────
router
  .group(() => {
    router.post('logout', [AuthController, 'logout'])
    router.get('me', [AuthController, 'me'])
    router.put('password', [AuthController, 'changePassword'])
  })
  .prefix('/api/admin/auth')
  .use(middleware.auth())
