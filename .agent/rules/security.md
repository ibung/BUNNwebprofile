# Aturan: keamanan

## Rahasia
- Jangan pernah menulis token, kata sandi, `APP_KEY`, atau isi `.env` ke repo, log, komentar, atau pesan commit. Jangan membuka atau mencetak isi `.env`.
- Hanya `*.env.example` bernilai kosong yang di-commit.
- Token Cloudflare Tunnel hanya ada di server.

## Autentikasi dan sesi
- Sesi cookie `HttpOnly`, `SameSite=Lax`, `Secure` di produksi. Aktifkan trust proxy agar `X-Forwarded-Proto` dihormati.
- Semua rute `/api/admin/*` di balik middleware auth. Rute baru ditolak secara default sampai sengaja dibuka.
- CSRF aktif untuk semua metode tulis di admin dan di `/api/public/contact`.
- Login dibatasi 5 percobaan per 15 menit. Pesan galat login selalu umum.
- Kata sandi di-hash dengan hasher bawaan framework. Minimal 12 karakter saat diganti.

## Input dan unggahan
- Validasi semua input dengan VineJS. Batasi panjang semua teks.
- Unggahan: tentukan tipe dari isi berkas, izinkan hanya daftar di `docs/API.md`, tolak SVG, nama berkas acak di disk, batasi ukuran, tidak ada path dari klien.
- Link YouTube hanya diambil ID-nya. Server tidak pernah mengambil URL yang dikirim pengguna (cegah SSRF).
- Markdown disanitasi di server. Tidak ada HTML mentah dari admin, tautan `javascript:` dibuang, tautan eksternal diberi `rel="noopener noreferrer"`.
- Form kontak: honeypot, pembatasan laju per IP, panjang maksimum, IP disimpan sebagai hash.

## Jaringan
- Hanya `web` yang dipetakan ke host, terikat ke `127.0.0.1`. `api` dan `db` tidak punya port publik. Jangan membuat hostname API publik atau membuka port di modem.
- Header keamanan: CSP (izinkan `frame-src https://www.youtube-nocookie.com`), `Referrer-Policy`, `X-Content-Type-Options: nosniff`.

## Tindakan berisiko
Minta persetujuan eksplisit sebelum: `rm -rf`, `docker system prune`, `docker volume rm`, `git push --force`, `DROP`/`TRUNCATE`, `migration:fresh` atau `db:wipe`, mengubah firewall atau SSH di server, dan menyentuh disk HDD pemilik.
