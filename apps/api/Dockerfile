# apps/api/Dockerfile
# Multi-stage build untuk AdonisJS 7 (Node 24+, PostgreSQL, Sharp)
# Build context: root repo (.)

# Stage 1: Builder
FROM node:24-alpine AS builder

WORKDIR /app

# Dependensi sistem untuk kompilasi modul native bila dibutuhkan
RUN apk add --no-cache python3 make g++ libc6-compat

# Aktifkan pnpm via corepack
RUN corepack enable

# Salin konfigurasi workspace dan lockfile untuk optimalisasi layer cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Unduh dan pasang dependensi monorepo untuk target @bunn/api
RUN pnpm install --frozen-lockfile --filter @bunn/api...

# Salin source code
COPY packages/shared/ ./packages/shared/
COPY apps/api/ ./apps/api/

# Kompilasi TypeScript AdonisJS ke folder build/
RUN pnpm --filter @bunn/api build

# Siapkan direktori deploy paket produksi bersih dengan dependensi runtime
RUN pnpm --filter @bunn/api --prod deploy --legacy /app/deploy

# Salin artefak hasil build AdonisJS ke folder deploy
RUN cp -r apps/api/build/* /app/deploy/

# Stage 2: Runner
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3333 \
    UPLOADS_DIR=/app/storage/uploads

# Buat user & group non-root untuk keamanan kontainer
RUN addgroup -S -g 10001 bunn && \
    adduser -S -u 10001 -G bunn bunn

# Siapkan direktori penyimpanan unggahan berkas dengan hak akses bunn
RUN mkdir -p /app/storage/uploads && \
    chown -R bunn:bunn /app/storage

# Salin seluruh bundel aplikasi dan dependensi produksi dari builder
COPY --from=builder --chown=bunn:bunn /app/deploy /app

USER bunn

EXPOSE 3333

CMD ["node", "bin/server.js"]

