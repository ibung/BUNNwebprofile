// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Direktori app Nuxt 4
  future: { compatibilityVersion: 4 },

  // Variabel runtime — dibaca saat server start, bukan saat build
  runtimeConfig: {
    // Private (server only)
    apiInternalUrl: '', // diisi NUXT_API_INTERNAL_URL di .env
    public: {
      siteUrl: '', // diisi NUXT_PUBLIC_SITE_URL di .env
    },
  },

  // Aturan route: admin SPA (tanpa SSR), publik dengan SWR 60 detik
  routeRules: {
    '/admin/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex' } },
    '/': { swr: 60 },
    '/projects/**': { swr: 60 },
  },

  modules: ['@nuxt/eslint'],
})
