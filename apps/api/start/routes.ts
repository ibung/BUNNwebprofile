/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', () => {
  return { hello: 'world' }
})

// Endpoint kesehatan untuk healthcheck Docker & monitoring
router.get('/api/health', () => {
  return {
    data: {
      status: 'ok',
    },
  }
})
