<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { PublicMedia, MediaKind } from '@bunn/shared'
import { useAdminApi } from '~/composables/useAdminApi'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    multiple?: boolean
    allowedKind?: MediaKind
  }>(),
  {
    multiple: false,
    allowedKind: undefined,
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', media: PublicMedia | PublicMedia[]): void
}>()

const adminApi = useAdminApi()

const activeTab = ref<'library' | 'upload' | 'youtube'>('library')
const mediaList = ref<PublicMedia[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const selectedKind = ref<string>(props.allowedKind || '')
const selectedItems = ref<PublicMedia[]>([])

// Upload form
const isUploading = ref(false)
const uploadError = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// YouTube form
const ytUrl = ref('')
const ytTitle = ref('')
const isSubmittingYt = ref(false)
const ytError = ref<string | null>(null)

const fetchLibrary = async () => {
  isLoading.value = true
  try {
    const res = await adminApi.getMedia({
      kind: selectedKind.value || undefined,
      q: searchQuery.value || undefined,
      perPage: 30,
    })
    mediaList.value = res.data
  } catch (err) {
    console.error('Gagal mengambil media pustaka:', err)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      selectedItems.value = []
      activeTab.value = 'library'
      fetchLibrary()
    }
  }
)

const toggleSelect = (item: PublicMedia) => {
  if (!props.multiple) {
    selectedItems.value = [item]
    return
  }

  const idx = selectedItems.value.findIndex((m) => m.id === item.id)
  if (idx >= 0) {
    selectedItems.value.splice(idx, 1)
  } else {
    selectedItems.value.push(item)
  }
}

const isSelected = (id: number) => {
  return selectedItems.value.some((m) => m.id === id)
}

const handleConfirmSelection = () => {
  if (props.multiple) {
    emit('select', selectedItems.value)
  } else {
    if (selectedItems.value[0]) {
      emit('select', selectedItems.value[0])
    }
  }
  emit('close')
}

// Upload Handler
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  isUploading.value = true
  uploadError.value = null

  const formData = new FormData()
  for (const file of Array.from(target.files)) {
    formData.append('files', file)
  }

  try {
    const res = await adminApi.uploadMedia(formData)
    await fetchLibrary()
    activeTab.value = 'library'
    if (res[0]) {
      toggleSelect(res[0])
    }
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    uploadError.value =
      errorObj.data?.error?.message || 'Gagal mengunggah berkas.'
  } finally {
    isUploading.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

// YouTube Handler
const handleYouTubeSubmit = async () => {
  if (!ytUrl.value.trim()) return

  isSubmittingYt.value = true
  ytError.value = null

  try {
    const created = await adminApi.createYouTubeMedia({
      url: ytUrl.value.trim(),
      title: ytTitle.value.trim() || undefined,
    })
    ytUrl.value = ''
    ytTitle.value = ''
    await fetchLibrary()
    activeTab.value = 'library'
    toggleSelect(created)
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    ytError.value =
      errorObj.data?.error?.message || 'Gagal mendaftarkan URL YouTube.'
  } finally {
    isSubmittingYt.value = false
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (props.isOpen && e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Pemilih Media"
      @click.self="emit('close')"
    >
      <div class="modal-card">
        <div class="modal-header">
          <h2>Pilih Media</h2>
          <button
            type="button"
            class="close-btn"
            aria-label="Tutup"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>

        <!-- Tab Navigasi -->
        <div class="tab-bar">
          <button
            type="button"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'library' }"
            @click="activeTab = 'library'"
          >
            Pustaka Media
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'upload' }"
            @click="activeTab = 'upload'"
          >
            Unggah Berkas Baru
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'youtube' }"
            @click="activeTab = 'youtube'"
          >
            + Link YouTube
          </button>
        </div>

        <!-- Isi Tab 1: Pustaka -->
        <div v-if="activeTab === 'library'" class="tab-content library-tab">
          <div class="filter-bar">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari judul atau nama berkas..."
              class="search-input"
              @input="fetchLibrary"
            >

            <select
              v-if="!allowedKind"
              v-model="selectedKind"
              class="kind-select"
              @change="fetchLibrary"
            >
              <option value="">Semua Jenis</option>
              <option value="image">Gambar</option>
              <option value="video">Video</option>
              <option value="youtube">YouTube</option>
              <option value="document">Dokumen (PDF)</option>
            </select>
          </div>

          <div v-if="isLoading" class="loading-state">
            <p>Memuat media...</p>
          </div>

          <div
            v-else-if="mediaList.length > 0"
            class="media-picker-grid"
          >
            <div
              v-for="item in mediaList"
              :key="item.id"
              class="picker-item"
              :class="{ 'picker-item--selected': isSelected(item.id) }"
              @click="toggleSelect(item)"
            >
              <div class="thumb-frame">
                <img
                  v-if="item.urls?.thumb || item.urls?.original || item.posterUrl"
                  :src="(item.urls?.thumb || item.urls?.original || item.posterUrl) ?? undefined"
                  :alt="item.altText || ''"
                >
                <div v-else-if="item.kind === 'youtube'" class="placeholder-box">
                  ▶ YouTube
                </div>
                <div v-else-if="item.kind === 'document'" class="placeholder-box">
                  📄 PDF
                </div>
                <div v-else-if="item.kind === 'video'" class="placeholder-box">
                  🎬 Video
                </div>
                <div v-else class="placeholder-box">
                  🖼️ Gambar
                </div>

                <div v-if="isSelected(item.id)" class="selected-badge">
                  ✓
                </div>
              </div>

              <div class="item-caption">
                <span class="badge">{{ item.kind }}</span>
                <span class="title-text">{{ item.title || item.altText || 'Media #' + item.id }}</span>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <p>Tidak ada media yang ditemukan.</p>
          </div>
        </div>

        <!-- Isi Tab 2: Unggah -->
        <div v-else-if="activeTab === 'upload'" class="tab-content upload-tab">
          <div class="drop-zone">
            <input
              ref="fileInputRef"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,application/pdf"
              :disabled="isUploading"
              @change="handleFileUpload"
            >
            <p>Pilih berkas dari perangkat Anda</p>
            <small>Gambar (maks 10 MB), Video (maks 50 MB), PDF (maks 10 MB)</small>
          </div>

          <div v-if="isUploading" class="status-box">
            Mengunggah dan memproses berkas (membuat varian WebP)...
          </div>

          <div v-if="uploadError" class="alert-error">
            ⚠ {{ uploadError }}
          </div>
        </div>

        <!-- Isi Tab 3: YouTube -->
        <div v-else-if="activeTab === 'youtube'" class="tab-content yt-tab">
          <form class="yt-form" @submit.prevent="handleYouTubeSubmit">
            <div class="form-group">
              <label for="yt-url">Tautan / URL YouTube *</label>
              <input
                id="yt-url"
                v-model="ytUrl"
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=... atau youtu.be/..."
              >
            </div>

            <div class="form-group">
              <label for="yt-title">Judul Video (opsional)</label>
              <input
                id="yt-title"
                v-model="ytTitle"
                type="text"
                placeholder="Judul video untuk pembaca layar"
              >
            </div>

            <div v-if="ytError" class="alert-error">
              ⚠ {{ ytError }}
            </div>

            <button type="submit" class="btn y" :disabled="isSubmittingYt">
              <span v-if="isSubmittingYt">Mendaftarkan...</span>
              <span v-else>Daftarkan Video YouTube</span>
            </button>
          </form>
        </div>

        <!-- Footer Modal -->
        <div class="modal-footer">
          <span class="selected-count">
            Terpilih: <strong>{{ selectedItems.length }}</strong> media
          </span>

          <div class="footer-btns">
            <button
              type="button"
              class="btn"
              @click="emit('close')"
            >
              Batal
            </button>
            <button
              type="button"
              class="btn y"
              :disabled="selectedItems.length === 0"
              @click="handleConfirmSelection"
            >
              Gunakan Media Terpilih
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
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
  max-width: 860px;
  width: 100%;
  max-height: 85vh;
  background: var(--paper);
  border: 3px solid var(--ink);
  border-radius: 16px;
  box-shadow: 8px 8px 0 var(--ink);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 2px solid var(--ink);
  background: var(--cream);
}

