# Aturan: frontend Nuxt (apps/web)

Baca `docs/ARCHITECTURE.md` dan `docs/CMS.md` bila menyentuh proxy atau admin.

- Nuxt 4, TypeScript ketat, `<script setup lang="ts">`, komponen PascalCase, satu tanggung jawab per komponen.
- Browser hanya berbicara ke `bunn.my.id`. Jangan menulis URL API absolut di kode klien. Panggilan klien memakai path relatif (`/api/...`).
- Proxy `/api/**` dan `/uploads/**` dibuat sebagai handler server (`server/routes/...` dengan `proxyRequest`), target dibaca dari `useRuntimeConfig().apiInternalUrl` saat runtime. Jangan memakai `routeRules.proxy` dengan nilai yang diisi saat build.
- Render sisi server (Nitro) memanggil API lewat URL internal (`NUXT_API_INTERNAL_URL`). Bungkus dalam composable `usePublicApi()` supaya satu tempat.
- Halaman publik memakai SSR dengan `routeRules` SWR singkat (mulai 60 detik). Rute `/admin/**` memakai `ssr: false` dan header `X-Robots-Tag: noindex`.
- Tipe data API diimpor dari `@bunn/shared`. Jangan menulis ulang tipe di komponen.
- Markdown dikirim API sebagai HTML tersanitasi (`...Html`). Merender dengan `v-html` hanya untuk field itu, tidak pernah untuk input pengguna lain.
- Admin: semua permintaan tulis lewat `useAdminApi()` (CSRF, penanganan 401, pesan galat per field).
- Aksesibilitas wajib: semantik HTML, label pada input, fokus terlihat, dialog dengan jebakan fokus dan tombol Esc.
- Tambahkan dependensi baru hanya bila perlu dan sebutkan alasannya. Utamakan yang sudah ada.
- Jalankan `pnpm lint`, `pnpm typecheck`, `pnpm build` sebelum melapor selesai.
