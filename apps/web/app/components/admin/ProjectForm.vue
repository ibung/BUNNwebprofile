<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PUBLISH_STATUSES } from '@bunn/shared'
import type { PublicMedia, PublishStatus } from '@bunn/shared'
import { useAdminApi } from '~/composables/useAdminApi'
import type { AdminProject, AdminSkill } from '~/composables/useAdminApi'
import MediaPickerModal from './MediaPickerModal.vue'

const props = defineProps<{
  initialData?: AdminProject | null
  isEdit?: boolean
}>()

const router = useRouter()
const adminApi = useAdminApi()

const isSaving = ref(false)
const errorMessage = ref<string | null>(null)
const validationErrors = ref<string[]>([])

// Form state
const form = ref({
  title: props.initialData?.title || '',
  slug: props.initialData?.slug || '',
  summary: props.initialData?.summary || '',
  descriptionMd: props.initialData?.descriptionMd || '',
  kind: props.initialData?.kind || '',
  role: props.initialData?.role || '',
  status: (props.initialData?.status || 'draft') as PublishStatus,
  isFeatured: props.initialData?.isFeatured || false,
  demoUrl: props.initialData?.demoUrl || '',
  repoUrl: props.initialData?.repoUrl || '',
  startedOn: props.initialData?.startedOn ? props.initialData.startedOn.slice(0, 10) : '',
  endedOn: props.initialData?.endedOn ? props.initialData.endedOn.slice(0, 10) : '',
  coverMediaId: props.initialData?.coverMediaId || null as number | null,
  skillIds: props.initialData?.skills?.map((s) => s.id) || ([] as number[]),
  mediaIds: props.initialData?.media?.map((m) => m.id) || ([] as number[]),
})

// Markdown tab
const markdownTab = ref<'write' | 'preview'>('write')

// Available Skills
const allSkills = ref<AdminSkill[]>([])

// Selected Media Objects
const selectedCover = ref<PublicMedia | null>(props.initialData?.coverMedia || null)
const selectedGallery = ref<PublicMedia[]>(props.initialData?.media || [])

// Modal Pickers
const isCoverPickerOpen = ref(false)
const isGalleryPickerOpen = ref(false)

const loadSkills = async () => {
  try {
    const res = await adminApi.getSkills()
    allSkills.value = res || []
  } catch (err) {
    console.error('Gagal memuat daftar skill:', err)
  }
}

onMounted(() => {
  loadSkills()
})

