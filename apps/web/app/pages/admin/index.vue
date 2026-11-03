<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PublicMedia } from '@bunn/shared'
import { useAdminApi } from '~/composables/useAdminApi'
import type { AdminProject, AdminMessage } from '~/composables/useAdminApi'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const adminApi = useAdminApi()

const isLoading = ref(true)
const projects = ref<AdminProject[]>([])
const messages = ref<AdminMessage[]>([])
const mediaList = ref<PublicMedia[]>([])

const publishedCount = ref(0)
const draftCount = ref(0)
const newMessagesCount = ref(0)

const incompleteProjects = ref<AdminProject[]>([])
const mediaMissingAlt = ref<PublicMedia[]>([])

const loadDashboardData = async () => {
  isLoading.value = true
  try {
    const [projRes, msgRes, mediaRes] = await Promise.all([
      adminApi.getProjects({ perPage: 100 }),
      adminApi.getMessages({ perPage: 100 }),
      adminApi.getMedia({ perPage: 100 }),
    ])

    projects.value = projRes.data || []
    messages.value = msgRes.data || []
    mediaList.value = mediaRes.data || []

    publishedCount.value = projects.value.filter((p) => p.status === 'published').length
    draftCount.value = projects.value.filter((p) => p.status === 'draft').length
    newMessagesCount.value = messages.value.filter((m) => m.status === 'new').length

    incompleteProjects.value = projects.value.filter((p) => !p.coverMediaId)
    mediaMissingAlt.value = mediaList.value.filter(
      (m: PublicMedia) => m.kind === 'image' && (!m.altText || m.altText.trim() === '')
    )
  } catch (err) {
    console.error('Gagal memuat data dasbor:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})

useSeoMeta({
  title: 'Dasbor CMS — bunn.my.id',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="dashboard-page">
    <div class="page-header">
      <div>
        <span class="label">Ikhtisar</span>
        <h1>Dasbor <em>Pengelola.</em></h1>
      </div>

      <div class="header-actions">
        <NuxtLink to="/admin/projects/new" class="btn y">
          + Proyek Baru
        </NuxtLink>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <p>Memuat ringkasan data dasbor...</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- Kartu Metrik Ringkasan -->
      <div class="metrics-grid">
        <div class="metric-card card">
          <span class="metric-label">Proyek Terbit</span>
          <div class="metric-value">{{ publishedCount }}</div>
          <small>Aktif di situs publik</small>
        </div>

        <div class="metric-card card">
          <span class="metric-label">Draf Proyek</span>
          <div class="metric-value">{{ draftCount }}</div>
          <small>Belum dipublikasikan</small>
        </div>

        <div class="metric-card card" :class="{ y: newMessagesCount > 0 }">
          <span class="metric-label">Pesan Baru</span>
          <div class="metric-value">{{ newMessagesCount }}</div>
          <small>Memerlukan tanggapan</small>
        </div>

        <div class="metric-card card">
          <span class="metric-label">Total Aset Media</span>
          <div class="metric-value">{{ mediaList.length }}</div>
          <small>Gambar, video & dokumen</small>
        </div>
      </div>

      <!-- Bagian: Perlu Perhatian / Belum Lengkap -->
      <section
        v-if="mediaMissingAlt.length > 0 || incompleteProjects.length > 0 || newMessagesCount > 0"
        class="attention-section card y"
      >
        <div class="attention-header">
          <span class="label" style="color: var(--ink)">Pemberitahuan Kelengkapan</span>
          <h2>Perlu Perhatian</h2>
        </div>

        <ul class="attention-list">
          <li v-if="newMessagesCount > 0">
            Terdapat <strong>{{ newMessagesCount }} pesan kontak baru</strong> yang belum dibaca.
            <NuxtLink to="/admin/messages" class="action-link">Buka Kotak Pesan →</NuxtLink>
          </li>

          <li v-if="mediaMissingAlt.length > 0">
            <strong>{{ mediaMissingAlt.length }} gambar</strong> belum memiliki alt teks (deskripsi aksesibilitas).
            <NuxtLink to="/admin/media" class="action-link">Lengkapi di Pustaka Media →</NuxtLink>
          </li>

          <li v-if="incompleteProjects.length > 0">
            <strong>{{ incompleteProjects.length }} proyek</strong> belum memiliki sampul cover utama.
            <NuxtLink to="/admin/projects" class="action-link">Atur Proyek →</NuxtLink>
          </li>
        </ul>
      </section>

      <!-- Tautan Cepat -->
      <section class="quick-links-section">
        <h3>Tautan Cepat</h3>
        <div class="quick-links-grid">
          <NuxtLink to="/admin/projects" class="card quick-card">
            <h4>Kelola Proyek</h4>
            <p>Tambah, edit deskripsi markdown, dan atur urutan tampilan proyek.</p>
          </NuxtLink>

          <NuxtLink to="/admin/media" class="card quick-card">
            <h4>Pustaka Media</h4>
            <p>Unggah foto, video demo, dan tautkan video YouTube.</p>
          </NuxtLink>

          <NuxtLink to="/admin/profile" class="card quick-card">
            <h4>Profil & Narasi</h4>
            <p>Sunting narasi tentang saya, headline, tautan sosial, dan sorotan.</p>
          </NuxtLink>

          <NuxtLink to="/admin/settings" class="card quick-card">
            <h4>Pengaturan Situs</h4>
            <p>Atur judul situs, Open Graph image, teks footer, dan ganti sandi.</p>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 28px;
}

.page-header h1 {
  font-size: 34px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.metric-card {
  padding: 20px;
}

.metric-label {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--muted);
}

.metric-value {
  font-family: var(--serif);
  font-weight: 900;
  font-size: 44px;
  color: var(--ink);
  line-height: 1.1;
  margin: 6px 0;
}

.attention-section {
  padding: 24px;
  margin-bottom: 36px;
}

.attention-header h2 {
  font-size: 24px;
  margin: 4px 0 16px;
}

.attention-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attention-list li {
  font-size: 15px;
}

.action-link {
  font-weight: 700;
  color: var(--ink);
  text-decoration: underline;
  margin-left: 8px;
}

.quick-links-section h3 {
  font-size: 22px;
  margin-bottom: 16px;
}

.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.quick-card {
  text-decoration: none;
  color: inherit;
  padding: 20px;
}

.quick-card:hover {
  transform: translate(2px, 2px);
}

.quick-card h4 {
  font-size: 18px;
  margin-bottom: 6px;
}

.quick-card p {
  font-size: 14px;
  color: var(--muted);
}
</style>
