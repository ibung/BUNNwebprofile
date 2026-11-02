/**
 * Proxy /api/** → AdonisJS API container
 * Target dibaca dari runtimeConfig.apiInternalUrl (NUXT_API_INTERNAL_URL),
 * bukan di-bake saat build supaya image Docker yang sama bisa jalan di mana pun.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const target = (config.apiInternalUrl as string) || 'http://localhost:3333'

  // Ambil path setelah /api, teruskan ke backend
  const path = event.path.replace(/^\/api/, '')
  const host = getRequestHeader(event, 'host') ?? ''

  return proxyRequest(event, `${target}/api${path}`, {
    headers: {
      'X-Forwarded-Host': host,
      'X-Forwarded-Proto': 'https',
    },
  })
})
