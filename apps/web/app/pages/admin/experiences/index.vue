<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { EXPERIENCE_KINDS } from '@bunn/shared'
import type { ExperienceKind, PublicMedia } from '@bunn/shared'
import { useAdminApi } from '~/composables/useAdminApi'
import type { AdminExperience } from '~/composables/useAdminApi'
import MediaPickerModal from '~/components/admin/MediaPickerModal.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const adminApi = useAdminApi()

const experiences = ref<AdminExperience[]>([])
const isLoading = ref(true)
const statusMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

// Modal State
const isModalOpen = ref(false)
const editingExperience = ref<AdminExperience | null>(null)
const form = ref({
  kind: 'work' as ExperienceKind,
  title: '',
  organization: '',
  startedOn: '',
  endedOn: '',
  descriptionMd: '',
  isVisible: true,
  mediaIds: [] as number[],
})
const selectedMedia = ref<PublicMedia[]>([])
const isMediaPickerOpen = ref(false)

const loadExperiences = async () => {
  isLoading.value = true
  try {
    const res = await adminApi.getExperiences()
    experiences.value = res || []
  } catch (err) {
    console.error('Gagal memuat data pengalaman:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadExperiences()
})

const showMessage = (type: 'success' | 'error', text: string) => {
  statusMessage.value = { type, text }
  setTimeout(() => {
    if (statusMessage.value?.text === text) statusMessage.value = null
  }, 4000)
}

const openModal = (exp?: AdminExperience) => {
  if (exp) {
    editingExperience.value = exp
    form.value = {
      kind: exp.kind,
      title: exp.title,
      organization: exp.organization || '',
      startedOn: exp.startedOn ? exp.startedOn.slice(0, 10) : '',
      endedOn: exp.endedOn ? exp.endedOn.slice(0, 10) : '',
      descriptionMd: exp.descriptionMd || '',
      isVisible: exp.isVisible,
      mediaIds: exp.media?.map((m) => m.id) || [],
    }
    selectedMedia.value = exp.media || []
  } else {
    editingExperience.value = null
    form.value = {
      kind: 'work',
      title: '',
      organization: '',
      startedOn: '',
      endedOn: '',
      descriptionMd: '',
      isVisible: true,
      mediaIds: [],
    }
    selectedMedia.value = []
  }
  isModalOpen.value = true
}

const handleSave = async () => {
  const payload = {
    kind: form.value.kind,
    title: form.value.title.trim(),
    organization: form.value.organization.trim() || null,
    startedOn: form.value.startedOn,
    endedOn: form.value.endedOn || null,
    descriptionMd: form.value.descriptionMd.trim() || null,
    isVisible: form.value.isVisible,
    mediaIds: form.value.mediaIds,
  }

  try {
    if (editingExperience.value) {
      const updated = await adminApi.updateExperience(editingExperience.value.id, payload)
      const idx = experiences.value.findIndex((e) => e.id === updated.id)
      if (idx >= 0) experiences.value[idx] = updated
      showMessage('success', 'Pengalaman berhasil diperbarui.')
    } else {
      const created = await adminApi.createExperience(payload)
      experiences.value.push(created)
      showMessage('success', 'Pengalaman baru berhasil ditambahkan.')
    }
    isModalOpen.value = false
    await loadExperiences()
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    showMessage('error', errorObj.data?.error?.message || 'Gagal menyimpan pengalaman.')
  }
}

const handleDelete = async (id: number, title: string) => {
  if (!confirm(`Hapus pengalaman "${title}"?`)) return
  try {
    await adminApi.deleteExperience(id)
    experiences.value = experiences.value.filter((e) => e.id !== id)
    showMessage('success', 'Pengalaman berhasil dihapus.')
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    showMessage('error', errorObj.data?.error?.message || 'Gagal menghapus pengalaman.')
  }
}

const moveExperience = async (index: number, direction: 'up' | 'down') => {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= experiences.value.length) return

  const item = experiences.value.splice(index, 1)[0]
  if (item) {
    experiences.value.splice(targetIndex, 0, item)
    await adminApi.reorderExperiences(experiences.value.map((e) => e.id))
  }
}

