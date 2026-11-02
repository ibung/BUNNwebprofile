# DEPLOYMENT.md

Server: laptop bekas dengan Ubuntu Server, Docker, dan `cloudflared` sebagai service. Panduan ini mengasumsikan itu sudah berjalan (website statis Nginx di port 8080 sudah online).

## Dockerfile (spesifikasi untuk agent)

Dibuat dari **root repo** sebagai build context (karena `packages/shared`), multi-stage, pengguna non-root.

**`apps/web/Dockerfile`**: base `node:24-alpine`, aktifkan pnpm lewat corepack, `pnpm install --frozen-lockfile --filter @bunn/web...`, `pnpm --filter @bunn/web build`, stage akhir hanya menyalin `.output`. Perintah: `node .output/server/index.mjs`, `PORT=3000`, `HOST=0.0.0.0`.

**`apps/api/Dockerfile`**: base `node:24-alpine`, install semua dependensi untuk build, `node ace build`, stage akhir menyalin folder `build/`, install dependensi produksi di dalamnya, buat `storage/uploads` milik pengguna non-root. Perintah: `node bin/server.js`. Migrasi dijalankan lewat `node ace.js migration:run --force` di folder build. Paket `sharp` butuh binary yang cocok dengan alpine (musl); bila bermasalah, pakai base `node:24-slim`.

Tambahkan `.dockerignore` agar `node_modules`, `.git`, `.env`, dan `storage/uploads` tidak ikut build.

## Deploy pertama (di server)

1. Kunci deploy hanya-baca ke repo private:
   ```
   ssh-keygen -t ed25519 -f ~/.ssh/bunn_deploy -C "bunn-server" -N ""
   cat ~/.ssh/bunn_deploy.pub
   ```
   Tambahkan ke GitHub: **Repo → Settings → Deploy keys** (tanpa write access). Lalu atur `~/.ssh/config` agar host `github.com` memakai kunci itu.
2. Clone: `git clone git@github.com:<akun>/bunn-portfolio.git ~/bunn-portfolio && cd ~/bunn-portfolio`
3. Siapkan env:
   ```
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   nano .env apps/api/.env
   ```
   Isi kata sandi database (panjang, acak), `APP_KEY` (`openssl rand -base64 32` atau `node ace generate:key`), `IP_HASH_SALT`, `SESSION_SECURE=true`, `PUBLIC_SITE_URL=https://bunn.my.id`, dan admin pertama. Pastikan `chmod 600` pada kedua berkas.
4. Build dan migrasi:
   ```
   docker compose build
   docker compose up -d db
   docker compose run --rm --no-deps api node ace.js migration:run --force
   docker compose run --rm --no-deps api node ace.js db:seed --files database/seeders/initial_seeder.js
   docker compose up -d --wait
   ```
   Setelah seed, hapus `ADMIN_PASSWORD` dari `apps/api/.env`.
5. Tes lokal di server: `curl -s localhost:3000 | head`, `curl -s localhost:3000/api/health`.
6. Pindahkan rute tunnel: dashboard Cloudflare → **Zero Trust → Networks → Tunnels → bunnpilgrim → Published application routes**, ubah `bunn.my.id` dari `http://localhost:8080` menjadi `http://localhost:3000`.
7. Tes dari HP (data seluler): beranda, `/admin/login`, kirim pesan kontak.
8. Setelah yakin, matikan Nginx lama: `docker rm -f web` (container bernama `web` di luar Compose) dan hapus folder `~/web` bila tidak dipakai.

## Memperbarui

Dari PC: `git push origin main`. Di server: `~/bunn-portfolio/scripts/deploy.sh`. Skrip itu membuat backup database, menarik kode, build, menjalankan migrasi dengan image baru, lalu menjalankan ulang container. Otomatisasi lewat GitHub Actions (self-hosted runner) ada di `TASKS.md`.

Rollback: `git log --oneline`, `git checkout <commit-baik>`, `docker compose up -d --build`. Bila migrasi sudah mengubah skema, restore backup database sebelum rollback kode.

## Backup dan pemulihan

- `scripts/backup-db.sh` membuat `db-<waktu>.sql.gz` dan `uploads-<waktu>.tar.gz` di `$BACKUP_DIR` (default `~/backups/bunn-portfolio`), menghapus yang lebih dari 14 hari.
- Jadwal harian jam 03:00: `crontab -e` lalu `0 3 * * * /home/bunnpilgrim/bunn-portfolio/scripts/backup-db.sh >> /home/bunnpilgrim/backups/backup.log 2>&1`
- Salinan kedua di luar SSD server: salin folder backup ke HDD atau cloud. Cadangan di disk yang sama dengan datanya bukan cadangan.
- HDD berisi file pribadi berformat NTFS. **Jangan diformat.** Pasang hanya setelah memastikan perangkatnya dengan `lsblk -f`, tanpa menyentuh partisi lain.
- Restore database: `gunzip -c db-XXXX.sql.gz | docker compose exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"` (pada database kosong). Restore unggahan: ekstrak tar ke volume `bunn-portfolio_uploads`. **Uji restore minimal sekali** sebelum mengandalkan backup.

## Reset kata sandi admin

```
docker compose run --rm --no-deps api node ace.js admin:reset-password
```
Perintah ini dibuat di tugas CMS (meminta email dan kata sandi baru secara interaktif, tidak lewat argumen agar tidak masuk riwayat shell).

## Keamanan operasional

- **Cloudflare Access** untuk `/admin*` dan `/api/admin*`: Zero Trust → Access → Applications → Add application → Self-hosted, domain `bunn.my.id`, path `admin*` dan `api/admin*`, kebijakan Allow dengan email pemilik (One-time PIN). Gratis untuk paket Free. Uji dari jendela privat bahwa `/admin` meminta verifikasi, dan bahwa halaman publik tetap terbuka. Pastikan path `/api/public/contact` **tidak** tercakup.
- UFW: `sudo ufw allow from 192.168.101.0/24 to any port 22`, `sudo ufw enable`. Situs tidak butuh port masuk.
- SSH: login dengan key, matikan password (`PasswordAuthentication no`).
- Perbarui sistem rutin (`sudo apt update && sudo apt upgrade`) dan rebuild image tiap bulan untuk mendapat patch keamanan.
- Token tunnel hanya ada di service `cloudflared`. Bila pernah terkirim ke tempat tidak aman, buat token baru (Refresh token di dashboard tunnel) lalu `sudo cloudflared service uninstall` dan `service install` ulang.

## Pemantauan

- `docker compose ps`, `docker compose logs -f --tail=100 web api`.
- Uptime Kuma sebagai container terpisah memantau `https://bunn.my.id` dan `/api/health`.
- Domain `bunn.my.id` berlaku sampai 2 November 2027. Aktifkan perpanjangan otomatis di Hostinger.
