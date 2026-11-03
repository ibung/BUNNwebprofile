import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useAdminAuth } from '../composables/useAdminAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') {
    return
  }

  const { fetchMe, isAuthenticated } = useAdminAuth()

  if (!isAuthenticated.value) {
    const user = await fetchMe()
    if (!user) {
      return navigateTo({
        path: '/admin/login',
        query: { redirect: to.fullPath },
      })
    }
  }
})

