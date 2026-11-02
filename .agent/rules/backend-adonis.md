# Aturan: backend AdonisJS (apps/api)

Baca `docs/API.md` dan `docs/DATABASE.md` sebelum menambah atau mengubah endpoint.

- AdonisJS 7 (Node 24+) dengan Lucid dan PostgreSQL. Ikuti konvensi bawaan versi yang terpasang dan baca dokumentasi resminya, jangan mengandalkan ingatan untuk API yang berubah antarversi.
- Controller tipis: terima permintaan, panggil service, kembalikan respons. Logika bisnis di `app/services`. Validator VineJS di `app/validators`. Bentuk respons di serializer.
- Setiap input divalidasi. Jangan mempercayai `request.all()` mentah ke model.
- Respons mengikuti amplop `{ data, meta }` dan `{ error: { code, message, details } }` (lihat `docs/API.md`). Pesan galat berbahasa Indonesia, tanpa stack trace.
- Kolom database `snake_case`, JSON respons `camelCase`.
- Endpoint reorder menerima daftar ID lengkap dan menuliskan `sort_order` dalam satu transaksi.
- Pemrosesan unggahan (sniffing tipe, `sharp`, penulisan berkas, penghapusan berkas) hanya di `app/services/media`. Berkas ditulis ke disk setelah validasi, dan dihapus dari disk setelah transaksi database hapus sukses.
- Jangan menjalankan `migration:fresh`, `migration:rollback`, atau `db:wipe` di produksi.
- Tambahkan uji untuk logika non-trivial (parser link YouTube, validasi unggahan, aturan visibilitas publik).
- Jalankan `pnpm lint`, `pnpm typecheck`, `pnpm build`, dan uji sebelum melapor selesai.
