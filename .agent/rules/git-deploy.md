# Aturan: Git dan deploy

- `main` selalu bisa di-build. Kerjakan di cabang `feat/<nama>` atau `fix/<nama>`.
- Commit berformat `tipe: ringkasan` (contoh `feat: crud proyek`, `fix: kontras tombol di mobile`). Satu tugas, satu perubahan fokus.
- Jangan commit `node_modules`, `.nuxt`, `.output`, `dist`, `build`, `.env`, atau berkas unggahan.
- Jangan `git push --force` tanpa persetujuan eksplisit.
- Alur perubahan: ubah kode, commit, push, lalu deploy lewat `scripts/deploy.sh` di server. Jangan mengubah berkas di server produksi secara langsung.
- Sebelum menjalankan migrasi di produksi, backup database harus baru (`scripts/deploy.sh` melakukannya).
- Dockerfile dibuat dari root repo sebagai build context, multi-stage, pengguna non-root. Spesifikasi di `docs/DEPLOYMENT.md`.
- Rute tunnel `bunn.my.id` menuju `http://localhost:3000` (Nuxt). Jangan menambah rute tunnel baru tanpa diminta.
- Setelah selesai, centang tugas di `TASKS.md` dan laporkan: apa yang berubah dan di berkas mana, perintah yang dijalankan beserta hasil nyatanya (lint, typecheck, build), dan yang masih `TODO` atau butuh keputusan pemilik.
