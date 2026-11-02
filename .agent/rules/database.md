# Aturan: database dan skema

Sumber kebenaran: `docs/DATABASE.md`. **Skema adalah kontrak.**

- Perubahan skema = tiga hal sekaligus dalam satu perubahan: (1) perbarui `docs/DATABASE.md`, (2) buat migrasi baru, (3) perbarui `packages/shared` (enum, tipe). Jangan melakukan satu tanpa yang lain.
- Jangan mengedit migrasi yang sudah pernah dijalankan. Buat migrasi baru.
- Satu berkas migrasi per perubahan dengan nama deskriptif.
- Enum disimpan sebagai `varchar` + `CHECK`, nilainya diambil dari konstanta di `packages/shared`.
- Relasi memakai foreign key dengan perilaku hapus yang tegas (`CASCADE`, `SET NULL`, `RESTRICT`) sesuai dokumen. Tabel tunggal (`profile`, `site_settings`) dijaga `CHECK (id = 1)`.
- Tambahkan indeks untuk kolom yang dipakai pada filter dan urutan di API publik.
- Alamat IP pengunjung tidak disimpan mentah, hanya hash bergaram.
- Perintah destruktif ke database (drop, truncate, `migrate:fresh`, `db:wipe`) hanya setelah persetujuan eksplisit pemilik, dan tidak pernah di produksi tanpa backup yang baru.
- Seeder: lihat `.agent/rules/content-integrity.md`.
