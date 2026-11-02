#!/usr/bin/env bash
# Backup database dan unggahan. Jalankan dari server, mis. lewat cron.
# BACKUP_DIR dan KEEP_DAYS bisa diatur lewat environment.
set -euo pipefail

cd "$(dirname "$0")/.."

BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/bunn-portfolio}"
KEEP_DAYS="${KEEP_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"

echo "[$STAMP] backup database"
# Variabel POSTGRES_* dibaca dari dalam container, jadi tidak perlu memuat .env di sini.
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner' \
  | gzip > "$BACKUP_DIR/db-$STAMP.sql.gz"

echo "[$STAMP] backup unggahan"
VOLUME="$(docker volume ls --format '{{.Name}}' | grep -E '(^|_)uploads$' | head -n1 || true)"
if [ -n "$VOLUME" ]; then
  docker run --rm -v "$VOLUME":/data:ro -v "$BACKUP_DIR":/backup alpine:3 \
    tar czf "/backup/uploads-$STAMP.tar.gz" -C /data .
else
  echo "volume uploads tidak ditemukan, dilewati"
fi

echo "[$STAMP] hapus backup lebih dari $KEEP_DAYS hari"
find "$BACKUP_DIR" -type f \( -name 'db-*.sql.gz' -o -name 'uploads-*.tar.gz' \) -mtime +"$KEEP_DAYS" -delete

echo "[$STAMP] selesai: $BACKUP_DIR"
