# ARCHITECTURE.md

Gambaran teknis. Perbarui setiap kali ada keputusan struktur yang berubah.

## Keputusan utama

| Keputusan | Pilihan | Alasan |
|---|---|---|
| Struktur repo | Monorepo pnpm workspace | Satu repo, tipe dibagi lewat `packages/shared`, satu alur deploy |
| Frontend dan CMS | Nuxt 4 (Vue 3, TypeScript), SSR untuk situs publik, SPA untuk `/admin` | Sesuai keahlian, SEO baik untuk halaman publik |
| Backend | AdonisJS 7 (Node 24+) | Struktur rapi untuk REST, auth, validasi, ORM. Fallback: v6 di Node 22 bila ada kendala |
| Database | PostgreSQL 17 | Stabil, JSONB untuk varian media |
| Akses publik | Satu domain lewat Cloudflare Tunnel | Tanpa port terbuka, tahan IP dinamis dan CGNAT |
| Backend tak terlihat | Nuxt meneruskan `/api` dan `/uploads` ke container `api` | Satu origin, tanpa CORS, API tidak terekspos langsung |
| Runtime | Docker Compose | Lingkungan sama di lokal dan server |

Versi dikunci di `package.json` dan `.nvmrc`. Gunakan rilis stabil terbaru dari lini yang dipilih, catat perubahan versi mayor di bagian "Catatan keputusan".

## Topologi

```
Pengunjung → Cloudflare → tunnel → cloudflared (server)
                                        │
                              http://localhost:3000
                                        ▼
                               ┌──────────────────┐
                               │ web (Nuxt, Nitro)│  ← satu-satunya yang terbuka ke host
                               │  /, /admin       │
                               │  /api/*, /uploads/* ──► teruskan (proxy)
                               └────────┬─────────┘
                                        │ jaringan internal Docker
                               ┌────────▼─────────┐        ┌───────────────┐
                               │ api (AdonisJS)   │───────►│ db (Postgres) │
                               │ :3333 (tidak     │        │ tidak punya   │
                               │  dipublikasikan) │        │ port publik   │
                               └────────┬─────────┘        └───────────────┘
                                        │
                                 volume `uploads`
```

- Hanya `web` yang memetakan port ke host, terikat ke `127.0.0.1:3000`.
- `api` hanya `expose` di jaringan internal Compose. `db` tidak punya port yang dipublikasikan.
- Rute tunnel tunggal: `bunn.my.id` → `http://localhost:3000`. Tidak ada hostname untuk API.

## Alur permintaan

1. Halaman publik (SSR): Nitro memanggil API **langsung** lewat `NUXT_API_INTERNAL_URL` (`http://api:3333`), merender HTML, dan men-cache hasilnya sebentar (SWR).
2. Panggilan dari browser (`/api/...`): handler server Nuxt di `server/routes/api/[...path].ts` meneruskan ke API memakai `proxyRequest`, lengkap dengan cookie dan header `X-Forwarded-*`.
3. Berkas unggahan: `server/routes/uploads/[...path].ts` meneruskan ke `GET /uploads/*` di API. Cloudflare dapat men-cache respons karena `immutable`.

Target proxy dibaca dari `runtimeConfig` **saat runtime**, bukan di-bake saat build, supaya image yang sama berjalan di mana pun. Jangan memakai `routeRules.proxy` dengan URL yang diisi saat build.

## Struktur repo

```
.
├── AGENTS.md  CLAUDE.md  GEMINI.md      aturan agent (AGENTS.md adalah sumber utama)
├── README.md  TASKS.md
├── .agent/
│   ├── rules/                           aturan Antigravity per topik
│   └── workflows/                       alur slash-command Antigravity
├── apps/
│   ├── web/                             Nuxt 4: situs publik, /admin, proxy
│   │   ├── app/{pages,components,composables,layouts,middleware,assets}
│   │   ├── server/routes/{api,uploads}/ proxy ke API
│   │   ├── nuxt.config.ts
│   │   └── Dockerfile
│   └── api/                             AdonisJS: REST API, auth, upload
│       ├── app/{controllers,models,services,validators,serializers}
│       ├── database/{migrations,seeders}
│       ├── start/routes.ts
│       ├── storage/uploads/             (di-gitignore, volume Docker di server)
│       └── Dockerfile
├── packages/shared/                     tipe, enum, konstanta bersama
├── docs/                                PRD, DATABASE, API, CMS, DESIGN, ARCHITECTURE, DEPLOYMENT
│   └── design-reference/index.html      desain asli (jangan diedit)
├── scripts/                             backup-db.sh, deploy.sh
├── docker-compose.yml                   produksi (web, api, db)
├── compose.dev.yml                      hanya database untuk pengembangan lokal
└── pnpm-workspace.yaml
```

Aturan impor: `web` dan `api` hanya berbagi kode lewat `@bunn/shared`. `web` tidak mengimpor dari `api`, dan sebaliknya.

## Variabel lingkungan

| Variabel | Dipakai | Keterangan |
|---|---|---|
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | `.env` root (Compose) | Sumber tunggal kredensial DB |
| `APP_KEY` | `apps/api/.env` | Kunci enkripsi cookie. `node ace generate:key` |
| `SESSION_SECURE` | api | `true` di produksi |
| `PUBLIC_SITE_URL` | api, web | `https://bunn.my.id` di produksi |
| `UPLOADS_DIR` | api | Folder unggahan (volume) |
| `IP_HASH_SALT` | api | Garam hash IP pada pesan kontak |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | api (hanya saat seed) | Admin pertama. Hapus dari `.env` setelah seed |
| `NUXT_API_INTERNAL_URL` | web | `http://api:3333` di Compose |

Berkas `.env` tidak pernah di-commit. Yang di-commit hanya `*.env.example` dengan nilai kosong.

## Mode gagal

- API mati: halaman publik yang masih ada di cache SWR tetap tampil, sisanya menampilkan halaman galat ramah. Container memakai `restart: unless-stopped`.
- Database mati: API gagal health-nya sendiri bila perlu, `/api/health` tidak menyentuh tabel agar bisa dibedakan dari kegagalan DB.
- Server mati atau internet putus: situs tidak bisa diakses. Ini batas home server yang diterima.

## Catatan keputusan

- 2026-11-01: AdonisJS 7 dipilih sebagai default (rilis stabil, butuh Node 24+). Nuxt 4.x. Konfirmasi di PRD bagian 9.
- Container Nginx statis lama (port 8080) tetap berjalan sampai Nuxt terbukti jalan, lalu dimatikan saat rute tunnel dipindah ke port 3000.
