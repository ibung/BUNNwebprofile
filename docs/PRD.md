# PRD: Portofolio Dinamis bunn.my.id

Status: draft v1 · Pemilik: Ibnu Hilmi Athaillah · Diperbarui: 2026-11-01
Agent: bagian 1-4 wajib dibaca untuk tugas apa pun. Bagian 5-9 dibaca saat mengerjakan fitur terkait.

## 1. Ringkasan

Situs portofolio pribadi yang isinya (profil, proyek, skill, perjalanan) dikelola lewat CMS sendiri, bukan ditulis di kode. Tampilan mengikuti desain final di `docs/DESIGN.md`. Dijalankan di home server dan hanya punya satu alamat publik: `https://bunn.my.id`.

## 2. Tujuan dan non-tujuan

Tujuan:
1. Etalase profesional untuk rekruter dan klien, mudah ditautkan dari LinkedIn dan CV.
2. Pemilik bisa menambah atau mengubah proyek, skill, foto, dan video tanpa menyentuh kode.
3. Bukti kemampuan fullstack dan DevOps: monorepo, Docker, backup, deploy dengan Git.

Non-tujuan v1: pendaftaran pengguna publik, komentar, blog, multi-bahasa, e-commerce, analitik buatan sendiri, email transaksional.

## 3. Pengguna dan skenario

**Pengunjung** (rekruter, klien, rekan): membuka dari HP atau laptop, ingin tahu dalam satu menit siapa pemiliknya, apa yang pernah dibuat, skill apa yang dikuasai, dan cara menghubunginya.

**Pemilik** (satu-satunya admin): login ke `/admin`, mengelola semua konten.

Skenario penerimaan:
- S1. Pengunjung membuka beranda dan melihat profil, proyek unggulan, skill, perjalanan, dan kontak, semuanya dari database.
- S2. Pengunjung membuka detail proyek dan melihat deskripsi, teknologi, galeri foto, video YouTube, serta tautan demo dan repo.
- S3. Pengunjung membuka detail skill dan melihat penjelasan, foto, dan video terkait skill itu.
- S4. Pengunjung mengirim pesan lewat form kontak dan pemilik melihatnya di CMS.
- S5. Pemilik menambah proyek baru dengan 3 foto dan 1 link YouTube dalam kurang dari 3 menit, lalu menerbitkannya.
- S6. Pemilik mengubah urutan skill atau menyembunyikan proyek tanpa deploy ulang.

## 4. Model konten

Semua entitas di bawah disimpan di database (rincian kolom: `docs/DATABASE.md`).

| Entitas | Isi | Catatan |
|---|---|---|
| Profil | nama, sapaan, headline, tagline, intro, tentang (markdown), lokasi, kontak publik, avatar, CV | satu baris tunggal |
| Fakta profil | pasangan label dan nilai (kampus, lokasi, dst.) | tampil di kartu fakta bagian Tentang |
| Tautan sosial | GitHub, LinkedIn, Instagram, YouTube, email, dll. | urutan dan visibilitas diatur |
| Sorotan angka | angka besar dengan label (jumlah test case, proyek, dst.) | bagian "about" atau "skills" |
| Kategori skill | nama, deskripsi, warna aksen | mis. Frontend, QA, DevOps |
| Skill | nama, level opsional, ringkasan, deskripsi markdown, media | milik satu kategori |
| Proyek | judul, ringkasan, deskripsi markdown, peran, status, tanggal, tautan demo dan repo, cover, galeri, skill terkait | status draft, published, archived |
| Perjalanan | pendidikan, pekerjaan, proyek, tonggak, dengan rentang tanggal | tampil sebagai lini masa |
| Media | foto, video unggahan, link YouTube, dokumen | dipakai ulang di banyak tempat |
| Pesan kontak | nama, email, subjek, isi, status | hanya terlihat di CMS |
| Pengaturan situs | judul, deskripsi meta, gambar OG, teks footer | satu baris tunggal |

