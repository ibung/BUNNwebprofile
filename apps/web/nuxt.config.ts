// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Direktori app Nuxt 4
  future: { compatibilityVersion: 4 },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'id',
      },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap',
        },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // Variabel runtime — dibaca saat server start, bukan saat build
  runtimeConfig: {
    // Private (server only)
    apiInternalUrl: '', // diisi NUXT_API_INTERNAL_URL di .env
    public: {
      siteUrl: 'https://bunn.my.id', // diisi NUXT_PUBLIC_SITE_URL di .env
    },
  },

  // Aturan route: admin SPA (tanpa SSR), publik dengan SWR 60 detik
  routeRules: {
    '/admin/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex' } },
    '/': { swr: 60 },
    '/projects/**': { swr: 60 },
    '/skills/**': { swr: 60 },
  },

  modules: ['@nuxt/eslint'],
})
