import { computed } from 'vue'
import { useState } from '#imports'
import { useRouter } from 'vue-router'
import { useAdminApi } from './useAdminApi'

export interface AdminUser {
  id: number
  email: string
  fullName: string
}

export function useAdminAuth() {
  const user = useState<AdminUser | null>('admin-user', () => null)
  const isChecked = useState<boolean>('admin-auth-checked', () => false)
  const router = useRouter()
  const { adminFetch } = useAdminApi()

  const isAuthenticated = computed(() => !!user.value)

  const fetchMe = async (): Promise<AdminUser | null> => {
    try {
      const res = await adminFetch<{ data: AdminUser }>('/admin/auth/me')
      user.value = res.data
      isChecked.value = true
      return res.data
    } catch {
      user.value = null
      isChecked.value = true
      return null
    }
  }

  const login = async (credentials: {
    email: string
    password: string
  }): Promise<AdminUser> => {
    const res = await adminFetch<{ data: { user: AdminUser } }>(
      '/admin/auth/login',
      {
        method: 'POST',
        body: credentials,
      }
    )
    user.value = res.data.user
    isChecked.value = true
    return res.data.user
  }

  const logout = async () => {
    try {
      await adminFetch('/admin/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
      isChecked.value = true
      await router.push('/admin/login')
    }
  }

  return {
    user,
    isAuthenticated,
    isChecked,
    fetchMe,
    login,
    logout,
  }
}

