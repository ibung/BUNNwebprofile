# DESIGN.md

Sumber kebenaran untuk tampilan. Referensi visual utuhnya ada di `docs/design-reference/index.html` (file HTML asli, taruh di sana apa adanya dan jangan diedit).
Desain ini **sudah disetujui**. Tugas implementasi adalah memindahkannya ke Nuxt dengan setia, lalu merapikannya.

## Karakter

Hangat, tegas, dan sedikit playful. Gaya neo-brutalist yang lembut: blok warna besar, border tebal, bayangan offset keras (tanpa blur), dan tipografi serif yang berani. Hindari tampilan generik seperti gradien ungu atau kartu abu-abu halus.

## Token

Definisikan sebagai CSS custom properties di satu tempat (misalnya `assets/css/tokens.css`).

```css
:root {
  --red: #DA3F1B;
  --yellow: #F2B84B;
  --cream: #F6EDE0;
  --paper: #FCF4E4;
  --ink: #2A1F1B;
  --muted: #6B5D54;
  --green: #6FA06B;

  --serif: 'Fraunces', Georgia, 'Times New Roman', serif;
  --sans: 'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;

  --pad: clamp(20px, 6vw, 92px);
}
```

### Penggunaan warna
- `--red`: latar hero dan kontak, aksen teks (`<em>`), label.
- `--yellow`: aksen di atas merah (teks `<em>`, label), kartu sorotan, tombol utama.
- `--cream`: latar halaman. `--paper`: latar kartu.
- `--ink`: teks utama, border, bayangan, dan latar bagian Keahlian.
- `--muted`: teks sekunder. `--green`: hanya untuk titik "jendela" di hero.

## Tipografi

- Judul (`h1`-`h3`): **Fraunces**, weight 900, `line-height: 1.02`, `letter-spacing: -.01em`. Kata penting diberi `<em>` (miring, berwarna `--red`, atau `--yellow` di atas latar merah).
- Isi: **Plus Jakarta Sans**, 17px, `line-height: 1.6`.
- Label kecil: 13px, bold, huruf kapital, `letter-spacing: .12em`.
- Ukuran judul responsif dengan `clamp()` (h1 hero `clamp(52px, 9vw, 128px)`, judul bagian `clamp(40px, 6vw, 76px)`).
- Font dimuat dari Google Fonts (`display=swap`) atau dihosting sendiri lewat `@nuxt/fonts` agar lebih cepat dan tidak bergantung pihak ketiga.

## Komponen

**Kartu (`card`)**
- Latar `--paper`, border `2.5px solid var(--ink)`, radius `16px`, bayangan `7px 7px 0 var(--ink)`, padding `24px 26px`.
- Varian `y`: latar `--yellow`, teks paragraf `--ink`.
- Di bagian Keahlian (latar gelap), bayangan kartu berwarna `--red` (atau `--yellow` untuk varian `y`).

**Tombol (`btn`)**
- Bentuk pil (`border-radius: 999px`), border `2.5px solid var(--ink)`, bayangan `4px 4px 0 var(--ink)`, padding `13px 24px`, bold.
- Hover: geser `translate(2px, 2px)` dan bayangan jadi `2px 2px 0`. Varian `y` berlatar `--yellow`.

**Pil (`pill`)**
- Teks 13px bold, border `2px solid var(--ink)`, radius penuh, latar `--cream` (`--paper` di dalam kartu kuning).

**Jendela kode (hero, kanan)**
- Kartu `--paper` dengan border `3px`, radius `18px`, bayangan `12px 12px 0 var(--ink)`.
- Bilah atas dengan tiga titik (merah, kuning, hijau) dan isi bergaya kode dengan kursor berkedip.

**Matahari dekoratif (hero)**
- Lingkaran `--yellow` besar di kanan, `aria-hidden`, di belakang konten.

## Struktur halaman

1. **Hero** (latar merah, tinggi layar penuh): navigasi di atas, judul "Halo, saya *Ibnu.*", paragraf pembuka, dua tombol, jendela kode di kanan.
2. **Tentang**: dua kolom (teks | kartu fakta: kampus, lokasi).
3. **Proyek** (latar `#EFE2CE`): grid kartu proyek dengan label, judul, deskripsi, dan pil teknologi.
4. **Keahlian** (latar `--ink`): kartu kelompok keahlian dan satu kartu angka besar.
5. **Perjalanan**: lini masa, tahun di kiri dan kartu di kanan.
6. **Kontak** (latar merah): judul besar "Ayo *ngobrol.*", tombol email, GitHub, LinkedIn.
7. **Footer** merah dengan hak cipta.

## Responsif

- Titik patah utama `860px`: hero dan Tentang jadi satu kolom, lini masa menumpuk, jarak navigasi dirapatkan.
- Gutter samping memakai `--pad`. Tidak boleh ada scroll horizontal di lebar 360px.
- Grid proyek dan keahlian memakai `repeat(auto-fit, minmax(260px, 1fr))`.

## Aksesibilitas

