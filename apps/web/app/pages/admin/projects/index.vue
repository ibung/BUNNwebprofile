<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PUBLISH_STATUSES, PUBLISH_STATUS_LABELS } from '@bunn/shared'
import type { PublishStatus } from '@bunn/shared'
import { useAdminApi } from '~/composables/useAdminApi'
import { useAdminToast } from '~/composables/useAdminToast'
import type { AdminProject } from '~/composables/useAdminApi'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const adminApi = useAdminApi()
const toast = useAdminToast()

const projects = ref<AdminProject[]>([])
const isLoading = ref(true)
const statusFilter = ref('')
const searchQuery = ref('')

const fetchProjects = async () => {
  isLoading.value = true
  try {
    const res = await adminApi.getProjects({
      status: statusFilter.value || undefined,
      q: searchQuery.value || undefined,
      perPage: 100,
    })
    projects.value = res.data || []
  } catch (err) {
    console.error('Gagal mengambil daftar proyek:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})

const handleStatusChange = async (project: AdminProject, newStatus: PublishStatus) => {
  try {
    await adminApi.updateProjectStatus(project.id, newStatus)
    project.status = newStatus
    toast.success(`Status proyek "${project.title}" diubah menjadi ${PUBLISH_STATUS_LABELS[newStatus]}.`)
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    toast.error(errorObj.data?.error?.message || 'Gagal mengubah status proyek.')
  }
}

const handleDeleteProject = async (id: number, title: string) => {
  if (!confirm(`Hapus proyek "${title}" secara permanen? Tindakan ini tidak dapat dibatalkan.`)) return

  try {
    await adminApi.deleteProject(id)
    projects.value = projects.value.filter((p) => p.id !== id)
    toast.success('Proyek berhasil dihapus.')
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    toast.error(errorObj.data?.error?.message || 'Gagal menghapus proyek.')
  }
}

const moveProject = async (index: number, direction: 'up' | 'down') => {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= projects.value.length) return

  const item = projects.value.splice(index, 1)[0]
  if (item) {
    projects.value.splice(targetIndex, 0, item)
    try {
      await adminApi.reorderProjects(projects.value.map((p) => p.id))
      toast.success('Urutan proyek berhasil diperbarui.')
    } catch {
      toast.error('Gagal memperbarui urutan proyek.')
    }
  }
}

useSeoMeta({
  title: 'Kelola Proyek — bunn.my.id',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="projects-admin-page">
    <div class="page-header">
      <div>
        <span class="label">Manajemen Karya</span>
        <h1>Daftar <em>Proyek.</em></h1>
      </div>

      <div class="header-actions">
        <NuxtLink to="/admin/projects/new" class="btn y">
          + Buat Proyek Baru
        </NuxtLink>
      </div>
    </div>

    <!-- Toolbar Filter -->
    <div class="filter-toolbar card">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari berdasarkan judul atau peran..."
          @input="fetchProjects"
        >
      </div>

      <div class="status-select-box">
        <select v-model="statusFilter" @change="fetchProjects">
          <option value="">Semua Status</option>
          <option v-for="st in PUBLISH_STATUSES" :key="st" :value="st">
            {{ PUBLISH_STATUS_LABELS[st] }}
          </option>
        </select>
      </div>
    </div>

    <!-- Tabel Daftar Proyek -->
    <div v-if="isLoading" class="loading-state">
      <p>Memuat daftar proyek...</p>
    </div>

    <div v-else-if="projects.length > 0" class="projects-list card">
      <div
        v-for="(project, index) in projects"
        :key="project.id"
        class="project-row"
      >
        <!-- Kontrol Urutan -->
        <div class="order-controls">
          <button
            type="button"
            :disabled="index === 0"
            class="arrow-btn"
            aria-label="Geser naik"
            @click="moveProject(index, 'up')"
          >
            ▲
          </button>
          <button
            type="button"
            :disabled="index === projects.length - 1"
            class="arrow-btn"
            aria-label="Geser turun"
            @click="moveProject(index, 'down')"
          >
            ▼
          </button>
        </div>

        <!-- Cover Miniatur -->
        <div class="cover-thumb">
          <img
            v-if="project.coverMedia?.urls?.thumb || project.coverMedia?.urls?.original"
            :src="project.coverMedia.urls.thumb || project.coverMedia.urls.original"
            :alt="project.title"
          >
          <div v-else class="empty-thumb">
            No Cover
          </div>
        </div>

        <!-- Info Judul & Meta -->
        <div class="project-info">
          <div class="title-row">
            <h4>{{ project.title }}</h4>
            <span v-if="project.isFeatured" class="featured-badge">★ Unggulan</span>
          </div>

          <p class="summary-line">{{ project.summary }}</p>

          <div class="meta-tags">
            <span class="role-tag">{{ project.kind || project.role || 'Proyek' }}</span>
            <small class="slug-tag">/projects/{{ project.slug }}</small>
          </div>
        </div>

        <!-- Status Dropdown Cepat -->
        <div class="status-col">
          <select
            :value="project.status"
            class="status-dropdown"
            :class="'status--' + project.status"
            @change="handleStatusChange(project, ($event.target as HTMLSelectElement).value as PublishStatus)"
          >
            <option v-for="st in PUBLISH_STATUSES" :key="st" :value="st">
              {{ PUBLISH_STATUS_LABELS[st] }}
            </option>
          </select>
        </div>

        <!-- Tombol Aksi -->
        <div class="row-actions">
          <NuxtLink
            :to="`/admin/projects/${project.id}`"
            class="btn action-btn-edit"
          >
            Sunting
          </NuxtLink>

          <button
            type="button"
            class="btn action-btn-delete"
            @click="handleDeleteProject(project.id, project.title)"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state card">
      <h3>Belum ada proyek</h3>
      <p>Klik tombol "+ Buat Proyek Baru" untuk menambahkan karya ke portofolio Anda.</p>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 34px;
}

.alert-bar {
  padding: 12px 18px;
  border: 2px solid var(--ink);
  border-radius: 10px;
  font-weight: 700;
  margin-bottom: 20px;
}

.alert--success {
  background: #d4edda;
  color: #155724;
}

.alert--error {
  background: #f8d7da;
  color: #721c24;
}

.filter-toolbar {
  padding: 16px 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.search-box {
  flex-grow: 1;
}

.search-box input {
  width: 100%;
  border: 2px solid var(--ink);
  border-radius: 8px;
  padding: 10px 14px;
  background: var(--cream);
  font-family: var(--sans);
  font-size: 15px;
}

.status-select-box select {
  border: 2px solid var(--ink);
  border-radius: 8px;
  padding: 10px 14px;
  background: var(--cream);
  font-family: var(--sans);
  font-weight: 700;
  font-size: 15px;
}

.projects-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-row {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 14px 18px;
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: 12px;
  transition: transform 0.1s ease;
}

.order-controls {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.arrow-btn {
  background: var(--paper);
  border: 1.5px solid var(--ink);
  border-radius: 4px;
  font-size: 11px;
  padding: 2px 6px;
  cursor: pointer;
}

.arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.cover-thumb {
  width: 64px;
  height: 48px;
  border: 1.5px solid var(--ink);
  border-radius: 6px;
  overflow: hidden;
  background: var(--paper);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-thumb {
  font-size: 9px;
  color: var(--muted);
  text-align: center;
}

.project-info {
  flex-grow: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-row h4 {
  font-size: 18px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.featured-badge {
  font-size: 11px;
  font-weight: 700;
  background: var(--yellow);
  border: 1px solid var(--ink);
  padding: 2px 8px;
  border-radius: 999px;
}

.summary-line {
  font-size: 14px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 4px 0;
}

.meta-tags {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.role-tag {
  font-weight: 700;
  color: var(--red);
  text-transform: uppercase;
}

.slug-tag {
  color: var(--muted);
}

.status-dropdown {
  padding: 6px 12px;
  border: 2px solid var(--ink);
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.status--published {
  background: #d4edda;
  color: #155724;
}

.status--draft {
  background: #fff3cd;
  color: #856404;
}

.status--archived {
  background: #e2e3e5;
  color: #383d41;
}

.row-actions {
  display: flex;
  gap: 8px;
}

.action-btn-edit {
  padding: 6px 14px;
  font-size: 13px;
}

.action-btn-delete {
  padding: 6px 14px;
  font-size: 13px;
  background: #f8d7da;
  color: #721c24;
}

.empty-state {
  text-align: center;
  padding: 48px;
}

@media (max-width: 768px) {
  .project-row {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