.modal-header h2 {
  font-size: 22px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}

.tab-bar {
  display: flex;
  gap: 8px;
  padding: 12px 24px;
  border-bottom: 2px solid var(--ink);
  background: #eee3d1;
}

.tab-btn {
  padding: 8px 16px;
  border: 2px solid var(--ink);
  border-radius: 8px;
  background: var(--cream);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

.tab-btn--active {
  background: var(--yellow);
  box-shadow: 2px 2px 0 var(--ink);
}

.tab-content {
  flex-grow: 1;
  padding: 20px 24px;
  overflow-y: auto;
  min-height: 320px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  flex-grow: 1;
  border: 2px solid var(--ink);
  border-radius: 8px;
  padding: 8px 12px;
  background: var(--cream);
  font-family: var(--sans);
  font-size: 14px;
}

.kind-select {
  border: 2px solid var(--ink);
  border-radius: 8px;
  padding: 8px 12px;
  background: var(--cream);
  font-family: var(--sans);
  font-weight: 700;
  font-size: 14px;
}

.media-picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 14px;
}

.picker-item {
  border: 2px solid var(--ink);
  border-radius: 10px;
  overflow: hidden;
  background: var(--cream);
  cursor: pointer;
  transition: transform 0.1s ease;
}

.picker-item:hover {
  transform: translate(2px, 2px);
}

.picker-item--selected {
  outline: 3px solid var(--red);
  background: var(--yellow);
}

.thumb-frame {
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  background: var(--paper);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.thumb-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-box {
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
}

.selected-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--red);
  color: var(--cream);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 900;
  border: 1.5px solid var(--ink);
}

.item-caption {
  padding: 6px 8px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--muted);
}

.title-text {
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drop-zone {
  border: 2.5px dashed var(--ink);
  border-radius: 14px;
  padding: 48px;
  text-align: center;
  background: var(--cream);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.drop-zone input {
  font-size: 14px;
  font-weight: 700;
}

.yt-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
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

.form-group input {
  border: 2px solid var(--ink);
  border-radius: 8px;
  padding: 10px 14px;
  background: var(--cream);
  font-family: var(--sans);
  font-size: 14px;
}

.status-box {
  margin-top: 16px;
  padding: 12px;
  background: #d4edda;
  border: 2px solid var(--ink);
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
}

.alert-error {
  margin-top: 14px;
  padding: 10px 14px;
  background: #f8d7da;
  color: #721c24;
  border: 2px solid var(--ink);
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  border-top: 2px solid var(--ink);
  background: var(--cream);
}

.footer-btns {
  display: flex;
  gap: 10px;
}
</style>