const handleMediaSelected = (media: PublicMedia | PublicMedia[]) => {
  const items = Array.isArray(media) ? media : [media]
  for (const item of items) {
    if (!selectedMedia.value.some((m) => m.id === item.id)) {
      selectedMedia.value.push(item)
    }
  }
  form.value.mediaIds = selectedMedia.value.map((m) => m.id)
}

useSeoMeta({
  title: 'Kelola Perjalanan — bunn.my.id',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="experiences-admin-page">
    <div class="page-header">
      <div>
        <span class="label">Linimasa Karier & Pendidikan</span>
        <h1>Kelola <em>Perjalanan.</em></h1>
      </div>

      <div class="header-actions">
        <button type="button" class="btn y" @click="openModal()">
          + Tambah Pengalaman Baru
        </button>
      </div>
    </div>

    <!-- Alert Status -->
    <div
      v-if="statusMessage"
      class="alert-bar"
      :class="statusMessage.type === 'success' ? 'alert--success' : 'alert--error'"
      role="alert"
    >
      {{ statusMessage.text }}
    </div>

    <div v-if="isLoading" class="loading-state">
      <p>Memuat linimasa pengalaman...</p>
    </div>

    <!-- Daftar Pengalaman -->
    <div v-else-if="experiences.length > 0" class="experiences-list card">
      <div
        v-for="(exp, index) in experiences"
        :key="exp.id"
        class="exp-row"
      >
        <div class="order-controls">
          <button
            type="button"
            :disabled="index === 0"
            class="arrow-btn"
            @click="moveExperience(index, 'up')"
          >
            ▲
          </button>
          <button
            type="button"
            :disabled="index === experiences.length - 1"
            class="arrow-btn"
            @click="moveExperience(index, 'down')"
          >
            ▼
          </button>
        </div>

        <div class="when-badge">
          {{ exp.startedOn.slice(0, 4) }}
        </div>

        <div class="exp-info">
          <span class="label">{{ exp.kind }}</span>
          <h4>{{ exp.title }}</h4>
          <p v-if="exp.organization" class="org-name">{{ exp.organization }}</p>
          <small class="date-range">
            {{ exp.startedOn.slice(0, 7) }} s/d {{ exp.endedOn ? exp.endedOn.slice(0, 7) : 'Sekarang' }}
          </small>
        </div>

        <div class="exp-actions">
          <button
            type="button"
            class="btn action-btn"
            @click="openModal(exp)"
          >
            Sunting
          </button>
          <button
            type="button"
            class="btn action-btn-del"
            @click="handleDelete(exp.id, exp.title)"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state card">
      <h3>Belum ada pengalaman</h3>
      <p>Tambahkan riwayat magang, kerja praktik, atau proyek kampus.</p>
    </div>

    <!-- Modal Form Pengalaman -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="modal-backdrop"
        @click.self="isModalOpen = false"
      >
        <div class="modal-card">
          <div class="modal-header">
            <h3>{{ editingExperience ? 'Sunting Pengalaman' : 'Tambah Pengalaman Baru' }}</h3>
            <button
              type="button"
              class="close-btn"
              @click="isModalOpen = false"
            >
              ✕
            </button>
          </div>

          <form class="modal-body" @submit.prevent="handleSave">
            <div class="form-grid-2">
              <div class="form-group">
                <label for="exp-title">Judul Pengalaman *</label>
                <input
                  id="exp-title"
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="Contoh: Kerja Praktik Frontend Developer"
                >
              </div>

              <div class="form-group">
                <label for="exp-kind">Jenis Pengalaman *</label>
                <select id="exp-kind" v-model="form.kind" required>
                  <option v-for="k in EXPERIENCE_KINDS" :key="k" :value="k">
                    {{ k }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="exp-org">Organisasi / Instansi / Perusahaan</label>
              <input
                id="exp-org"
                v-model="form.organization"
                type="text"
                placeholder="Contoh: Politeknik Negeri Bandung / PT Teknologi"
              >
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label for="exp-start">Tanggal Mulai *</label>
                <input
                  id="exp-start"
                  v-model="form.startedOn"
                  type="date"
                  required
                >
              </div>

              <div class="form-group">
                <label for="exp-end">Tanggal Selesai (Kosongkan bila Sekarang)</label>
                <input
                  id="exp-end"
                  v-model="form.endedOn"
                  type="date"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="exp-desc">Deskripsi Pengalaman (Markdown opsional)</label>
              <textarea
                id="exp-desc"
                v-model="form.descriptionMd"
                rows="4"
                placeholder="Rincian tanggung jawab dan hasil kerja..."
              />
            </div>

            <!-- Media Pendukung -->
            <div class="media-box">
              <label>Media Dokumentasi ({{ selectedMedia.length }} aset terpilih)</label>
              <div class="media-chips">
                <div
                  v-for="(m, mIdx) in selectedMedia"
                  :key="m.id"
                  class="media-chip"
                >
                  <span>{{ m.title || m.kind }}</span>
                  <button
                    type="button"
                    class="remove-chip-btn"
                    @click="selectedMedia.splice(mIdx, 1); form.mediaIds.splice(mIdx, 1)"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <button
                type="button"
                class="btn"
                @click="isMediaPickerOpen = true"
              >
                + Pilih Media dari Pustaka
              </button>
            </div>

            <div class="modal-footer-actions">
              <button
                type="button"
                class="btn"
                @click="isModalOpen = false"
              >
                Batal
              </button>
              <button type="submit" class="btn y">
                Simpan Pengalaman
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Media Picker Modal -->
    <MediaPickerModal
      :is-open="isMediaPickerOpen"
      :multiple="true"
      @close="isMediaPickerOpen = false"
      @select="handleMediaSelected"
    />
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
  margin-bottom: 24px;
}

.alert--success {
  background: #d4edda;
  color: #155724;
}

.alert--error {
  background: #f8d7da;
  color: #721c24;
}

.experiences-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.exp-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: 12px;
}

.order-controls {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.arrow-btn {
  background: var(--paper);
  border: 1.5px solid var(--ink);
  border-radius: 4px;
  font-size: 10px;
  padding: 2px 5px;
  cursor: pointer;
}

.arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.when-badge {
  font-family: var(--serif);
  font-weight: 900;
  font-size: 20px;
  color: var(--red);
  min-width: 60px;
}

.exp-info {
  flex-grow: 1;
}

.exp-info h4 {
  font-size: 17px;
  margin: 2px 0;
}

.org-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
}

.date-range {
  font-size: 12px;
  color: var(--muted);
}

.exp-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 14px;
  font-size: 13px;
}

.action-btn-del {
  padding: 6px 14px;
  font-size: 13px;
  background: #f8d7da;
  color: #721c24;
}

.empty-state {
  text-align: center;
  padding: 48px;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(42, 31, 27, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  max-width: 680px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--paper);
  border: 3px solid var(--ink);
  border-radius: 16px;
  box-shadow: 8px 8px 0 var(--ink);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 2px solid var(--ink);
  background: var(--cream);
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 700;
  font-size: 13px;
}

.form-group input,
.form-group select,
.form-group textarea {
  border: 2px solid var(--ink);
  border-radius: 8px;
  padding: 9px 12px;
  background: var(--cream);
  font-family: var(--sans);
  font-size: 14px;
}

.media-box {
  padding: 16px;
  background: var(--cream);
  border: 1.5px dashed var(--ink);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.media-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.media-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--paper);
  border: 1.5px solid var(--ink);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.remove-chip-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--red);
  font-weight: 900;
}

.modal-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}
</style>
