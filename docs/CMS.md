# CMS.md

Panel admin ada di dalam aplikasi Nuxt pada path `/admin`. Bukan aplikasi terpisah.

## Apakah CMS butuh domain sendiri?

**Tidak.** Domain `bunn.my.id` yang sama dipakai untuk semuanya:

| Path | Fungsi |
|---|---|
| `/` dan halaman publik | Situs portofolio |
| `/admin` | CMS (SPA, tanpa SSR, `noindex`) |
| `/api/*` | API (diteruskan Nuxt ke container `api`) |
| `/uploads/*` | Berkas unggahan |

Keuntungan: tidak ada biaya tambahan, cookie sesi same-origin (tanpa CORS), dan satu route tunnel. Subdomain `admin.bunn.my.id` baru layak dipertimbangkan bila kelak butuh kebijakan akses yang benar-benar terpisah. Untuk saat ini tidak perlu.

Lapisan keamanan tambahan yang disarankan (opsional, gratis): **Cloudflare Access** (Zero Trust) pada path `bunn.my.id/admin*` dan `bunn.my.id/api/admin*`, sehingga login CMS hanya bisa dicapai setelah verifikasi email. Pengaturan ada di `docs/DEPLOYMENT.md`.

## Prinsip

1. Pemilik harus bisa mengelola konten tanpa menyentuh kode atau terminal.
2. Alat sederhana dulu: formulir, markdown di textarea dengan pratinjau. Tanpa editor WYSIWYG di v1.
3. Setiap daftar yang punya urutan bisa diubah dengan seret-dan-lepas, dan setiap entitas punya sakelar tampil/sembunyi.
4. Gaya visual mengikuti token di `docs/DESIGN.md` (bagian "Panel admin"), tetapi lebih tenang dan padat.
5. Semua teks antarmuka Bahasa Indonesia.

## Peta layar

| Rute | Isi |
|---|---|
| `/admin/login` | Email dan kata sandi. Pesan galat umum ("Email atau kata sandi salah") |
| `/admin` | Dasbor: jumlah proyek terbit dan draf, pesan baru, tautan cepat, daftar "yang belum lengkap" (media tanpa alt, proyek tanpa cover) |
| `/admin/profile` | Profil, fakta, tautan sosial, sorotan angka dalam satu halaman bertab |
| `/admin/projects` | Daftar (cari, filter status, seret untuk urut), tombol "Proyek baru" |
| `/admin/projects/new`, `/admin/projects/[id]` | Formulir proyek |
| `/admin/skills` | Kategori dan skill dalam satu halaman (akordeon per kategori) |
| `/admin/skills/[id]` | Formulir skill |
| `/admin/experiences` | Lini masa, tambah dan ubah lewat panel samping |
| `/admin/media` | Pustaka media (grid, filter jenis, pencarian, unggah, tempel YouTube) |
| `/admin/messages` | Kotak pesan: baru, dibaca, arsip, spam |
| `/admin/settings` | Judul situs, deskripsi meta, gambar OG, teks footer, ganti kata sandi |

## Formulir proyek

Bagian: **Dasar** (judul, slug otomatis dari judul tetapi bisa diubah, ringkasan, jenis, peran, tanggal), **Isi** (deskripsi markdown dengan tab Tulis dan Pratinjau), **Tautan** (demo, repo), **Skill** (pilih banyak dari daftar skill, urutan bisa diatur), **Media** (cover, galeri), **Terbit** (status, unggulan).

Perilaku:
- Simpan sebagai draf kapan saja. Tombol "Terbitkan" memeriksa kelengkapan: judul, ringkasan, cover dengan alt teks. Bila gagal, tunjukkan daftar yang kurang, jangan hanya menolak.
- Peringatan bila keluar halaman dengan perubahan yang belum disimpan.
- Pratinjau memakai komponen publik yang sama.

## Formulir skill

Nama, kategori, level opsional (belajar, nyaman, kuat), ringkasan satu kalimat, tahun pengalaman opsional, deskripsi markdown, **media** (foto, video, link YouTube), tampil/sembunyi. Skill dengan media mendapat halaman detail `/skills/[slug]`; tanpa media tetap hanya sebagai kartu.

## Pustaka media dan pemilih media

- Unggah banyak berkas sekaligus dengan indikator progres per berkas. Tampilkan galat per berkas, jangan menggagalkan semuanya.
- Tempel link YouTube: server mengambil ID, klien menampilkan kartu pratinjau. Judul diisi manual (tidak ada panggilan ke YouTube).
- Setiap aset: judul, **alt teks** (diberi penanda merah bila kosong pada gambar), keterangan.
- Detail aset menampilkan "dipakai di" (daftar proyek, skill, perjalanan).
- Pemilih media muncul sebagai dialog di formulir proyek dan skill: pilih dari pustaka atau unggah langsung, lalu atur urutan dengan seret.
- Sarankan YouTube (tidak publik, `unlisted`) untuk video panjang. Unggahan video hanya untuk klip pendek karena batas 50 MB dan unggahan internet rumah yang terbatas.

## Auth dan keamanan

- Login memakai sesi cookie. Middleware Nuxt `admin` mengecek `/api/admin/auth/me` sebelum rute `/admin/*` (kecuali `/admin/login`).
- Setelah 401 dari API, arahkan ke login dengan pesan "Sesi berakhir".
- CSRF token diambil dari API dan dikirim di header pada setiap permintaan tulis.
- Halaman admin: `<meta name="robots" content="noindex">`, `X-Robots-Tag: noindex`, dan dikecualikan dari `sitemap.xml`.
- Tidak ada pendaftaran, tidak ada "lupa kata sandi" via email di v1. Reset dilakukan lewat perintah `node ace` di server (didokumentasikan di `docs/DEPLOYMENT.md`).

## Struktur kode (apps/web)

```
app/pages/admin/...            halaman CMS
app/components/admin/...       komponen CMS (form, tabel, pemilih media, editor markdown)
app/composables/useAdminApi.ts pembungkus $fetch dengan CSRF dan penanganan 401
app/middleware/admin.ts        penjaga rute
```
Konfigurasi: `routeRules: { '/admin/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex' } } }`.

## Di luar lingkup v1

Editor WYSIWYG, riwayat revisi, banyak admin dan peran, jadwal terbit, impor dan ekspor, notifikasi email.
