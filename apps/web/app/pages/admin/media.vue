<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PublicMedia } from '@bunn/shared'
import { useAdminApi } from '~/composables/useAdminApi'
import { useAdminToast } from '~/composables/useAdminToast'
import type { AdminMediaDetail } from '~/composables/useAdminApi'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const adminApi = useAdminApi()
const toast = useAdminToast()

const mediaList = ref<PublicMedia[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedKind = ref('')

// Upload form
const isUploading = ref(false)
const uploadError = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// YouTube form
const ytUrl = ref('')
const ytTitle = ref('')
const isSubmittingYt = ref(false)
const ytError = ref<string | null>(null)
const isYtModalOpen = ref(false)

// Edit & Detail Drawer
const selectedMediaDetail = ref<AdminMediaDetail | null>(null)
const isDetailOpen = ref(false)
const isSavingDetail = ref(false)
const isDeleting = ref(false)
const detailError = ref<string | null>(null)

const editForm = ref({
  title: '',
  altText: '',
  caption: '',
})

const fetchMedia = async () => {
  isLoading.value = true
  try {
    const res = await adminApi.getMedia({
      kind: selectedKind.value || undefined,
      q: searchQuery.value || undefined,
      perPage: 50,
    })
    mediaList.value = res.data || []
  } catch (err) {
    console.error('Gagal mengambil daftar media:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchMedia()
})

// Upload Handlers
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  uploadError.value = null

  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'ico', 'svg', 'mp4', 'webm', 'pdf']
  for (const file of Array.from(target.files)) {
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!allowedExtensions.includes(ext)) {
      uploadError.value = `Format berkas "${file.name}" (.${ext}) tidak didukung. Format yang diizinkan: PNG, JPG/JPEG, WebP, AVIF, ICO, SVG, MP4, WebM, PDF.`
      if (fileInputRef.value) fileInputRef.value.value = ''
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      uploadError.value = `Ukuran berkas "${file.name}" melebihi batas maksimal (maks 50 MB).`
      if (fileInputRef.value) fileInputRef.value.value = ''
      return
    }
  }

  isUploading.value = true

  const formData = new FormData()
  for (const file of Array.from(target.files)) {
    formData.append('files', file)
  }

  try {
    await adminApi.uploadMedia(formData)
    toast.success('Berkas berhasil diunggah ke Pustaka Media!')
    await fetchMedia()
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } }; message?: string }
    uploadError.value =
      errorObj.data?.error?.message || errorObj.message || 'Gagal mengunggah berkas. Format mungkin tidak didukung.'
    toast.error(uploadError.value)
  } finally {
    isUploading.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

// YouTube Submit
const handleYouTubeSubmit = async () => {
  if (!ytUrl.value.trim()) return

  isSubmittingYt.value = true
  ytError.value = null

  try {
    await adminApi.createYouTubeMedia({
      url: ytUrl.value.trim(),
      title: ytTitle.value.trim() || undefined,
    })
    ytUrl.value = ''
    ytTitle.value = ''
    isYtModalOpen.value = false
    toast.success('Media YouTube berhasil ditambahkan!')
    await fetchMedia()
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    ytError.value =
      errorObj.data?.error?.message || 'Gagal mendaftarkan URL YouTube.'
    toast.error(ytError.value)
  } finally {
    isSubmittingYt.value = false
  }
}

// Buka Detail / Edit Media
const openMediaDetail = async (mediaId: number) => {
  try {
    const detail = await adminApi.getMediaDetail(mediaId)
    selectedMediaDetail.value = detail
    editForm.value = {
      title: detail.title || '',
      altText: detail.altText || '',
      caption: detail.caption || '',
    }
    isDetailOpen.value = true
    detailError.value = null
  } catch (err) {
    console.error('Gagal memuat detail media:', err)
  }
}

// Simpan Perubahan Metadata
const handleSaveMetadata = async () => {
  if (!selectedMediaDetail.value) return
  isSavingDetail.value = true
  detailError.value = null

  try {
    await adminApi.updateMedia(selectedMediaDetail.value.id, {
      title: editForm.value.title || null,
      altText: editForm.value.altText || null,
      caption: editForm.value.caption || null,
    })
    isDetailOpen.value = false
    toast.success('Metadata media berhasil disimpan.')
    await fetchMedia()
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    detailError.value =
      errorObj.data?.error?.message || 'Gagal menyimpan perubahan metadata.'
    toast.error(detailError.value)
  } finally {
    isSavingDetail.value = false
  }
}

// Hapus Media
const handleDeleteMedia = async () => {
  if (!selectedMediaDetail.value) return

  const usageCount = selectedMediaDetail.value.usages?.length || 0
  let confirmMsg = 'Apakah Anda yakin ingin menghapus media ini secara permanen?'
  if (usageCount > 0) {
    confirmMsg = `PERINGATAN: Media ini sedang digunakan di ${usageCount} tempat. Jika dihapus, tautan media pada entitas tersebut akan diatur menjadi kosong. Lanjutkan penghapusan?`
  }

  if (!confirm(confirmMsg)) return

  isDeleting.value = true
  try {
    await adminApi.deleteMedia(selectedMediaDetail.value.id)
    isDetailOpen.value = false
    toast.success('Media berhasil dihapus.')
    await fetchMedia()
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    toast.error(errorObj.data?.error?.message || 'Gagal menghapus media.')
  } finally {
    isDeleting.value = false
  }
}

useSeoMeta({
  title: 'Pustaka Media — bunn.my.id',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="media-library-page">
    <div class="page-header">
      <div>
        <span class="label">Pustaka Aset</span>
        <h1>Pustaka <em>Media.</em></h1>
      </div>

      <div class="header-actions">
        <button
          type="button"
          class="btn"
          @click="isYtModalOpen = true"
        >
          + Tambah YouTube
        </button>

        <label class="btn y upload-label">
          <input
            ref="fileInputRef"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif,image/x-icon,image/vnd.microsoft.icon,image/svg+xml,.ico,.svg,video/mp4,video/webm,application/pdf"
            :disabled="isUploading"
            class="hidden-file-input"
            @change="handleFileUpload"
          >
          <span v-if="isUploading">Mengunggah...</span>
          <span v-else>↑ Unggah Berkas</span>
        </label>
      </div>
    </div>

    <!-- Alert error upload -->
    <div v-if="uploadError" class="alert-error" role="alert">
      {{ uploadError }}
    </div>

    <!-- Filter & Pencarian -->
    <div class="filter-toolbar card">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari berdasarkan judul atau nama berkas..."
          @input="fetchMedia"
        >
      </div>

      <div class="kind-filters">
        <select v-model="selectedKind" @change="fetchMedia">
          <option value="">Semua Jenis Media</option>
          <option value="image">Gambar Saja</option>
          <option value="video">Video Saja</option>
          <option value="youtube">YouTube Saja</option>
          <option value="document">Dokumen PDF Saja</option>
        </select>
      </div>
    </div>

    <!-- Grid Aset Media -->
    <div v-if="isLoading" class="loading-state">
      <p>Memuat aset media...</p>
    </div>

    <div v-else-if="mediaList.length > 0" class="media-grid">
      <div
        v-for="item in mediaList"
        :key="item.id"
        class="media-card card"
        role="button"
        tabindex="0"
        @click="openMediaDetail(item.id)"
        @keydown.enter="openMediaDetail(item.id)"
      >
        <div class="media-preview-box">
          <img
            v-if="item.urls?.thumb || item.urls?.original || item.posterUrl"
            :src="(item.urls?.thumb || item.urls?.original || item.posterUrl) ?? undefined"
            :alt="item.altText || ''"
          >
          <div v-else-if="item.kind === 'youtube'" class="placeholder-media">
            YouTube
          </div>
          <div v-else-if="item.kind === 'document'" class="placeholder-media">
            Dokumen PDF
          </div>
          <div v-else-if="item.kind === 'video'" class="placeholder-media">
            Video
          </div>
          <div v-else class="placeholder-media">
            Gambar
          </div>

          <span class="kind-badge">{{ item.kind }}</span>

          <span
            v-if="item.kind === 'image' && (!item.altText || item.altText.trim() === '')"
            class="missing-alt-badge"
            title="Alt teks belum diisi"
          >
            ! Tanpa Alt
          </span>
        </div>

        <div class="media-card-info">
          <h4 class="media-card-title">
            {{ item.title || item.altText || 'Media #' + item.id }}
          </h4>
        </div>
      </div>
    </div>

    <div v-else class="empty-state card">
      <h3>Belum ada aset media</h3>
      <p>Unggah foto, video portofolio, atau tambahkan tautan video YouTube.</p>
    </div>

    <!-- Modal Tambah YouTube -->
    <Teleport to="body">
      <div
        v-if="isYtModalOpen"
        class="modal-backdrop"
        @click.self="isYtModalOpen = false"
      >
        <div class="modal-card">
          <div class="modal-header">
            <h3>Daftarkan Tautan YouTube</h3>
            <button
              type="button"
              class="close-btn"
              @click="isYtModalOpen = false"
            >
              ✕
            </button>
          </div>

          <form class="modal-body" @submit.prevent="handleYouTubeSubmit">
            <div class="form-group">
              <label for="modal-yt-url">URL / Tautan YouTube *</label>
              <input
                id="modal-yt-url"
                v-model="ytUrl"
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=... atau youtu.be/..."
              >
            </div>

            <div class="form-group">
              <label for="modal-yt-title">Judul Video (opsional)</label>
              <input
                id="modal-yt-title"
                v-model="ytTitle"
                type="text"
                placeholder="Judul untuk pembaca layar"
              >
            </div>

            <div v-if="ytError" class="alert-error">
              {{ ytError }}
            </div>

            <div class="modal-footer-actions">
              <button
                type="button"
                class="btn"
                @click="isYtModalOpen = false"
              >
                Batal
              </button>
              <button
                type="submit"
                class="btn y"
                :disabled="isSubmittingYt"
              >
                <span v-if="isSubmittingYt">Mendaftarkan...</span>
                <span v-else>Simpan Tautan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Drawer / Modal Detail & Edit Media -->
    <Teleport to="body">
      <div
        v-if="isDetailOpen && selectedMediaDetail"
        class="modal-backdrop"
        @click.self="isDetailOpen = false"
      >
        <div class="detail-modal-card">
          <div class="modal-header">
            <h3>Detail Aset Media #{{ selectedMediaDetail.id }}</h3>
            <button
              type="button"
              class="close-btn"
              @click="isDetailOpen = false"
            >
              ✕
            </button>
          </div>

          <div class="detail-body">
            <!-- Pratinjau Kiri -->
            <div class="detail-preview-col">
              <div class="detail-preview-frame">
                <img
                  v-if="selectedMediaDetail.urls?.md || selectedMediaDetail.urls?.original || selectedMediaDetail.posterUrl"
                  :src="(selectedMediaDetail.urls?.md || selectedMediaDetail.urls?.original || selectedMediaDetail.posterUrl) ?? undefined"
                  :alt="selectedMediaDetail.altText || ''"
                >
                <div v-else class="placeholder-media">
                  {{ selectedMediaDetail.kind }}
                </div>
              </div>

              <div class="meta-specs">
                <p>Jenis: <strong>{{ selectedMediaDetail.kind }}</strong></p>
                <p v-if="selectedMediaDetail.mimeType">MIME: <strong>{{ selectedMediaDetail.mimeType }}</strong></p>
                <p v-if="selectedMediaDetail.width && selectedMediaDetail.height">
                  Dimensi: <strong>{{ selectedMediaDetail.width }} × {{ selectedMediaDetail.height }} px</strong>
                </p>
                <p v-if="selectedMediaDetail.sizeBytes">
                  Ukuran: <strong>{{ (selectedMediaDetail.sizeBytes / 1024 / 1024).toFixed(2) }} MB</strong>
                </p>
              </div>

              <!-- Daftar Tempat Digunakan (Usages) -->
              <div class="usages-section">
                <h4>Digunakan di ({{ selectedMediaDetail.usages?.length || 0 }} tempat):</h4>
                <ul v-if="selectedMediaDetail.usages && selectedMediaDetail.usages.length > 0">
                  <li v-for="u in selectedMediaDetail.usages" :key="u.entity + u.id">
                    <strong>{{ u.entity }}</strong>: {{ u.title }}
                  </li>
                </ul>
                <p v-else class="no-usages">Belum digunakan di halaman mana pun.</p>
              </div>
            </div>

            <!-- Form Edit Kanan -->
            <div class="detail-form-col">
              <form @submit.prevent="handleSaveMetadata">
                <div class="form-group">
                  <label for="edit-title">Judul Media</label>
                  <input
                    id="edit-title"
                    v-model="editForm.title"
                    type="text"
                    placeholder="Judul untuk identifikasi"
                  >
                </div>

                <div class="form-group">
                  <label for="edit-alt">
                    Alt Teks (Wajib untuk gambar terbit)
                    <span v-if="!editForm.altText" class="req">*</span>
                  </label>
                  <textarea
                    id="edit-alt"
                    v-model="editForm.altText"
                    rows="3"
                    placeholder="Deskripsi visual gambar untuk aksesibilitas..."
                  />
                </div>

                <div class="form-group">
                  <label for="edit-caption">Keterangan / Kepsen (Caption)</label>
                  <input
                    id="edit-caption"
                    v-model="editForm.caption"
                    type="text"
                    placeholder="Teks keterangan yang tampil di lightbox..."
                  >
                </div>

                <div v-if="detailError" class="alert-error">
                  {{ detailError }}
                </div>

                <div class="detail-actions">
                  <button
                    type="button"
                    class="btn delete-btn"
                    :disabled="isDeleting"
                    @click="handleDeleteMedia"
                  >
                    <span v-if="isDeleting">Menghapus...</span>
                    <span v-else>Hapus Aset</span>
                  </button>

                  <button
                    type="submit"
                    class="btn y"
                    :disabled="isSavingDetail"
                  >
                    <span v-if="isSavingDetail">Menyimpan...</span>
                    <span v-else>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
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

.header-actions {
  display: flex;
  gap: 12px;
}

.upload-label {
  cursor: pointer;
}

.hidden-file-input {
  display: none;
}

.filter-toolbar {
  padding: 16px 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 28px;
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

.kind-filters select {
  border: 2px solid var(--ink);
  border-radius: 8px;
  padding: 10px 14px;
  background: var(--cream);
  font-family: var(--sans);
  font-weight: 700;
  font-size: 15px;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.media-card {
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.media-card:hover {
  transform: translate(2px, 2px);
}

.media-preview-box {
  width: 100%;
  aspect-ratio: 4 / 3;
  position: relative;
  background: var(--cream);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-media {
  font-family: var(--serif);
  font-weight: 700;
  color: var(--muted);
}

.kind-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--ink);
  color: var(--cream);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.missing-alt-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--red);
  color: var(--cream);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.media-card-info {
  padding: 10px 12px;
}

.media-card-title {
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  text-align: center;
  padding: 48px;
}

/* Modals */
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
  max-width: 520px;
  width: 100%;
  background: var(--paper);
  border: 3px solid var(--ink);
  border-radius: 16px;
  box-shadow: 8px 8px 0 var(--ink);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 2px solid var(--ink);
  background: var(--cream);
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}

.alert-error {
  padding: 10px 14px;
  background: #f8d7da;
  color: #721c24;
  border: 2px solid var(--ink);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 16px;
}

/* Detail Modal */
.detail-modal-card {
  max-width: 860px;
  width: 100%;
  max-height: 90vh;
  background: var(--paper);
  border: 3px solid var(--ink);
  border-radius: 16px;
  box-shadow: 10px 10px 0 var(--ink);
  overflow-y: auto;
}

.detail-body {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 28px;
  padding: 24px;
}

.detail-preview-frame {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 2px solid var(--ink);
  border-radius: 10px;
  overflow: hidden;
  background: var(--cream);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.detail-preview-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meta-specs {
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.usages-section {
  padding-top: 16px;
  border-top: 1.5px dashed var(--ink);
}

.usages-section h4 {
  font-size: 14px;
  margin-bottom: 8px;
}

.usages-section ul {
  padding-left: 20px;
  font-size: 13px;
}

.no-usages {
  font-size: 13px;
  color: var(--muted);
}

.detail-form-col form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.req {
  color: var(--red);
}

.form-group input,
.form-group textarea {
  border: 2px solid var(--ink);
  border-radius: 8px;
  padding: 10px 14px;
  background: var(--cream);
  font-family: var(--sans);
  font-size: 14px;
}

.detail-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid var(--ink);
}

.delete-btn {
  background: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .detail-body {
    grid-template-columns: 1fr;
  }
}
</style>
