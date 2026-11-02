---
description: Periksa kesiapan sebelum deploy ke server
---

Jalankan sebelum meminta pemilik melakukan deploy. Jangan menjalankan perintah di server produksi.

1. Pastikan cabang kerja sudah di-merge ke `main` dan tidak ada perubahan yang belum di-commit.
2. Jalankan `pnpm lint`, `pnpm typecheck`, dan `pnpm build`. Laporkan hasil nyata.
3. Cari teks `TODO:` dan placeholder yang akan terlihat publik (`rg "TODO:|contoh|email@contoh"` di `apps/`). Daftarkan temuan.
4. Pastikan tidak ada berkas rahasia yang ikut ter-commit (`.env`, kunci, token) dan `.env.example` lengkap untuk semua variabel baru.
5. Pastikan setiap migrasi baru punya pasangan di `docs/DATABASE.md` dan `packages/shared`.
6. Periksa bahwa `docker compose config` valid dan Dockerfile tetap build (`docker compose build`) bila Docker tersedia.
7. Tulis ringkasan: apa yang akan berubah di produksi, migrasi yang akan jalan, dan langkah deploy (`scripts/deploy.sh` di server).
