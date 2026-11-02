# API.md

REST API AdonisJS. Browser tidak pernah memanggil `api` langsung: semua lewat `https://bunn.my.id/api/*` dan `/uploads/*` yang diteruskan oleh server Nuxt (lihat `docs/ARCHITECTURE.md`). Dengan begitu cookie sesi bersifat same-origin dan tidak perlu CORS.

## Konvensi

- Awalan: `/api/public/*` (tanpa login, hanya baca, kecuali kontak) dan `/api/admin/*` (wajib login).
- Format: JSON, `camelCase`. Waktu ISO 8601 UTC. Tanggal murni `YYYY-MM-DD`.
- Sukses: `{ "data": ..., "meta": { ... } }`. Daftar memakai `meta.total`, `meta.page`, `meta.perPage`.
- Galat: `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [{ "field": "title", "message": "..." }] } }`.
- Kode galat: `VALIDATION_ERROR` 422, `UNAUTHENTICATED` 401, `FORBIDDEN` 403, `NOT_FOUND` 404, `CONFLICT` 409, `PAYLOAD_TOO_LARGE` 413, `RATE_LIMITED` 429, `INTERNAL` 500.
- Pesan galat untuk pengguna berbahasa Indonesia. Jangan membocorkan stack trace.
- Validasi semua input dengan VineJS di `app/validators`.
- Tipe respons berada di `packages/shared`.

## Kesehatan

`GET /api/health` → `{ "data": { "status": "ok" } }`. Tidak menyentuh tabel. Dipakai healthcheck Docker.

## Publik

| Metode | Path | Keterangan |
|---|---|---|
| GET | `/api/public/home` | Semua data beranda dalam satu panggilan (lihat bentuk di bawah) |
| GET | `/api/public/projects` | Query: `featured`, `skill` (slug), `page`, `perPage` (maks 50) |
| GET | `/api/public/projects/:slug` | Detail + `media[]` + `skills[]` |
| GET | `/api/public/skills/:slug` | Detail + `media[]` + `projects[]` terkait |
| GET | `/api/public/sitemap` | Daftar slug untuk sitemap |
| POST | `/api/public/contact` | Body: `name`, `email`, `subject?`, `body`, `website` (honeypot, harus kosong). Batas 5 pesan per jam per IP |

Bentuk `GET /api/public/home`:
```json
{
  "data": {
    "settings": { "siteTitle": "", "metaDescription": "", "footerText": null, "ogImage": null, "contactFormEnabled": true },
    "profile": { "fullName": "", "displayName": "", "headline": "", "tagline": null, "heroIntroHtml": "", "aboutHtml": "", "location": null, "emailPublic": null, "availabilityText": null, "avatar": null, "resume": null },
    "facts": [{ "label": "", "value": "" }],
    "socials": [{ "platform": "github", "label": "", "url": "" }],
    "highlights": { "about": [], "skills": [] },
    "featuredProjects": [],
    "skillCategories": [{ "slug": "", "name": "", "description": null, "accent": "red", "skills": [] }],
    "experiences": []
  }
}
```
Teks markdown dikirim sebagai HTML tersanitasi (`...Html`). Admin menerima markdown mentah (`...Md`).

Bentuk objek media publik:
```json
{ "id": 1, "kind": "image", "title": null, "altText": "", "caption": null,
  "width": 1600, "height": 900,
  "urls": { "thumb": "/uploads/...", "md": "/uploads/...", "lg": "/uploads/...", "original": "/uploads/..." },
  "youtube": null, "posterUrl": null, "mimeType": "image/webp", "durationSeconds": null }
```
Untuk `kind = "youtube"`: `youtube: { "id": "...", "startSeconds": 0 }` dan `urls` kosong. Untuk `video`: `urls.original` dan `posterUrl`.

## Admin

Autentikasi:
| Metode | Path | Keterangan |
|---|---|---|
| POST | `/api/admin/auth/login` | `email`, `password`. Batas 5 percobaan per 15 menit per IP dan email |
| POST | `/api/admin/auth/logout` | |
| GET | `/api/admin/auth/me` | 401 bila belum login |
| PUT | `/api/admin/auth/password` | `currentPassword`, `newPassword` (min 12 karakter) |