// Auto-generate slug dari title jika belum diubah manual
const handleTitleInput = () => {
  if (!props.isEdit && (!form.value.slug || form.value.slug.trim() === '')) {
    form.value.slug = form.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

// Media Selection Handlers
const handleCoverSelected = (media: PublicMedia | PublicMedia[]) => {
  const item = Array.isArray(media) ? media[0] : media
  if (!item) return
  selectedCover.value = item
  form.value.coverMediaId = item.id
}

const handleGallerySelected = (media: PublicMedia | PublicMedia[]) => {
  const items = Array.isArray(media) ? media : [media]
  for (const item of items) {
    if (!selectedGallery.value.some((m) => m.id === item.id)) {
      selectedGallery.value.push(item)
    }
  }
  form.value.mediaIds = selectedGallery.value.map((m) => m.id)
}

const removeGalleryItem = (index: number) => {
  selectedGallery.value.splice(index, 1)
  form.value.mediaIds = selectedGallery.value.map((m) => m.id)
}

const moveGalleryItem = (index: number, direction: 'up' | 'down') => {
  const target = direction === 'up' ? index - 1 : index + 1
  if (target < 0 || target >= selectedGallery.value.length) return
  const item = selectedGallery.value.splice(index, 1)[0]
  if (item) {
    selectedGallery.value.splice(target, 0, item)
    form.value.mediaIds = selectedGallery.value.map((m) => m.id)
  }
}

// Toggle Skill selection
const toggleSkill = (skillId: number) => {
  const idx = form.value.skillIds.indexOf(skillId)
  if (idx >= 0) {
    form.value.skillIds.splice(idx, 1)
  } else {
    form.value.skillIds.push(skillId)
  }
}

// Validasi Kelengkapan Sebelum Terbit
const validatePublishReadiness = (): boolean => {
  const errors: string[] = []

  if (!form.value.title.trim()) errors.push('Judul proyek tidak boleh kosong.')
  if (!form.value.summary.trim()) errors.push('Ringkasan proyek wajib diisi.')
  if (!form.value.descriptionMd.trim()) errors.push('Deskripsi detail proyek wajib diisi.')
  if (!form.value.coverMediaId) errors.push('Sampul (Cover Media) wajib dipilih sebelum terbit.')
  if (selectedCover.value && !selectedCover.value.altText) {
    errors.push('Alt teks pada gambar sampul wajib diisi di Pustaka Media.')
  }

  validationErrors.value = errors
  return errors.length === 0
}

const handleSubmit = async (targetStatus?: PublishStatus) => {
  if (targetStatus) {
    form.value.status = targetStatus
  }

  if (form.value.status === 'published') {
    const isReady = validatePublishReadiness()
    if (!isReady) {
      errorMessage.value = 'Proyek belum dapat diterbitkan karena ada data yang belum lengkap.'
      return
    }
  }

  isSaving.value = true
  errorMessage.value = null
  validationErrors.value = []

  const payload = {
    title: form.value.title.trim(),
    slug: form.value.slug.trim(),
    summary: form.value.summary.trim(),
    descriptionMd: form.value.descriptionMd.trim(),
    kind: form.value.kind.trim() || null,
    role: form.value.role.trim() || null,
    status: form.value.status,
    isFeatured: form.value.isFeatured,
    demoUrl: form.value.demoUrl.trim() || null,
    repoUrl: form.value.repoUrl.trim() || null,
    startedOn: form.value.startedOn || null,
    endedOn: form.value.endedOn || null,
    coverMediaId: form.value.coverMediaId,
    skillIds: form.value.skillIds,
    mediaIds: form.value.mediaIds,
  }

  try {
    if (props.isEdit && props.initialData) {
      await adminApi.updateProject(props.initialData.id, payload)
    } else {
      await adminApi.createProject(payload)
    }
    await router.push('/admin/projects')
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    errorMessage.value =
      errorObj.data?.error?.message || 'Gagal menyimpan proyek.'
  } finally {
    isSaving.value = false
  }
}

// Sederhana Markdown preview renderer
const previewHtml = computed(() => {
  const md = form.value.descriptionMd
  if (!md) return '<p><em>Belum ada deskripsi.</em></p>'
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n$/gim, '<br />')
    .replace(/\n\n/gim, '</p><p>')
})
</script>

<template>
  <form class="project-form" @submit.prevent="handleSubmit()">
    <!-- Alert Error / Validasi -->
    <div v-if="errorMessage" class="alert-error" role="alert">
      ⚠ {{ errorMessage }}
      <ul v-if="validationErrors.length > 0" class="error-list">
        <li v-for="e in validationErrors" :key="e">{{ e }}</li>
      </ul>
    </div>

    <!-- Bagian 1: Data Dasar -->
    <fieldset class="form-section card">
      <legend>1. Informasi Dasar</legend>

      <div class="form-grid-2">
        <div class="form-group">
          <label for="p-title">Judul Proyek *</label>
          <input
            id="p-title"
            v-model="form.title"
            type="text"
            required
            placeholder="Contoh: Portal Portofolio & CMS"
            @input="handleTitleInput"
          >
        </div>

        <div class="form-group">
          <label for="p-slug">Slug URL * (huruf kecil, angka, tanda hubung)</label>
          <input
            id="p-slug"
            v-model="form.slug"
            type="text"
            required
            pattern="[a-z0-9\-]+"
            placeholder="contoh-portal-portofolio"
          >
        </div>
      </div>

      <div class="form-group">
        <label for="p-summary">Ringkasan Singkat (Maks. 320 Karakter) *</label>
        <textarea
          id="p-summary"
          v-model="form.summary"
          rows="2"
          maxlength="320"
          required
          placeholder="Ringkasan satu atau dua kalimat yang tampil di kartu proyek..."
        />
      </div>

      <div class="form-grid-4">
        <div class="form-group">
          <label for="p-kind">Jenis / Kategori Label</label>
          <input
            id="p-kind"
            v-model="form.kind"
            type="text"
            placeholder="Website / QA / Mobile"
          >
        </div>

        <div class="form-group">
          <label for="p-role">Peran Pemilik</label>
          <input
            id="p-role"
            v-model="form.role"
            type="text"
            placeholder="Frontend & QA Tester"
          >
        </div>

        <div class="form-group">
          <label for="p-start">Tanggal Mulai</label>
          <input id="p-start" v-model="form.startedOn" type="date" >
        </div>

        <div class="form-group">
          <label for="p-end">Tanggal Selesai (Kosongkan bila Sekarang)</label>
          <input id="p-end" v-model="form.endedOn" type="date" >
        </div>
      </div>
    </fieldset>

    <!-- Bagian 2: Isi & Editor Markdown -->
    <fieldset class="form-section card">
      <legend>2. Deskripsi Lengkap Proyek (Markdown)</legend>

      <div class="md-tab-bar">
        <button
          type="button"
          class="md-tab-btn"
          :class="{ 'md-tab-btn--active': markdownTab === 'write' }"
          @click="markdownTab = 'write'"
        >
          Tulis Markdown
        </button>
        <button
          type="button"
          class="md-tab-btn"
          :class="{ 'md-tab-btn--active': markdownTab === 'preview' }"
          @click="markdownTab = 'preview'"
        >
          Pratinjau HTML
        </button>
      </div>

      <div v-if="markdownTab === 'write'" class="form-group">
        <textarea
          id="p-desc"
          v-model="form.descriptionMd"
          rows="12"
          required
          placeholder="Tuliskan latar belakang, tantangan teknis, arsitektur, dan hasil proyek dalam format Markdown..."
          class="md-textarea"
        />
      </div>

      <div
        v-else
        class="md-preview-box markdown-body"
        v-html="previewHtml"
      />
    </fieldset>

    <!-- Bagian 3: Tautan Eksternal -->
    <fieldset class="form-section card">
      <legend>3. Tautan Demo & Repositori</legend>

      <div class="form-grid-2">
        <div class="form-group">
          <label for="p-demo">Tautan Demo Langsung (Harus diawali https://)</label>
          <input
            id="p-demo"
            v-model="form.demoUrl"
            type="url"
            placeholder="https://..."
          >
        </div>

        <div class="form-group">
          <label for="p-repo">Tautan Repositori Kode (Harus diawali https://)</label>
          <input
            id="p-repo"
            v-model="form.repoUrl"
            type="url"
            placeholder="https://github.com/..."
          >
        </div>
      </div>
    </fieldset>

    <!-- Bagian 4: Keterampilan / Teknologi Terkait -->
    <fieldset class="form-section card">
      <legend>4. Keterampilan & Teknologi yang Digunakan</legend>
      <p class="section-desc">Pilih teknologi yang digunakan dalam proyek ini:</p>

      <div class="skills-selector">
        <button
          v-for="skill in allSkills"
          :key="skill.id"
          type="button"
          class="skill-chip"
          :class="{ 'skill-chip--selected': form.skillIds.includes(skill.id) }"
          @click="toggleSkill(skill.id)"
        >
          {{ skill.name }}
          <span v-if="form.skillIds.includes(skill.id)">✓</span>
        </button>
      </div>
    </fieldset>

    <!-- Bagian 5: Cover & Galeri Media -->
    <fieldset class="form-section card">
      <legend>5. Media & Gambar Sampul</legend>

      <!-- Sampul Utama -->
      <div class="cover-section">
        <h4>Sampul Utama (Cover) *</h4>
        <div class="cover-frame">
          <img
            v-if="selectedCover?.urls?.md || selectedCover?.urls?.original || selectedCover?.urls?.thumb"
            :src="(selectedCover.urls.md || selectedCover.urls.original || selectedCover.urls.thumb) ?? undefined"
            :alt="selectedCover.altText || ''"
          >
          <div v-else class="empty-cover">Belum ada sampul terpilih</div>
        </div>

        <div class="cover-btn-row">
          <button type="button" class="btn" @click="isCoverPickerOpen = true">
            Pilih Sampul dari Pustaka
          </button>
          <button
            v-if="form.coverMediaId"
            type="button"
            class="btn text-btn"
            @click="form.coverMediaId = null; selectedCover = null"
          >
            Hapus Sampul
          </button>
        </div>
      </div>

      <!-- Galeri Media Tambahan -->
      <div class="gallery-section">
        <h4>Galeri Media Tambahan ({{ selectedGallery.length }} aset)</h4>

        <div v-if="selectedGallery.length > 0" class="gallery-reorder-list">
          <div
            v-for="(item, index) in selectedGallery"
            :key="item.id"
            class="gallery-item-row"
          >
            <div class="item-arrows">
              <button
                type="button"
                :disabled="index === 0"
                class="arrow-btn"
                @click="moveGalleryItem(index, 'up')"
              >
                ▲
              </button>
              <button
                type="button"
                :disabled="index === selectedGallery.length - 1"
                class="arrow-btn"
                @click="moveGalleryItem(index, 'down')"
              >
                ▼
              </button>
            </div>

            <div class="item-thumb">
              <img
                v-if="item.urls?.thumb || item.urls?.original || item.posterUrl"
                :src="(item.urls?.thumb || item.urls?.original || item.posterUrl) ?? undefined"
                :alt="item.altText || ''"
              >
              <span v-else>{{ item.kind }}</span>
            </div>

            <div class="item-title">
              <strong>{{ item.title || item.altText || 'Media #' + item.id }}</strong>
              <small>{{ item.kind }}</small>
            </div>

            <button
              type="button"
              class="del-item-btn"
              @click="removeGalleryItem(index)"
            >
              Hapus
            </button>
          </div>
        </div>

        <button type="button" class="btn" @click="isGalleryPickerOpen = true">
          + Tambah Media ke Galeri
        </button>
      </div>
    </fieldset>

    <!-- Bagian 6: Status & Publikasi -->
    <fieldset class="form-section card publish-section">
      <legend>6. Status Publikasi</legend>

      <div class="publish-options">
        <div class="form-group">
          <label for="p-status">Status Proyek</label>
          <select id="p-status" v-model="form.status">
            <option v-for="st in PUBLISH_STATUSES" :key="st" :value="st">
              {{ st === 'published' ? 'Terbit (Published)' : st === 'draft' ? 'Draf (Draft)' : 'Arsip (Archived)' }}
            </option>
          </select>
        </div>

        <label class="checkbox-label">
          <input v-model="form.isFeatured" type="checkbox" >
          <span>Tampilkan sebagai Proyek Unggulan di Beranda</span>
        </label>
      </div>

      <div class="action-buttons-row">
        <NuxtLink to="/admin/projects" class="btn">
          Batal
        </NuxtLink>

        <button
          type="button"
          class="btn"
          :disabled="isSaving"
          @click="handleSubmit('draft')"
        >
          Simpan sebagai Draf
        </button>

        <button
          type="button"
          class="btn y"
          :disabled="isSaving"
          @click="handleSubmit('published')"
        >
          <span v-if="isSaving">Menyimpan...</span>
          <span v-else>Terbitkan Proyek 🚀</span>
        </button>
      </div>
    </fieldset>

    <!-- Modal Pickers -->
    <MediaPickerModal
      :is-open="isCoverPickerOpen"
      allowed-kind="image"
      @close="isCoverPickerOpen = false"
      @select="handleCoverSelected"
    />

    <MediaPickerModal
      :is-open="isGalleryPickerOpen"
      :multiple="true"
      @close="isGalleryPickerOpen = false"
      @select="handleGallerySelected"
    />
  </form>
</template>

<style scoped>
.project-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 900px;
}

.form-section {
  padding: 28px;
}

.form-section legend {
  font-family: var(--serif);
  font-weight: 900;
  font-size: 20px;
  padding: 0 8px;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 18px;
}

.form-grid-4 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 700;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  border: 2px solid var(--ink);
  border-radius: 8px;
  padding: 10px 14px;
  background: var(--cream);
  font-family: var(--sans);
  font-size: 15px;
  color: var(--ink);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  background: var(--paper);
  box-shadow: 3px 3px 0 var(--ink);
}

.md-tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.md-tab-btn {
  padding: 6px 14px;
  border: 2px solid var(--ink);
  border-radius: 6px;
  background: var(--cream);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.md-tab-btn--active {
  background: var(--yellow);
  box-shadow: 2px 2px 0 var(--ink);
}

.md-textarea {
  font-family: ui-monospace, Menlo, Consolas, monospace !important;
  font-size: 14px !important;
  line-height: 1.5;
}

.md-preview-box {
  min-height: 200px;
  padding: 20px;
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: 8px;
}

.section-desc {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 12px;
}

.skills-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip {
  padding: 6px 14px;
  border: 2px solid var(--ink);
  border-radius: 999px;
  background: var(--cream);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.skill-chip--selected {
  background: var(--yellow);
  box-shadow: 2px 2px 0 var(--ink);
}

.cover-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1.5px dashed var(--ink);
}

.cover-frame {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 16 / 9;
  border: 2px solid var(--ink);
  border-radius: 10px;
  overflow: hidden;
  background: var(--cream);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}

.cover-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-cover {
  font-size: 13px;
  color: var(--muted);
}

.cover-btn-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.text-btn {
  background: none;
  border: none;
  box-shadow: none;
  color: var(--red);
  text-decoration: underline;
  padding: 0;
}

.gallery-section h4 {
  margin-bottom: 12px;
}

.gallery-reorder-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.gallery-item-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 14px;
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: 10px;
}

.item-arrows {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.arrow-btn {
  background: var(--paper);
  border: 1px solid var(--ink);
  border-radius: 4px;
  font-size: 10px;
  padding: 2px 4px;
  cursor: pointer;
}

.item-thumb {
  width: 48px;
  height: 48px;
  border: 1.5px solid var(--ink);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--paper);
}

.item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-title {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.item-title small {
  color: var(--muted);
  text-transform: uppercase;
}

.del-item-btn {
  background: #f8d7da;
  color: #721c24;
  border: 1.5px solid var(--ink);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.publish-section {
  background: #eee3d1;
}

.publish-options {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
}

.action-buttons-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.alert-error {
  padding: 14px 18px;
  background: #f8d7da;
  color: #721c24;
  border: 2px solid var(--ink);
  border-radius: 10px;
  font-weight: 700;
}

.error-list {
  margin-top: 8px;
  padding-left: 20px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .form-grid-2,
  .form-grid-4 {
    grid-template-columns: 1fr;
  }
}
</style>
