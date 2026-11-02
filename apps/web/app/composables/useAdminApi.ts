/**
 * useAdminApi — composable untuk panggilan API admin (tulis).
 * Menyertakan CSRF token, menangani 401 (redirect login), dan pesan galat per field.
 * Semua panggilan ke /api/admin/** lewat path relatif (browser → proxy Nuxt).
 */
export function useAdminApi() {
  const router = useRouter()

  const adminFetch = $fetch.create({
    baseURL: '/api',
    credentials: 'include',
    onRequest({ options }) {
      // Ambil CSRF token dari cookie xsrf-token yang diset AdonisJS Shield
      const csrfToken = useCookie('XSRF-TOKEN').value
      if (csrfToken) {
        const headers = new Headers(options.headers)
        headers.set('X-XSRF-TOKEN', csrfToken)
        options.headers = headers
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await router.push('/admin/login')
      }
    },
  })

  return { adminFetch }
}
