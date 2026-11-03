# TASKS.md

Kerjakan **satu** tugas teratas yang belum dicentang, kecuali pemilik meminta lain. Tugas yang menyentuh lebih dari 3 berkas atau mengubah skema: tulis rencana singkat dan minta konfirmasi dulu. Centang tugas setelah `pnpm lint`, `pnpm typecheck`, dan `pnpm build` lolos, lalu laporkan hasil nyata.

Rujukan: `docs/PRD.md`, `docs/DATABASE.md`, `docs/API.md`, `docs/CMS.md`, `docs/DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`.

## Fase 0: Fondasi repo
- [x] T-001 Buat repo GitHub private, `git init`, commit awal, dan hubungkan remote (pemilik)
- [x] T-002 Konfirmasi keputusan terbuka di `docs/PRD.md` bagian 9 (versi AdonisJS, halaman detail skill)
- [x] T-003 Scaffold `apps/api` (AdonisJS, Lucid + PostgreSQL, VineJS, sesi cookie, nama paket `@bunn/api`) dan sambungkan ke workspace
- [x] T-004 Scaffold `apps/web` (Nuxt 4, TypeScript, nama paket `@bunn/web`) dan sambungkan ke workspace
- [x] T-005 Hubungkan `@bunn/shared` ke kedua app, atur ESLint, Prettier, dan skrip `lint`, `typecheck`, `build` di semua paket
- [x] T-006 `pnpm db:dev` menjalankan PostgreSQL lokal, `pnpm dev` menjalankan web dan api bersamaan

## Fase 1: Database dan API inti
- [x] T-010 Migrasi dan model sesuai `docs/DATABASE.md` (users sampai contact_messages), plus enum di `packages/shared`
- [x] T-011 `GET /api/health` dan penanganan galat berbentuk `{ error: { code, message, details } }`
- [x] T-012 Auth admin: login, logout, me, ganti kata sandi, CSRF, pembatasan laju
- [x] T-013 `initial_seeder` (admin dari env, `profile` dan `site_settings` berisi `TODO:`) dan `demo_seeder` khusus dev
- [x] T-014 Perintah `node ace admin:reset-password` (interaktif)

## Fase 2: Media
- [x] T-020 Layanan media: sniffing tipe, penulisan berkas, varian WebP dengan `sharp`, pembersihan metadata, penghapusan berkas
- [x] T-021 `POST /api/admin/media/upload`, `POST /api/admin/media/youtube` (parser link, tanpa fetch), CRUD media, daftar "dipakai di"
- [x] T-022 `GET /uploads/*` dengan header cache dan keamanan yang benar, tolak path traversal
- [x] T-023 Uji untuk parser YouTube dan validasi unggahan

## Fase 3: CRUD admin
- [ ] T-030 Profil, fakta, tautan sosial, sorotan, pengaturan situs
- [ ] T-031 Kategori skill dan skill (dengan `mediaIds`)
- [ ] T-032 Proyek (dengan `skillIds`, `mediaIds`, `coverMediaId`, status dan aturan terbit)
- [ ] T-033 Perjalanan (dengan `mediaIds`)
- [ ] T-034 Pesan kontak (daftar, status, hapus) dan `POST /api/public/contact` (honeypot, batas laju)
- [ ] T-035 Endpoint `PATCH /reorder` untuk semua sumber daya berurutan

## Fase 4: API publik
- [ ] T-040 `GET /api/public/home`, daftar dan detail proyek, detail skill, sitemap, dengan aturan visibilitas di `docs/DATABASE.md`
- [ ] T-041 Sanitasi markdown di server (`...Html`)

## Fase 5: Situs publik (Nuxt)
- [ ] T-050 Token CSS, font, layout dasar, gaya global dari `docs/DESIGN.md`
- [ ] T-051 Handler proxy `/api/**` dan `/uploads/**`, `usePublicApi()`, `runtimeConfig`
- [ ] T-052 Hero, navigasi, bagian Tentang (data dari API)
- [ ] T-053 Bagian Proyek, kartu proyek, halaman `/projects` dan `/projects/[slug]`
- [ ] T-054 Bagian Keahlian, kartu skill, halaman `/skills/[slug]`
- [ ] T-055 Perjalanan, Kontak (form), Footer
- [ ] T-056 Komponen media: galeri dengan lightbox, pemutar YouTube (facade, nocookie), gambar responsif dari varian
- [ ] T-057 SEO: meta per halaman, Open Graph, `sitemap.xml`, `robots.txt`, favicon, halaman 404
- [ ] T-058 Cek responsif (360, 768, 1280 px), aksesibilitas, bandingkan dengan `docs/design-reference/index.html`

## Fase 6: CMS (/admin)
- [ ] T-060 Rute admin SPA, middleware, `useAdminApi()`, halaman login, layout panel
- [ ] T-061 Dasbor
- [ ] T-062 Pustaka media dan pemilih media
- [ ] T-063 Layar profil (bertab), pengaturan
- [ ] T-064 Layar proyek (daftar, formulir, editor markdown dengan pratinjau, seret untuk urut)
- [ ] T-065 Layar skill dan kategori, perjalanan
- [ ] T-066 Kotak pesan

## Fase 7: Deploy
- [ ] T-070 `apps/web/Dockerfile` dan `apps/api/Dockerfile` sesuai `docs/DEPLOYMENT.md`, plus `.dockerignore`
- [ ] T-071 Validasi `docker-compose.yml`, jalankan seluruh stack lokal dengan Compose
- [ ] T-072 Deploy pertama di server, ganti rute tunnel ke `localhost:3000`, matikan Nginx lama (pemilik, dipandu)
- [ ] T-073 Jadwalkan backup harian, salin ke HDD, uji restore satu kali (pemilik, dipandu)

## Fase 8: Operasional
- [ ] T-080 Cloudflare Access untuk `/admin*` dan `/api/admin*`
- [ ] T-081 UFW, login SSH dengan key
- [ ] T-082 Uptime Kuma
- [ ] T-083 Aktifkan perpanjangan otomatis domain
- [ ] T-084 GitHub Actions dengan self-hosted runner untuk deploy otomatis

## Fase 9: Konten (pemilik)
- [ ] T-090 Isi profil, fakta, tautan sosial, sorotan lewat CMS
- [ ] T-091 Tambahkan proyek asli lengkap dengan foto dan video
- [ ] T-092 Tambahkan skill asli, kategori, dan media pendukung
- [ ] T-093 Pastikan tidak ada teks `TODO:` atau placeholder yang terlihat publik