Aturan konten:
1. Urutan tampil diatur manual lewat `sort_order`, bukan tanggal.
2. Yang ber-`is_visible = false` atau berstatus bukan `published` tidak boleh keluar dari API publik.
3. Teks panjang berformat markdown, dirender dengan sanitasi. Tidak ada HTML mentah dari admin.
4. Media jenis `image` wajib punya `alt_text` sebelum dipakai di konten terbit.
5. Video diutamakan sebagai link YouTube. Unggahan video (mp4, webm) dibatasi 50 MB.
6. Skill dan proyek boleh punya banyak media dengan urutan yang diatur.

## 5. Fitur situs publik

- Halaman: `/` (hero, tentang, proyek unggulan, skill, perjalanan, kontak), `/projects`, `/projects/[slug]`, `/skills/[slug]`, 404.
- Galeri foto dengan lightbox, dapat dioperasikan keyboard, memakai varian gambar yang sesuai ukuran layar.
- Video YouTube dimuat setelah diklik (tanpa permintaan pihak ketiga sebelum itu) dan memakai domain `youtube-nocookie.com`.
- Form kontak dengan honeypot, pembatasan laju, dan pesan error berbahasa Indonesia.
- SEO: judul dan deskripsi per halaman, Open Graph, `sitemap.xml`, `robots.txt`. `/admin` tidak diindeks.
- Konten publik di-cache sebentar (SWR) supaya database tidak dihantam setiap kunjungan.

## 6. Fitur CMS

Rincian layar dan alur ada di `docs/CMS.md`. Ringkasnya: login, dasbor, CRUD untuk profil, proyek, skill dan kategori, perjalanan, sorotan, tautan sosial, pustaka media (unggah foto, unggah video, tempel link YouTube), kotak pesan, dan pengaturan situs. Urutan diatur dengan seret-dan-lepas.

## 7. Persyaratan non-fungsional

- Performa: Lighthouse mobile minimal 90 untuk Performance, Accessibility, dan SEO. LCP di bawah 2,5 detik.
- Responsif: tanpa scroll horizontal di lebar 360 px.
- Aksesibilitas: semantik HTML, fokus terlihat, alt teks, hormati `prefers-reduced-motion`.
- Keamanan: lihat `docs/API.md` dan `.agent/rules/security.md`. Tidak ada hostname API publik terpisah.
- Keandalan: container `restart: unless-stopped`, backup database harian, uji pemulihan minimal sekali.
- Biaya: nol tambahan di luar domain (Cloudflare Free, server sendiri).
- Bahasa antarmuka: Indonesia.

## 8. Kriteria selesai (MVP)

1. Skenario S1 sampai S6 lolos di produksi.
2. Tidak ada teks `TODO:` atau placeholder yang terlihat publik.
3. `pnpm lint`, `pnpm typecheck`, dan `pnpm build` bersih.
4. Backup harian berjalan dan satu kali restore sudah diuji.
5. Tunnel `bunn.my.id` menuju Nuxt (`localhost:3000`), container Nginx lama sudah dimatikan.

## 9. Keputusan dan pertanyaan terbuka

Sudah diputuskan:
- Satu domain. CMS ada di `/admin`, API di `/api`, unggahan di `/uploads`, semuanya lewat Nuxt. Tidak perlu domain atau subdomain tambahan.
- Monorepo pnpm: `apps/web`, `apps/api`, `packages/shared`.
- Admin tunggal, login dengan sesi cookie.

Masih terbuka (tanyakan ke pemilik sebelum membangun):
- Versi AdonisJS: 7 (Node 24+, default) atau 6 (Node 22) bila ada kendala.
- Perlu halaman detail skill sendiri, atau cukup panel yang terbuka di halaman utama?
- Perlu versi bahasa Inggris untuk rekruter luar negeri? (Ditunda ke v2.)
- Perlu blog atau catatan belajar? (Ditunda ke v2.)
