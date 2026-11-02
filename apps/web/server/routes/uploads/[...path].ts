/**
 * Proxy /uploads/** → file statis dari AdonisJS storage
 * Cloudflare bisa cache respons karena header `immutable` ditambahkan oleh API.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const target = (config.apiInternalUrl as string) || 'http://localhost:3333'

  const path = event.path // sudah /uploads/...
  return proxyRequest(event, `${target}${path}`)
})
