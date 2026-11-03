# Panduan Lengkap DevOps & Deployment (Home Server Ubuntu)

Dokumen ini adalah materi pembelajaran dan panduan operasional praktis untuk mendeploy portofolio **BUNN Web Profile** ke laptop home server (Ubuntu Server) menggunakan **Docker Compose** dan **Cloudflare Tunnel**.

---

## DAFTAR ISI
1. [Arsitektur & Mengapa Keputusan Ini Diambil](#1-arsitektur--mengapa-keputusan-ini-diambil)
2. [Anatomi Dockerfile & Docker Compose](#2-anatomi-dockerfile--docker-compose)
3. [Langkah Deployment Pertama Kali (Step-by-Step)](#3-langkah-deployment-pertama-kali-step-by-step)
4. [Beralih dari Nginx Lama ke Nuxt (Zero-Downtime)](#4-beralih-dari-nginx-lama-ke-nuxt-zero-downtime)
5. [Strategi Backup & Disaster Recovery](#5-strategi-backup--disaster-recovery)
6. [Keamanan Operasional (Hardening)](#6-keamanan-operasional-hardening)

---

## 1. Arsitektur & Mengapa Keputusan Ini Diambil

```
[ Pengunjung di Internet ]
           │
           ▼
    [ Cloudflare CDN ]  (SSL otomatis, DDoS Protection, Caching)
           │
     (Tunnel Aman via WebSockets / QUIC)
           │
           ▼
[ Home Server: cloudflared ]
           │
     http://localhost:3000
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│ Docker Network Internal                                  │
│                                                          │
│   ┌──────────────────────────┐                           │
│   │ web (Nuxt 4 / Nitro)     │  ← Hanya ini yang terikat │
│   │ :3000                    │    ke 127.0.0.1:3000      │
│   └─────────────┬────────────┘                           │
│                 │ (Proxy internal http://api:3333)       │
│                 ▼                                        │
│   ┌──────────────────────────┐                           │
│   │ api (AdonisJS 7)         │  ← Port 3333 TIDAK        │
│   │                          │    diekspos ke host!      │
│   └─────────────┬────────────┘                           │
│                 │ (Internal network)                     │
│                 ▼                                        │
│   ┌──────────────────────────┐                           │
│   │ db (PostgreSQL 17)       │  ← Port 5432 TIDAK        │
│   │                          │    diekspos ke host!      │
│   └──────────────────────────┘                           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Mengapa Home Server (Laptop Bekas)?
- **Biaya Rp 0**: Daripada menyewa VPS tiap bulan ($5–$12/bulan) yang resource-nya terbatas (1–2 GB RAM), laptop bekas umumnya memiliki 8–16 GB RAM dan hemat listrik (15–30 watt saat idle).
- **Tahan Mati Lampu**: Laptop memiliki baterai internal yang berfungsi seperti UPS mini jika listrik padam sesaat.

### Mengapa Cloudflare Tunnel (Bukan Port Forwarding)?
- Kebanyakan ISP rumahan (Indihome, Biznet, MyRepublic, dll.) menggunakan **CGNAT (Carrier-Grade NAT)** atau IP publik dinamis yang sering berganti.
- Port forwarding di router membuka lubang firewall rumah ke seluruh internet, menjadi target empuk bot scanner.
- Cloudflare Tunnel (`cloudflared`) bekerja secara **outbound** (koneksi keluar dari server ke Cloudflare), sehingga **tidak perlu membuka satu pun port di router**.

### Mengapa Backend Tak Terlihat (Reverse Proxy via Nuxt)?
- Browser hanya pernah tahu satu domain: `https://bunn.my.id`.
- Semua panggilan ke `/api/*` dan `/uploads/*` otomatis diteruskan oleh server Nuxt ke container AdonisJS di jaringan Docker internal.
- **Keuntungan**:
  1. Bebas masalah CORS (*Cross-Origin Resource Sharing*).
  2. Cookie sesi bisa disetel `SameSite=Strict` yang paling aman dari serangan CSRF.
  3. API AdonisJS dan database PostgreSQL tidak pernah bisa di-scan atau diserang langsung dari internet.

---

## 2. Anatomi Dockerfile & Docker Compose

### Konsep Multi-Stage Build
Jika kita memakai Dockerfile biasa (1 stage), semua tool kompilasi (`python3`, `make`, `g++`, dependensi dev) akan terbawa ke image akhir, membuat ukurannya membengkak hingga 1.5–2 GB.

Dengan **Multi-Stage Build**:
1. **Stage 1 (Builder)**: Mengunduh dependensi lengkap, mengompilasi TypeScript, mem-build Nuxt & AdonisJS.
2. **Stage 2 (Runner)**: Mengambil *hanya* artefak hasil kompilasi dan dependensi runtime produksi.
   - Hasilnya: Image `web` hanya **~63 MB** (terkompresi), dan `api` hanya **~100 MB**.

### Keamanan Non-Root User
Di dalam Dockerfile, kita menambahkan:
```dockerfile
RUN addgroup -S -g 10001 bunn && adduser -S -u 10001 -G bunn bunn
USER bunn
```
> [!IMPORTANT]
> Secara default Docker berjalan sebagai `root`. Jika aplikasi memiliki celah keamanan (misal Remote Code Execution), penyerang akan menjadi root di dalam container. Dengan membuat user non-root `bunn`, penyerang terisolasi dan tidak bisa memodifikasi sistem kontainer maupun host.

---

## 3. Langkah Deployment Pertama Kali (Step-by-Step)

Jalankan langkah-langkah ini di terminal **laptop home server (Ubuntu Server)** kamu.

### Langkah 1: Buat SSH Deploy Key (Read-Only)
Agar server bisa menarik kode dari repo GitHub private tanpa perlu memasukkan password akun GitHub kamu:

```bash
# Buat kunci SSH khusus server
ssh-keygen -t ed25519 -f ~/.ssh/bunn_deploy -C "bunn-server" -N ""

# Tampilkan public key
cat ~/.ssh/bunn_deploy.pub
```
1. Salin teks yang muncul (dimulai dengan `ssh-ed25519 ...`).
2. Buka GitHub: **Repo `BUNNwebprofile` → Settings → Deploy keys → Add deploy key**.
3. Judul: `bunn-home-server`, paste kuncinya, **jangan centang "Allow write access"** (read-only aman).
4. Di server, tambahkan konfigurasi SSH agar GitHub memakai kunci ini:
```bash
cat << 'EOF' >> ~/.ssh/config
Host github.com
  IdentityFile ~/.ssh/bunn_deploy
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config ~/.ssh/bunn_deploy
```

### Langkah 2: Clone Repo
```bash
git clone git@github.com:ibung/BUNNwebprofile.git ~/bunn-portfolio
cd ~/bunn-portfolio
```

### Langkah 3: Siapkan Variabel Lingkungan (.env)
Ada 2 file environment yang perlu disiapkan:

1. **File `.env` di Root (Untuk Docker Compose & PostgreSQL)**:
```bash
cp .env.example .env
nano .env
```
Isi dengan kredensial database yang kuat:
```ini
POSTGRES_USER=bunn
POSTGRES_PASSWORD=ganti_dengan_password_db_acak_dan_panjang
POSTGRES_DB=bunn_portfolio
```

2. **File `apps/api/.env` (Untuk Aplikasi AdonisJS)**:
```bash
cp apps/api/.env.example apps/api/.env
nano apps/api/.env
```
Isi variabel-variabel kunci:
```ini
NODE_ENV=production
HOST=0.0.0.0
PORT=3333
LOG_LEVEL=info

# Buat random key 32 karakter (misal lewat command: openssl rand -base64 32)
APP_KEY=ganti_dengan_hasil_openssl_rand_base64_32
APP_URL=https://bunn.my.id

SESSION_DRIVER=cookie
SESSION_SECURE=true

PUBLIC_SITE_URL=https://bunn.my.id
UPLOADS_DIR=/app/storage/uploads

# String acak panjang untuk hash IP kontak agar anonim & privat
IP_HASH_SALT=ganti_dengan_string_acak_panjang_minimal_32_karakter

# HANYA untuk membuat admin pertama kali (dihapus setelah seed)
ADMIN_EMAIL=ibnupisces08@gmail.com
ADMIN_PASSWORD=password_admin_yang_kamu_inginkan_min_12_karakter
```

Kunci izin berkas agar hanya user server yang bisa membaca:
```bash
chmod 600 .env apps/api/.env
```

### Langkah 4: Build Image & Eksekusi Database
```bash
# 1. Build semua image container
docker compose build

# 2. Nyalakan database saja terlebih dahulu
docker compose up -d db

# 3. Tunggu 5 detik sampai database berstatus healthy, lalu jalankan migrasi
docker compose run --rm --no-deps api node ace.js migration:run --force

# 4. Jalankan seeder initial untuk membuat akun admin pertama & struktur data
docker compose run --rm --no-deps api node ace.js db:seed --files database/seeders/initial_seeder.js

# 5. Keamanan: Hapus baris ADMIN_PASSWORD dari apps/api/.env sekarang
nano apps/api/.env  # Hapus isi nilai ADMIN_PASSWORD=
```

### Langkah 5: Nyalakan Seluruh Layanan
```bash
docker compose up -d --wait
```

Periksa status container:
```bash
docker compose ps
```
Semua container (`db`, `api`, `web`) harus berstatus **Up** dan **Healthy**.

Uji respon dari localhost server:
```bash
curl -I http://localhost:3000
curl -s http://localhost:3000/api/health
# Harus mengembalikan: {"data":{"status":"ok"}}
```

---

## 4. Beralih dari Nginx Lama ke Nuxt (Zero-Downtime)

Saat ini domain `bunn.my.id` di Cloudflare Tunnel mengarah ke port Nginx lama (`http://localhost:8080`). Kita akan alihkan ke container Nuxt baru (`http://localhost:3000`):

1. Buka dashboard Cloudflare: **https://one.dash.cloudflare.com/**
2. Pilih akunmu → Menu kiri: **Networks → Tunnels**.
3. Klik nama tunnel kamu (misal: `bunnpilgrim`) → Klik **Configure**.
4. Tab **Public Hostname**:
   - Cari hostname `bunn.my.id`.
   - Klik **Edit**.
   - Ubah URL Service dari `HTTP://localhost:8080` menjadi **`HTTP://localhost:3000`**.
   - Klik **Save Hostname**.
5. **Uji dari HP (Gunakan kuota data seluler, jangan Wi-Fi rumah)**:
   - Buka `https://bunn.my.id` → Tampilan portofolio Nuxt baru akan langsung muncul!
   - Buka `https://bunn.my.id/admin/login` → Coba login dengan email dan password yang kamu buat di seeder tadi.
6. **Setelah yakin normal, matikan Nginx lama**:
   ```bash
   # Hentikan dan hapus container Nginx statis lama
   docker rm -f web
   ```

---

## 5. Strategi Backup & Disaster Recovery

Prinsip dasar DevOps: *"Data yang belum diuji restore-nya bukanlah cadangan."*

### Cara Kerja Skrip Backup (`scripts/backup-db.sh`)
Skrip ini sudah otomatis disiapkan di dalam proyek:
1. Menjalankan `pg_dump` langsung di dalam container database Postgres tanpa mengekspos database ke luar.
2. Mengompresi SQL menjadi `db-YYYYMMDD-HHMMSS.sql.gz`.
3. Mengarsipkan seluruh folder unggahan gambar/dokumen menjadi `uploads-YYYYMMDD-HHMMSS.tar.gz`.
4. Otomatis menghapus backup yang umurnya lebih dari 14 hari agar harddisk tidak penuh.

### Menjadwalkan Backup Otomatis (Cron Job)
Di server, jalankan:
```bash
crontab -e
```
Tambahkan baris berikut di paling bawah (jalan setiap hari jam 03:00 subuh):
```cron
0 3 * * * /home/bunnpilgrim/bunn-portfolio/scripts/backup-db.sh >> /home/bunnpilgrim/backups/backup.log 2>&1
```

### Cara Restore Jika Database Rusak
```bash
# 1. Buka file cadangan sql.gz dan stream langsung ke Postgres container
gunzip -c ~/backups/bunn-portfolio/db-20261103-xxxxxx.sql.gz | docker compose exec -T db psql -U bunn -d bunn_portfolio

# 2. Restore file unggahan jika perlu
docker run --rm -v bunn-portfolio_uploads:/data -v ~/backups/bunn-portfolio:/backup alpine:3 \
  tar xzf /backup/uploads-20261103-xxxxxx.tar.gz -C /data
```

---

## 6. Keamanan Operasional (Hardening)

1. **Cloudflare Zero Trust Access (Sangat Direkomendasikan)**:
   - Di Cloudflare Zero Trust → **Access → Applications → Add an application → Self-hosted**.
   - Application name: `BUNN Admin`.
   - Domain: `bunn.my.id`, Path: `admin*`.
   - Policy: Allow hanya email kamu (`ibnupisces08@gmail.com`).
   - Setiap kali mengakses `/admin`, Cloudflare akan mengirimkan kode OTP 6 digit ke email kamu sebelum mengizinkan halaman login terbuka. Ini membuat panel CMS kamu kebal dari serangan bruteforce bot!

2. **Firewall UFW Server**:
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   # Izinkan SSH HANYA dari jaringan lokal Wi-Fi rumah (misal IP subnet 192.168.1.0/24)
   sudo ufw allow from 192.168.1.0/24 to any port 22
   sudo ufw enable
   ```

