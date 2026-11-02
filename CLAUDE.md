# CLAUDE.md

Aturan lengkap ada di @AGENTS.md. Baca file itu terlebih dahulu; semuanya berlaku di sini.

## Tambahan khusus Claude / Claude Code
- Mulai sesi dengan membaca `TASKS.md`, kerjakan **satu** tugas teratas yang belum dicentang kecuali diminta lain.
- Untuk tugas yang menyentuh lebih dari 3 file, tulis rencana singkat dulu dan minta konfirmasi sebelum mengubah skema DB atau struktur folder.
- Muat dokumen sesuai tabel "Peta dokumen" di `AGENTS.md`; jangan membaca semua `docs/` sekaligus.
- Untuk pekerjaan UI, buka `docs/design-reference/index.html` sebagai acuan visual dan bandingkan hasilnya.
- Jangan pernah membuka atau mencetak isi `.env`.
- Setelah selesai, jalankan `pnpm lint && pnpm typecheck && pnpm build` dan laporkan hasil nyata, bukan perkiraan.
