# GEMINI.md

Antigravity membaca file ini (prioritas atas `AGENTS.md`). Semua aturan project ada di `AGENTS.md` di root repo dan aturan per topik di `.agent/rules/`. Baca `AGENTS.md` lebih dulu pada setiap sesi, lalu ikuti tabel "Peta dokumen" di dalamnya.

Ringkasan yang tidak boleh terlewat:
1. Desain final (`docs/DESIGN.md`); rapikan saja, jangan desain ulang.
2. Konten berasal dari database via API; jangan hard-code atau mengarang data pribadi (pakai `TODO:`).
3. Skema DB, `docs/DATABASE.md`, dan `packages/shared` diubah bersamaan.
4. Jangan menyentuh rahasia/`.env`; jangan perintah destruktif tanpa izin.
5. Tugas satu per satu dari `TASKS.md`; laporkan lint/typecheck/build.
