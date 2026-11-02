# bunn-portfolio

Portofolio pribadi Ibnu Hilmi Athaillah, **https://bunn.my.id**. Konten dikelola lewat CMS sendiri. Dihosting di home server (Ubuntu Server + Docker + Cloudflare Tunnel).

## Struktur

```
apps/web         Nuxt 4: situs publik, CMS di /admin, proxy ke API
apps/api         AdonisJS 7 + PostgreSQL: REST API, auth, unggahan
packages/shared  tipe dan konstanta bersama (@bunn/shared)
docs/            PRD, DATABASE, API, CMS, DESIGN, ARCHITECTURE, DEPLOYMENT
.agent/          aturan dan workflow Antigravity
scripts/         backup dan deploy
```

Pengunjung hanya mengenal satu alamat. Nuxt meneruskan `/api` dan `/uploads` ke API di jaringan internal Docker, jadi tidak ada domain atau port tambahan.

## Prasyarat

- Node 24+ (lihat `.nvmrc`), pnpm 10 (`corepack enable`)
- Docker (untuk PostgreSQL lokal dan deploy)

## Mulai

```
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm install
pnpm db:dev          # PostgreSQL lokal
pnpm db:migrate
pnpm db:seed
pnpm dev             # web di :3000, api di :3333
```

Skrip lain: `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm db:seed:demo` (data contoh, hanya dev).

> Folder `apps/web` dan `apps/api` masih kosong. Pembuatannya adalah tugas T-003 dan T-004 di `TASKS.md`.

## Dokumen

| File | Isi |
|---|---|
| `AGENTS.md` | Aturan kerja agent, sumber utama. `CLAUDE.md` dan `GEMINI.md` menunjuk ke sini |
| `TASKS.md` | Daftar tugas bertahap |
| `docs/PRD.md` | Tujuan, pengguna, model konten, kriteria selesai |
| `docs/DATABASE.md` | Skema database dan aturan visibilitas |
| `docs/API.md` | Kontrak REST API |
| `docs/CMS.md` | Rancangan panel admin |
| `docs/DESIGN.md` | Sistem desain (warna, font, komponen) |
| `docs/ARCHITECTURE.md` | Topologi, struktur repo, variabel lingkungan |
| `docs/DEPLOYMENT.md` | Dockerfile, deploy, backup, keamanan operasional |

## Catatan

Project ini juga dokumentasi belajar membangun home server: Ubuntu Server, SSH, Docker, Cloudflare Tunnel, dan alur deploy dengan Git.
