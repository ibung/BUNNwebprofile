---
description: Tambah satu sumber daya (tabel, API, dan layar CMS) dari ujung ke ujung
---

Gunakan untuk menambah entitas baru yang dikelola lewat CMS. Kerjakan berurutan dan berhenti bila ada keputusan yang belum jelas.

1. Baca `docs/PRD.md` (bagian 1-4), `docs/DATABASE.md`, `docs/API.md`, dan `docs/CMS.md`.
2. Tulis rencana singkat (tabel, endpoint, layar) dan minta konfirmasi pemilik sebelum mengubah skema.
3. Perbarui `docs/DATABASE.md` dan `packages/shared` (enum dan tipe).
4. Buat migrasi baru di `apps/api/database/migrations` dan model Lucid.
5. Buat validator VineJS, service, serializer, dan controller tipis. Daftarkan rute di `start/routes.ts`: baca di `/api/public/*` bila perlu, tulis di `/api/admin/*` di balik middleware auth.
6. Tambahkan uji untuk logika non-trivial.
7. Perbarui `docs/API.md` untuk endpoint baru.
8. Buat layar CMS di `apps/web/app/pages/admin` dan komponennya, memakai `useAdminApi()`.
9. Jalankan `pnpm db:migrate`, `pnpm lint`, `pnpm typecheck`, `pnpm build`.
10. Centang tugas di `TASKS.md` dan laporkan hasil nyata dari perintah di atas.
