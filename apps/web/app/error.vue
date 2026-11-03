<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="error-page wrap">
    <div class="card error-card">
      <span class="label">Galat Sistem</span>

      <h1 v-if="error.statusCode === 404">
        404 — Halaman <em>Tidak Ditemukan.</em>
      </h1>
      <h1 v-else>
        {{ error.statusCode || 500 }} — Terjadi <em>Kendala.</em>
      </h1>

      <p class="error-desc">
        {{
          error.statusCode === 404
            ? 'Halaman yang Anda tuju tidak ditemukan atau alamat URL salah.'
            : error.statusMessage || 'Terjadi kendala saat memuat halaman ini.'
        }}
      </p>

      <div class="error-actions">
        <button type="button" class="btn y" @click="handleError">
          ← Kembali ke Beranda
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  padding: 40px var(--pad);
}

.error-card {
  max-width: 640px;
  width: 100%;
  padding: 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-card h1 {
  font-size: clamp(32px, 5vw, 48px);
}

.error-desc {
  font-size: 18px;
  color: var(--muted);
}

.error-actions {
  margin-top: 16px;
}
</style>