- Fokus keyboard terlihat: `:focus-visible { outline: 3px solid var(--ink); outline-offset: 3px }`.
- Hormati `prefers-reduced-motion`: matikan animasi kursor, transisi tombol, dan smooth scroll.
- Elemen dekoratif (matahari, jendela kode) diberi `aria-hidden="true"`.
- Tautan eksternal memakai `rel="noopener"`.

## Yang boleh dirapikan

- Memecah HTML menjadi komponen (`HeroSection`, `ProjectCard`, `SkillGroup`, `Timeline`, dst.).
- Memindahkan CSS ke token dan komponen, menghapus duplikasi.
- Memperbaiki kontras, urutan heading, label ARIA, dan ukuran target sentuh.
- Mengganti ikon emoji favicon dengan file favicon sungguhan.

## Yang tidak boleh diubah tanpa diminta

- Palet warna, pasangan font, bentuk kartu/tombol, dan bayangan offset.
- Urutan dan nama bagian halaman.
- Nada penulisan (santai, personal, Bahasa Indonesia).

## Konten placeholder

Bagian berikut di referensi masih contoh dan harus diganti oleh pemilik. Tandai di kode dengan `TODO:` dan jangan dikarang:

- Teks "(Teks contoh, silakan diganti.)" dan "(Paragraf contoh...)"
- Judul dan deskripsi proyek ("Proyek Website A", "Proyek Pribadi C")
- Angka "±580 test case" dan keterangan "contoh"
- Email `email@contoh.com`, tautan GitHub dan LinkedIn
- Isi lini masa selain yang sudah pasti

## Konten dinamis dan media

Konten datang dari database, jadi komponen harus tahan terhadap teks yang lebih panjang atau lebih pendek dari contoh di referensi, daftar kosong, dan media yang tidak ada.

- **Daftar kosong**: bagian yang tidak punya isi publik disembunyikan seluruhnya (jangan tampilkan judul bagian tanpa isi).
- **Teks panjang**: kartu memotong ringkasan dengan `line-clamp` (3 baris), halaman detail menampilkan penuh. Judul tidak boleh meluber dari kartu.
- **Gambar**: pakai `<img>` dengan `srcset` dari varian `thumb` (480), `md` (960), `lg` (1600), atribut `width` dan `height` dari database (mencegah layout bergeser), `loading="lazy"` kecuali gambar di layar pertama. Bingkai gambar memakai border `2.5px solid var(--ink)` dan radius `16px` seperti kartu.
- **Galeri**: grid `repeat(auto-fill, minmax(220px, 1fr))`. Klik membuka lightbox: tombol tutup, panah kiri/kanan, Esc menutup, jebakan fokus, fokus kembali ke gambar pemicu. Teks `caption` tampil di bawah gambar besar.
- **Video YouTube**: tampil sebagai kartu bingkai dengan tombol putar besar dan judul, **tanpa** memuat apa pun dari YouTube sampai diklik. Setelah klik, ganti dengan iframe `https://www.youtube-nocookie.com/embed/<id>` (rasio 16:9, `start` bila ada, `title` dari database). Jangan memakai thumbnail dari domain YouTube secara otomatis.
- **Video unggahan**: elemen `<video controls preload="metadata" playsinline>` dengan `poster` dari database. Tidak diputar otomatis.
- **Tautan eksternal** dari konten: `rel="noopener noreferrer"`, `target="_blank"` hanya untuk tautan keluar.
- **Markdown** (deskripsi proyek, tentang): gaya tipografi mengikuti isi: judul Fraunces, paragraf Plus Jakarta Sans 17px, daftar, kutipan, kode inline dengan latar `--cream`, blok kode dengan border `--ink`. Lebar baca maksimum ~70ch.

## Panel admin

Panel admin (`/admin`) memakai token yang sama tetapi tampil lebih tenang dan padat, karena dipakai untuk bekerja, bukan memamerkan.

- Latar `--cream`, kartu `--paper` dengan border `2px solid var(--ink)`, radius `12px`, **tanpa** bayangan offset besar (cukup `3px 3px 0 var(--ink)` pada kartu sorotan saja).
- Judul memakai Fraunces dengan ukuran sedang. Isi dan formulir memakai Plus Jakarta Sans 15-16px.
- Sidebar kiri `--ink` dengan teks `--cream`, item aktif ber-latar `--yellow` dan teks `--ink`. Di layar kecil menjadi menu geser.
- Tombol utama `--red` dengan teks putih, sekunder `--paper` dengan border `--ink`, bahaya memakai merah tua dan wajib ada konfirmasi.
- Formulir: label di atas input, pesan galat di bawah input dengan ikon dan teks (jangan hanya warna), indikator wajib diisi, status simpan ("Tersimpan", "Belum disimpan").
- Tabel dan daftar bisa diurutkan dengan seret. Pegangan seret harus bisa dioperasikan keyboard (tombol naik/turun sebagai alternatif).
- Dialog (pemilih media, konfirmasi hapus) memakai jebakan fokus, Esc menutup, fokus kembali ke pemicu.
- Penanda "belum lengkap" (alt teks kosong, proyek tanpa cover) memakai `--yellow` dengan teks penjelas.
- Panel admin tidak perlu pixel-perfect terhadap referensi publik, tetapi harus konsisten antar-halaman dan lolos aksesibilitas yang sama.