Sumber daya (semua di bawah `/api/admin`):
| Path | Operasi |
|---|---|
| `/profile` | GET, PUT (singleton) |
| `/settings` | GET, PUT (singleton) |
| `/profile-facts`, `/social-links`, `/highlights` | GET, POST, PATCH `/:id`, DELETE `/:id`, PATCH `/reorder` |
| `/skill-categories`, `/skills` | GET, POST, GET `/:id`, PATCH `/:id`, DELETE `/:id`, PATCH `/reorder` |
| `/projects` | idem, plus PATCH `/:id/status` (`draft`, `published`, `archived`) |
| `/experiences` | idem |
| `/messages` | GET, GET `/:id`, PATCH `/:id` (status), DELETE `/:id` |
| `/media` | GET (filter `kind`, `q`), GET `/:id` (+ `usages[]`), PATCH `/:id` (judul, alt, caption), DELETE `/:id` |
| `/media/upload` | POST multipart, satu atau banyak berkas |
| `/media/youtube` | POST `{ "url": "...", "title?": "..." }` |

Relasi diatur lewat body entitas pemiliknya: `skillIds: number[]` dan `mediaIds: number[]` (urutan array = urutan tampil) pada proyek, `mediaIds` pada skill dan perjalanan, `coverMediaId` pada proyek. Server memvalidasi bahwa ID tersebut ada.

`PATCH /reorder` menerima `{ "ids": [3, 1, 2] }`. Semua ID dalam cakupan harus disertakan, bila tidak maka 422.

## Unggahan

- Batas: gambar 10 MB, video 50 MB, dokumen (PDF) 10 MB. Batas Cloudflare Free per permintaan adalah 100 MB, jadi tetap di bawahnya.
- Izin: `image/jpeg`, `image/png`, `image/webp`, `image/avif`, `video/mp4`, `video/webm`, `application/pdf`. **SVG ditolak** (risiko XSS). GIF animasi tidak didukung di v1.
- Tipe ditentukan dari isi berkas (sniffing magic bytes), bukan ekstensi atau header klien.
- Nama berkas di disk acak (`<uuid>.<ext>`), nama asli hanya di database. Tidak ada path dari klien yang dipakai.
- Gambar diproses `sharp`: orientasi EXIF diterapkan, metadata (termasuk GPS) dibuang, dibuat varian WebP `thumb` (480 px), `md` (960 px), `lg` (1600 px), dan asli yang sudah dibersihkan. Lebar dan tinggi disimpan.
- Link YouTube: terima `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/shorts/`, `youtube.com/embed/`. Ambil ID (11 karakter `[A-Za-z0-9_-]`) dan parameter `t`. Server **tidak** mengambil URL itu.
- Penyajian: `GET /uploads/*` (di luar `/api`) dengan `Cache-Control: public, max-age=31536000, immutable`, `X-Content-Type-Options: nosniff`, tanpa listing direktori, path traversal ditolak.

## Keamanan ringkas

Detail lengkap di `.agent/rules/security.md`.
- Sesi cookie `HttpOnly`, `SameSite=Lax`, `Secure` di produksi. Aktifkan trust proxy agar `X-Forwarded-Proto` dihormati.
- CSRF aktif untuk semua metode tulis di `/api/admin/*` dan `/api/public/contact`.
- Semua rute `/api/admin/*` di balik middleware auth. Rute baru **ditolak secara default** sampai didaftarkan.
- Header keamanan: `Content-Security-Policy` (izinkan `frame-src https://www.youtube-nocookie.com`), `Referrer-Policy`, `X-Content-Type-Options`.

## Caching

- Respons `/api/public/*`: `Cache-Control: no-store` dari API. Pengaturan cache dilakukan di Nuxt (`routeRules` SWR) agar bisa dibatalkan dengan mudah.
- Saat admin mengubah konten, API memanggil endpoint internal Nuxt untuk membersihkan cache (opsional v1; tanpa itu konten muncul paling lambat sesuai nilai SWR).
