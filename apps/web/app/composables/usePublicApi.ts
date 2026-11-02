/**
 * usePublicApi — composable untuk memanggil endpoint publik API.
 * SSR: Nitro memanggil langsung ke NUXT_API_INTERNAL_URL (lebih cepat, satu hop).
 * Browser: path relatif /api/... → proxy Nuxt → AdonisJS.
 */
export function usePublicApi() {
  const config = useRuntimeConfig()

  /**
   * Base URL:
   * - Server side: URL internal Docker (http://api:3333)
   * - Client side: '' → path relatif, browser memakai asal yang sama
   */
  const baseURL = import.meta.server
    ? (config.apiInternalUrl as string) || 'http://localhost:3333'
    : ''

  const apiFetch = $fetch.create({ baseURL })

  return { apiFetch }
}

