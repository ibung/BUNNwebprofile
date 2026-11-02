#!/usr/bin/env bash
# Deploy di server: backup, tarik kode, build, migrasi, jalankan ulang.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "→ backup database"
./scripts/backup-db.sh

echo "→ tarik kode terbaru"
git pull --ff-only

echo "→ build image"
docker compose build

echo "→ pastikan database hidup"
docker compose up -d db --wait

echo "→ migrasi database (image baru)"
docker compose run --rm --no-deps api node ace.js migration:run --force

echo "→ jalankan ulang layanan"
docker compose up -d --wait

echo "→ status"
docker compose ps
