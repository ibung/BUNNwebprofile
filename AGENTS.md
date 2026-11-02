# AGENTS.md

Aturan kerja untuk AI agent (Antigravity, Claude Code, Codex, Cursor, dll.) di repo ini. Ini sumber aturan utama; `CLAUDE.md` dan `GEMINI.md` hanya menunjuk ke sini. **Aturan cukup didefinisikan sekali di sini, tidak perlu diulang di setiap prompt.**

## Peta dokumen (baca sesuai tugas)
| Tugas | Baca dulu |
|---|---|
| Apa pun | file ini, `docs/PRD.md` (bagian 1-4) |
| UI / gaya | `docs/DESIGN.md`, `docs/design-reference/index.html` |
| Database / model | `docs/DATABASE.md` |
| Endpoint | `docs/API.md` |
| Panel admin | `docs/CMS.md` |
| Struktur / deploy / Docker | `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md` |
| Apa yang dikerjakan berikutnya | `TASKS.md` |

## Tentang project
Portofolio pribadi Ibnu Hilmi Athaillah (Frontend Developer & QA Tester) di `https://bunn.my.id`, dihosting di home server (Ubuntu Server + Docker + Cloudflare Tunnel). Konten dinamis lewat CMS sendiri. Project ini juga bahan belajar DevOps: jelaskan alasan keputusan teknis, bukan hanya hasilnya.

## Struktur monorepo
```
apps/web        Nuxt 4 (Vue 3, TS): situs publik + CMS di /admin + proxy ke API
apps/api        AdonisJS 7 (Node 24+) + PostgreSQL: REST API, auth, upload
packages/shared tipe TypeScript dan konstanta bersama (tanpa dependensi runtime berat)
docs/           PRD, DATABASE, API, CMS, DESIGN, ARCHITECTURE, DEPLOYMENT
.agent/rules    aturan Antigravity (ringkas, per topik)
.agent/workflows alur slash-command Antigravity (new-resource, release-check)
```
Package manager: **pnpm workspace**. Nama paket: `@bunn/web`, `@bunn/api`, `@bunn/shared`. Impor lintas app hanya lewat `@bunn/shared`; `web` tidak boleh mengimpor kode dari `api` dan sebaliknya.

## Perintah (dari root)
```
pnpm install
pnpm dev            # web + api bersamaan
pnpm dev:web | pnpm dev:api
pnpm db:dev         # PostgreSQL lokal via Docker
pnpm db:migrate | pnpm db:seed | pnpm db:seed:demo   # demo hanya dev
pnpm lint | pnpm typecheck | pnpm build
```
Jalankan `pnpm lint`, `pnpm typecheck`, dan `pnpm build` sebelum menyatakan selesai.

## Aturan utama
1. **Desain sudah final.** Terjemahkan `docs/DESIGN.md` dan referensi HTML ke komponen Nuxt, lalu rapikan. Jangan ganti palet, font, atau gaya kartu tanpa diminta. Tampilan akhir harus terasa sama.
2. **Konten dari database, bukan hard-code.** Teks profil, proyek, skill, kontak berasal dari API. Satu-satunya teks tetap di kode adalah label antarmuka.
3. **Jangan mengarang data pribadi.** Nama, email, tautan, angka, deskripsi proyek harus dari pemilik. Jika belum ada, pakai `TODO:` yang jelas dan laporkan; jangan isi data palsu yang meyakinkan. Seeder produksi hanya berisi struktur kosong; data contoh hanya di `demo_seeder` (label `[DEMO]`, menolak jalan di produksi).
4. **Skema adalah kontrak.** Ubah `docs/DATABASE.md`, migrasi baru, dan `packages/shared` bersamaan. Jangan edit migrasi yang sudah pernah dijalankan.
5. **Perubahan kecil dan terarah.** Satu tugas, satu perubahan fokus. Jangan merombak file tak terkait.
6. **Jangan menambah dependensi tanpa alasan.** Sebutkan alasannya bila perlu paket baru.
7. **Aksesibilitas dan performa.** HTML semantik, kontras cukup, `:focus-visible`, `alt` wajib pada gambar, hormati `prefers-reduced-motion`, font `display=swap`.
8. **Backend tak terlihat.** Browser hanya berbicara ke `bunn.my.id`; `/api` dan `/uploads` diproxy oleh Nuxt. Jangan membuat hostname API publik tanpa diminta.

## Rahasia dan keamanan
- **Jangan pernah** menulis token, kata sandi, `APP_KEY`, atau isi `.env` ke repo, log, atau komentar. Hanya `*.env.example` bernilai kosong yang di-commit.
- Token Cloudflare Tunnel hanya ada di server.
- Rute `/api/admin/*` wajib auth + CSRF. Validasi semua input (VineJS), periksa isi berkas unggahan, sanitasi markdown.
- Jangan menjalankan perintah destruktif (`rm -rf`, `docker system prune`, `docker volume rm`, `git push --force`, `DROP`, `migrate:fresh` di produksi) tanpa persetujuan eksplisit.
- Jangan mengubah server produksi langsung. Alur: ubah kode → commit → push → deploy.

## Git
- `main` selalu bisa di-build. Cabang `feat/<nama>` / `fix/<nama>`.
- Commit `tipe: ringkasan` (contoh `feat: crud proyek`). Jangan commit `node_modules`, `.nuxt`, `.output`, `dist`, `.env`, berkas unggahan.

## Gaya kode
- TypeScript ketat, hindari `any`. Vue: `<script setup lang="ts">`, komponen PascalCase, satu tanggung jawab.
- Backend: controller tipis, logika di `app/services`, validator di `app/validators`.
- DB snake_case, JSON respons camelCase (dikonversi di serializer).
- Warna/font/jarak dari token CSS (`docs/DESIGN.md`), bukan ditulis ulang.
- Teks antarmuka Bahasa Indonesia; kode, nama variabel, dan commit boleh Inggris/Indonesia konsisten per file.

## Cara melapor setelah selesai
1. Apa yang berubah dan di file mana.
2. Perintah yang dijalankan beserta hasilnya (lint, typecheck, build).
3. Yang masih `TODO` atau butuh keputusan pemilik. Centang item selesai di `TASKS.md`.
