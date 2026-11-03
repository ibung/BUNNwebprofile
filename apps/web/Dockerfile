# apps/web/Dockerfile
# Multi-stage build untuk Nuxt 4 (SSR + Nitro)
# Build context: root repo (.)

# Stage 1: Builder
FROM node:24-alpine AS builder

WORKDIR /app

# Pasang pnpm secara global
RUN npm install -g pnpm@10.28.0

# Salin konfigurasi workspace dan lockfile untuk optimalisasi layer cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

# Unduh dan pasang dependensi monorepo untuk target @bunn/web
RUN pnpm install --frozen-lockfile --filter @bunn/web...

# Salin source code
COPY packages/shared/ ./packages/shared/
COPY apps/web/ ./apps/web/

# Kompilasi @bunn/shared ke JavaScript murni (dist/)
RUN pnpm --filter @bunn/shared build

# Kompilasi aplikasi Nuxt 4 ke standalone Nitro server
RUN pnpm --filter @bunn/web build

# Stage 2: Runner
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Buat user & group non-root untuk keamanan kontainer
RUN addgroup -S -g 10001 bunn && \
    adduser -S -u 10001 -G bunn bunn

# Salin hasil kompilasi Nitro
COPY --from=builder --chown=bunn:bunn /app/apps/web/.output /app/.output

USER bunn

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
