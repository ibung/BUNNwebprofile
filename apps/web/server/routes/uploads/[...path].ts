/**
 * Proxy /uploads/** → file statis dari AdonisJS storage
 * Cloudflare bisa cache respons karena header `immutable` ditambahkan oleh API.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const target = (config.apiInternalUrl as string) || 'http://localhost:3333'

  const path = event.path // sudah /uploads/...

  try {
    return await proxyRequest(event, `${target}${path}`)
  } catch (error) {
    if (import.meta.dev || process.env.NODE_ENV !== 'production') {
      // Fallback SVG placeholder untuk mode dev
      setHeader(event, 'Content-Type', 'image/svg+xml')
      return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
        <rect width="800" height="450" fill="#E8DCC4" stroke="#1F2421" stroke-width="4"/>
        <circle cx="400" cy="180" r="60" fill="#F4D06F" stroke="#1F2421" stroke-width="4"/>
        <text x="400" y="280" font-family="monospace" font-size="20" font-weight="bold" fill="#1F2421" text-anchor="middle">BUNN Media Placeholder</text>
        <text x="400" y="315" font-family="monospace" font-size="14" fill="#1F2421" text-anchor="middle">Dev Mode Preview</text>
      </svg>`
    }
    throw error
  }
})
