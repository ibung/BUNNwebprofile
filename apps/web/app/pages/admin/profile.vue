<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { SOCIAL_PLATFORMS } from '@bunn/shared'
import type { PublicMedia } from '@bunn/shared'
import { useAdminApi } from '~/composables/useAdminApi'
import type {
  AdminProfileData,
  AdminProfileFact,
  AdminSocialLink,
  AdminHighlight,
} from '~/composables/useAdminApi'
import { useAdminToast } from '~/composables/useAdminToast'
import MediaPickerModal from '~/components/admin/MediaPickerModal.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const adminApi = useAdminApi()
const toast = useAdminToast()

const activeTab = ref<'main' | 'facts' | 'socials' | 'highlights'>('main')
const isLoading = ref(true)

// Profil Form
const profileForm = ref<Partial<AdminProfileData>>({})
const selectedAvatar = ref<PublicMedia | null>(null)
const selectedResume = ref<PublicMedia | null>(null)
const isSavingProfile = ref(false)

// Media Picker Modal State
const isMediaPickerOpen = ref(false)
const mediaPickerTarget = ref<'avatar' | 'resume' | 'newSocial' | 'editSocial'>('avatar')
const targetSocialId = ref<number | null>(null)
const newSocialMedia = ref<PublicMedia | null>(null)

// Fakta State
const facts = ref<AdminProfileFact[]>([])
const newFact = ref({ label: '', value: '' })

// Sosial State
const socials = ref<AdminSocialLink[]>([])
const newSocial = ref<{
  platform: (typeof SOCIAL_PLATFORMS)[number]
  label: string
  url: string
  mediaId?: number | null
}>({
  platform: 'github',
  label: '',
  url: '',
  mediaId: null,
})

// Highlights State
const highlights = ref<AdminHighlight[]>([])
const newHighlight = ref({
  placement: 'about' as 'about' | 'skills',
  value: '',
  label: '',
  note: '',
})

const loadAllData = async () => {
  isLoading.value = true
  try {
    const [prof, f, s, h] = await Promise.all([
      adminApi.getProfile(),
      adminApi.getProfileFacts(),
      adminApi.getSocialLinks(),
      adminApi.getHighlights(),
    ])

    profileForm.value = prof
    selectedAvatar.value = prof.avatar || null
    selectedResume.value = prof.resume || null

    facts.value = f
    socials.value = s
    highlights.value = h
  } catch (err) {
    console.error('Gagal memuat profil:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadAllData()
})

const showMessage = (type: 'success' | 'error', text: string) => {
  if (type === 'success') {
    toast.success(text)
  } else {
    toast.error(text)
  }
}

// Profil Submit
const handleSaveProfile = async () => {
  isSavingProfile.value = true

  try {
    const updated = await adminApi.updateProfile({
      fullName: profileForm.value.fullName,
      displayName: profileForm.value.displayName,
      heroPrefix: profileForm.value.heroPrefix,
      headline: profileForm.value.headline,
      tagline: profileForm.value.tagline,
      heroIntroMd: profileForm.value.heroIntroMd,
      aboutMd: profileForm.value.aboutMd,
      location: profileForm.value.location,
      emailPublic: profileForm.value.emailPublic,
      phonePublic: profileForm.value.phonePublic,
      availabilityText: profileForm.value.availabilityText,
      avatarMediaId: profileForm.value.avatarMediaId,
      resumeMediaId: profileForm.value.resumeMediaId,
    })
    profileForm.value = updated
    showMessage('success', 'Profil berhasil disimpan.')
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    showMessage('error', errorObj.data?.error?.message || 'Gagal menyimpan profil.')
  } finally {
    isSavingProfile.value = false
  }
}

// Media Picker
const openAvatarPicker = () => {
  mediaPickerTarget.value = 'avatar'
  isMediaPickerOpen.value = true
}

const openResumePicker = () => {
  mediaPickerTarget.value = 'resume'
  isMediaPickerOpen.value = true
}

const openSocialIconPicker = (socialId?: number) => {
  if (socialId) {
    mediaPickerTarget.value = 'editSocial'
    targetSocialId.value = socialId
  } else {
    mediaPickerTarget.value = 'newSocial'
  }
  isMediaPickerOpen.value = true
}

const handleMediaSelected = async (media: PublicMedia | PublicMedia[]) => {
  const item = Array.isArray(media) ? media[0] : media
  if (!item) return

  if (mediaPickerTarget.value === 'avatar') {
    selectedAvatar.value = item
    profileForm.value.avatarMediaId = item.id
  } else if (mediaPickerTarget.value === 'resume') {
    selectedResume.value = item
    profileForm.value.resumeMediaId = item.id
  } else if (mediaPickerTarget.value === 'newSocial') {
    newSocialMedia.value = item
    newSocial.value.mediaId = item.id
  } else if (mediaPickerTarget.value === 'editSocial' && targetSocialId.value) {
    try {
      const updated = await adminApi.updateSocialLink(targetSocialId.value, { mediaId: item.id })
      const idx = socials.value.findIndex((s) => s.id === targetSocialId.value)
      if (idx !== -1) {
        socials.value[idx] = updated
      }
      showMessage('success', 'Ikon tautan sosial berhasil diperbarui.')
    } catch (err) {
      console.error(err)
      showMessage('error', 'Gagal memperbarui ikon.')
    }
  }
}

const handleRemoveSocialIcon = async (social: AdminSocialLink) => {
  try {
    const updated = await adminApi.updateSocialLink(social.id, { mediaId: null })
    const idx = socials.value.findIndex((s) => s.id === social.id)
    if (idx !== -1) {
      socials.value[idx] = updated
    }
    showMessage('success', 'Ikon tautan sosial berhasil dihapus.')
  } catch (err) {
    console.error(err)
    showMessage('error', 'Gagal menghapus ikon.')
  }
}

// Fakta Actions
const handleAddFact = async () => {
  if (!newFact.value.label.trim() || !newFact.value.value.trim()) return
  try {
    const created = await adminApi.createProfileFact({
      label: newFact.value.label.trim(),
      value: newFact.value.value.trim(),
      isVisible: true,
    })
    facts.value.push(created)
    newFact.value = { label: '', value: '' }
    showMessage('success', 'Fakta profil berhasil ditambahkan.')
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    showMessage('error', errorObj.data?.error?.message || 'Gagal menambahkan fakta.')
  }
}

const handleDeleteFact = async (id: number) => {
  if (!confirm('Hapus fakta ini?')) return
  try {
    await adminApi.deleteProfileFact(id)
    facts.value = facts.value.filter((f) => f.id !== id)
    showMessage('success', 'Fakta berhasil dihapus.')
  } catch (err) {
    console.error(err)
  }
}

const moveFact = async (index: number, direction: 'up' | 'down') => {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= facts.value.length) return

  const item = facts.value.splice(index, 1)[0]
  if (item) {
    facts.value.splice(targetIndex, 0, item)
    await adminApi.reorderProfileFacts(facts.value.map((f) => f.id))
  }
}

// Sosial Actions
const handleAddSocial = async () => {
  if (!newSocial.value.label.trim() || !newSocial.value.url.trim()) return
  try {
    const created = await adminApi.createSocialLink({
      platform: newSocial.value.platform,
      label: newSocial.value.label.trim(),
      url: newSocial.value.url.trim(),
      mediaId: newSocial.value.mediaId || null,
      isVisible: true,
    })
    socials.value.push(created)
    newSocial.value = {
      platform: 'github',
      label: '',
      url: '',
      mediaId: null,
    }
    newSocialMedia.value = null
    showMessage('success', 'Tautan sosial berhasil ditambahkan.')
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    showMessage('error', errorObj.data?.error?.message || 'Gagal menambahkan tautan sosial.')
  }
}

const handleDeleteSocial = async (id: number) => {
  if (!confirm('Hapus tautan sosial ini?')) return
  try {
    await adminApi.deleteSocialLink(id)
    socials.value = socials.value.filter((s) => s.id !== id)
    showMessage('success', 'Tautan sosial berhasil dihapus.')
  } catch (err) {
    console.error(err)
  }
}

const moveSocial = async (index: number, direction: 'up' | 'down') => {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= socials.value.length) return

  const item = socials.value.splice(index, 1)[0]
  if (item) {
    socials.value.splice(targetIndex, 0, item)
    await adminApi.reorderSocialLinks(socials.value.map((s) => s.id))
  }
}

// Highlights Actions
const handleAddHighlight = async () => {
  if (!newHighlight.value.value.trim() || !newHighlight.value.label.trim()) return
  try {
    const created = await adminApi.createHighlight({
      placement: newHighlight.value.placement,
      value: newHighlight.value.value.trim(),
      label: newHighlight.value.label.trim(),
      note: newHighlight.value.note.trim() || null,
      isVisible: true,
    })
    highlights.value.push(created)
    newHighlight.value = {
      placement: 'about',
      value: '',
      label: '',
      note: '',
    }
    showMessage('success', 'Sorotan angka berhasil ditambahkan.')
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    showMessage('error', errorObj.data?.error?.message || 'Gagal menambahkan sorotan.')
  }
}

const handleDeleteHighlight = async (id: number) => {
  if (!confirm('Hapus sorotan ini?')) return
  try {
    await adminApi.deleteHighlight(id)
    highlights.value = highlights.value.filter((h) => h.id !== id)
    showMessage('success', 'Sorotan berhasil dihapus.')
  } catch (err) {
    console.error(err)
  }
}

const moveHighlight = async (index: number, direction: 'up' | 'down') => {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= highlights.value.length) return

  const item = highlights.value.splice(index, 1)[0]
  if (item) {
    highlights.value.splice(targetIndex, 0, item)
    await adminApi.reorderHighlights(highlights.value.map((h) => h.id))
  }
}

useSeoMeta({
  title: 'Kelola Profil — bunn.my.id',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="profile-management-page">
    <div class="page-header">
      <div>
        <span class="label">Identitas & Narasi</span>
        <h1>Kelola <em>Profil.</em></h1>
      </div>
    </div>

    <!-- Tab Bar -->
    <div class="admin-tab-bar">
      <button
        type="button"
        class="admin-tab-btn"
        :class="{ 'admin-tab-btn--active': activeTab === 'main' }"
        @click="activeTab = 'main'"
      >
        Profil Utama
      </button>
      <button
        type="button"
        class="admin-tab-btn"
        :class="{ 'admin-tab-btn--active': activeTab === 'facts' }"
        @click="activeTab = 'facts'"
      >
        Fakta Profil ({{ facts.length }})
      </button>
      <button
        type="button"
        class="admin-tab-btn"
        :class="{ 'admin-tab-btn--active': activeTab === 'socials' }"
        @click="activeTab = 'socials'"
      >
        Tautan Sosial ({{ socials.length }})
      </button>
      <button
        type="button"
        class="admin-tab-btn"
        :class="{ 'admin-tab-btn--active': activeTab === 'highlights' }"
        @click="activeTab = 'highlights'"
      >
        Sorotan Angka ({{ highlights.length }})
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
      <p>Memuat profil...</p>
    </div>

    <div v-else class="tab-body-container">
      <!-- TAB 1: PROFIL UTAMA -->
      <section v-if="activeTab === 'main'" class="card main-profile-card">
        <form @submit.prevent="handleSaveProfile">
          <div class="form-grid-3">
            <div class="form-group">
              <label for="fullName">Nama Lengkap *</label>
              <input id="fullName" v-model="profileForm.fullName" type="text" required>
            </div>

            <div class="form-group">
              <label for="displayName">Nama Tampilan Hero (Display Name) *</label>
              <input id="displayName" v-model="profileForm.displayName" type="text" required>
            </div>

            <div class="form-group">
              <label for="heroPrefix">Awalan Sapaan Hero (Contoh: Halo, saya)</label>
              <input id="heroPrefix" v-model="profileForm.heroPrefix" type="text" placeholder="Halo, saya">
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="headline">Headline Singkat</label>
              <input id="headline" v-model="profileForm.headline" type="text">
            </div>

            <div class="form-group">
              <label for="tagline">Tagline Tambahan (Judul Tentang Saya)</label>
              <input id="tagline" v-model="profileForm.tagline" type="text">
            </div>
          </div>

          <div class="form-group">
            <label for="heroIntroMd">Paragraf Pembuka Hero (Markdown)</label>
            <textarea id="heroIntroMd" v-model="profileForm.heroIntroMd" rows="3" />
          </div>

          <div class="form-group">
            <label for="aboutMd">Cerita Tentang Saya (Markdown)</label>
            <textarea id="aboutMd" v-model="profileForm.aboutMd" rows="6" />
          </div>

          <div class="form-grid-3">
            <div class="form-group">
              <label for="location">Lokasi</label>
              <input id="location" v-model="profileForm.location" type="text">
            </div>

            <div class="form-group">
              <label for="emailPublic">Email Publik</label>
              <input id="emailPublic" v-model="profileForm.emailPublic" type="email">
            </div>

            <div class="form-group">
              <label for="phonePublic">Nomor Kontak Publik</label>
              <input id="phonePublic" v-model="profileForm.phonePublic" type="text">
            </div>
          </div>

          <div class="form-group">
            <label for="availabilityText">Status Ketersediaan</label>
            <input
              id="availabilityText"
              v-model="profileForm.availabilityText"
              type="text"
              placeholder="Contoh: Terbuka untuk magang dan proyek lepas"
            >
          </div>

          <!-- Aset Avatar & Resume -->
          <div class="assets-pickers-row">
            <div class="asset-picker-box">
              <label>Foto Avatar</label>
              <div class="asset-preview-holder">
                <img
                  v-if="selectedAvatar?.urls?.thumb || selectedAvatar?.urls?.original"
                  :src="(selectedAvatar.urls.thumb || selectedAvatar.urls.original) ?? undefined"
                  alt="Avatar"
                >
                <div v-else class="empty-asset">Belum ada foto</div>
              </div>
              <div class="asset-btn-row">
                <button type="button" class="btn" @click="openAvatarPicker">
                  Pilih Avatar
                </button>
                <button
                  v-if="profileForm.avatarMediaId"
                  type="button"
                  class="btn text-btn"
                  @click="
                    profileForm.avatarMediaId = null;
                    selectedAvatar = null;
                  "
                >
                  Hapus
                </button>
              </div>
            </div>

            <div class="asset-picker-box">
              <label>Resume / CV (Dokumen PDF)</label>
              <div class="asset-preview-holder asset-preview-holder--doc">
                <div v-if="selectedResume" class="doc-info">
                  <svg class="doc-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>{{ selectedResume.title || 'Dokumen Resume' }}</span>
                </div>
                <div v-else class="empty-asset">Belum ada dokumen PDF</div>
              </div>
              <div class="asset-btn-row">
                <button type="button" class="btn" @click="openResumePicker">
                  Pilih Dokumen PDF
                </button>
                <button
                  v-if="profileForm.resumeMediaId"
                  type="button"
                  class="btn text-btn"
                  @click="
                    profileForm.resumeMediaId = null;
                    selectedResume = null;
                  "
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>

          <div class="submit-row">
            <button type="submit" class="btn y save-btn" :disabled="isSavingProfile">
              {{ isSavingProfile ? 'Menyimpan...' : 'Simpan Profil Utama' }}
            </button>
          </div>
        </form>
      </section>

      <!-- TAB 2: FAKTA PROFIL -->
      <section v-else-if="activeTab === 'facts'" class="card tab-pane-card">
        <div class="pane-header">
          <h3>Daftar Fakta Profil</h3>
          <p>Fakta yang tampil di kartu samping bagian Tentang (misal Kampus, Lokasi).</p>
        </div>

        <div class="items-list">
          <div
            v-for="(fact, index) in facts"
            :key="fact.id"
            class="list-item-row"
          >
            <div class="order-controls">
              <button
                type="button"
                :disabled="index === 0"
                class="arrow-btn"
                @click="moveFact(index, 'up')"
              >
                ▲
              </button>
              <button
                type="button"
                :disabled="index === facts.length - 1"
                class="arrow-btn"
                @click="moveFact(index, 'down')"
              >
                ▼
              </button>
            </div>

            <div class="item-text">
              <span class="label">{{ fact.label }}</span>
              <h4>{{ fact.value }}</h4>
            </div>

            <div class="item-actions">
              <button
                type="button"
                class="action-btn-del"
                @click="handleDeleteFact(fact.id)"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>

        <!-- Tambah Fakta Baru -->
        <form class="add-item-form" @submit.prevent="handleAddFact">
          <h4>Tambah Fakta Baru</h4>
          <div class="form-grid-2">
            <div class="form-group">
              <label for="newFactLabel">Label (misal: Kampus, Status)</label>
              <input id="newFactLabel" v-model="newFact.label" type="text" required>
            </div>
            <div class="form-group">
              <label for="newFactValue">Nilai / Isi</label>
              <input id="newFactValue" v-model="newFact.value" type="text" required>
            </div>
          </div>
          <button type="submit" class="btn y">+ Tambah Fakta</button>
        </form>
      </section>

      <!-- TAB 3: TAUTAN SOSIAL -->
      <section v-else-if="activeTab === 'socials'" class="card tab-pane-card">
        <div class="pane-header">
          <h3>Daftar Tautan Sosial</h3>
          <p>Tombol tautan profil yang tampil di bagian Kontak dan footer. Bisa pasang logo/ikon PNG/SVG kustom.</p>
        </div>

        <div class="items-list">
          <div
            v-for="(soc, index) in socials"
            :key="soc.id"
            class="list-item-row"
          >
            <div class="order-controls">
              <button
                type="button"
                :disabled="index === 0"
                class="arrow-btn"
                @click="moveSocial(index, 'up')"
              >
                ▲
              </button>
              <button
                type="button"
                :disabled="index === socials.length - 1"
                class="arrow-btn"
                @click="moveSocial(index, 'down')"
              >
                ▼
              </button>
            </div>

            <div class="social-icon-preview">
              <img
                v-if="soc.media?.urls?.thumb || soc.media?.urls?.original"
                :src="soc.media.urls.thumb || soc.media.urls.original"
                :alt="soc.label"
                class="soc-thumb"
              >
              <span v-else class="soc-no-thumb">Tanpa Ikon</span>
            </div>

            <div class="item-text">
              <span class="label">{{ soc.platform }}</span>
              <h4>{{ soc.label }}</h4>
              <small>{{ soc.url }}</small>
            </div>

            <div class="item-actions">
              <button
                type="button"
                class="btn action-btn-sm"
                @click="openSocialIconPicker(soc.id)"
              >
                {{ soc.mediaId ? 'Ganti Ikon' : '+ Ikon' }}
              </button>
              <button
                v-if="soc.mediaId"
                type="button"
                class="btn action-btn-del"
                @click="handleRemoveSocialIcon(soc)"
              >
                Hapus Ikon
              </button>
              <button
                type="button"
                class="action-btn-del"
                @click="handleDeleteSocial(soc.id)"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>

        <!-- Tambah Tautan Sosial Baru -->
        <form class="add-item-form" @submit.prevent="handleAddSocial">
          <h4>Tambah Tautan Sosial Baru</h4>
          <div class="form-grid-3">
            <div class="form-group">
              <label for="newSocialPlatform">Platform</label>
              <select id="newSocialPlatform" v-model="newSocial.platform">
                <option v-for="p in SOCIAL_PLATFORMS" :key="p" :value="p">
                  {{ p }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="newSocialLabel">Label Tombol (misal: GitHub, LinkedIn)</label>
              <input id="newSocialLabel" v-model="newSocial.label" type="text" required>
            </div>
            <div class="form-group">
              <label for="newSocialUrl">URL (awali dengan https:// atau mailto:)</label>
              <input id="newSocialUrl" v-model="newSocial.url" type="text" required>
            </div>
          </div>

          <div class="social-icon-picker-row">
            <div v-if="newSocialMedia" class="new-icon-preview">
              <img :src="newSocialMedia.urls?.thumb || newSocialMedia.urls?.original" alt="Ikon terpilih" class="soc-thumb">
              <span>{{ newSocialMedia.title || 'Ikon Terpilih' }}</span>
              <button type="button" class="btn-text-del" @click="newSocialMedia = null; newSocial.mediaId = null">
                ✕ Batal Ikon
              </button>
            </div>
            <button v-else type="button" class="btn" @click="openSocialIconPicker()">
              + Pilih Ikon (PNG/SVG dari Pustaka Media)
            </button>
          </div>

          <button type="submit" class="btn y" style="margin-top: 14px">+ Tambah Sosial</button>
        </form>
      </section>

      <!-- TAB 4: SOROTAN ANGKA -->
      <section v-else-if="activeTab === 'highlights'" class="card tab-pane-card">
        <div class="pane-header">
          <h3>Sorotan Angka (Highlights)</h3>
          <p>Kartu angka besar di bagian Keahlian atau Tentang (misal "±580 test case").</p>
        </div>

        <div class="items-list">
          <div
            v-for="(h, index) in highlights"
            :key="h.id"
            class="list-item-row"
          >
            <div class="order-controls">
              <button
                type="button"
                :disabled="index === 0"
                class="arrow-btn"
                @click="moveHighlight(index, 'up')"
              >
                ▲
              </button>
              <button
                type="button"
                :disabled="index === highlights.length - 1"
                class="arrow-btn"
                @click="moveHighlight(index, 'down')"
              >
                ▼
              </button>
            </div>

            <div class="item-text">
              <span class="label">Penempatan: {{ h.placement }}</span>
              <div class="big">{{ h.value }}</div>
              <h4>{{ h.label }}</h4>
              <small v-if="h.note">{{ h.note }}</small>
            </div>

            <div class="item-actions">
              <button
                type="button"
                class="action-btn-del"
                @click="handleDeleteHighlight(h.id)"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>

        <!-- Tambah Highlight Baru -->
        <form class="add-item-form" @submit.prevent="handleAddHighlight">
          <h4>Tambah Sorotan Angka Baru</h4>
          <div class="form-grid-3">
            <div class="form-group">
              <label for="newHighlightPlacement">Penempatan</label>
              <select id="newHighlightPlacement" v-model="newHighlight.placement">
                <option value="about">Tentang (About)</option>
                <option value="skills">Keahlian (Skills)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="newHighlightValue">Angka / Teks Besar (misal: ±580, 100%)</label>
              <input id="newHighlightValue" v-model="newHighlight.value" type="text" required>
            </div>
            <div class="form-group">
              <label for="newHighlightLabel">Keterangan Singkat</label>
              <input id="newHighlightLabel" v-model="newHighlight.label" type="text" required>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 16px">
            <label for="newHighlightNote">Catatan Tambahan (opsional)</label>
            <input id="newHighlightNote" v-model="newHighlight.note" type="text">
          </div>
          <button type="submit" class="btn y">+ Tambah Sorotan</button>
        </form>
      </section>
    </div>

    <!-- Media Picker Modal -->
    <MediaPickerModal
      :is-open="isMediaPickerOpen"
      :allowed-kind="mediaPickerTarget === 'resume' ? 'document' : 'image'"
      @close="isMediaPickerOpen = false"
      @select="handleMediaSelected"
    />
  </div>
</template>

<style scoped>
.page-header {
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
  margin: 0 0 24px;
}

.alert--success {
  background: #d4edda;
  color: #155724;
}

.alert--error {
  background: #f8d7da;
  color: #721c24;
}

.admin-tab-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.admin-tab-btn {
  padding: 10px 18px;
  border: 2px solid var(--ink);
  border-radius: 10px;
  background: var(--paper);
  font-family: var(--sans);
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.admin-tab-btn:hover {
  background: #eee3d1;
}

.admin-tab-btn--active {
  background: var(--yellow) !important;
  box-shadow: 3px 3px 0 var(--ink);
}

.main-profile-card,
.tab-pane-card {
  padding: 32px;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 18px;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
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

.assets-pickers-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin: 24px 0;
  padding: 24px;
  background: var(--cream);
  border: 2px dashed var(--ink);
  border-radius: 14px;
}

.asset-picker-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.asset-preview-holder {
  width: 120px;
  height: 120px;
  border: 2px solid var(--ink);
  border-radius: 12px;
  overflow: hidden;
  background: var(--paper);
  display: flex;
  align-items: center;
  justify-content: center;
}

.asset-preview-holder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.asset-preview-holder--doc {
  width: 100%;
  height: 60px;
  padding: 12px;
}

.doc-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.doc-svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.empty-asset {
  font-size: 12px;
  color: var(--muted);
  text-align: center;
  padding: 8px;
}

.asset-btn-row {
  display: flex;
  gap: 10px;
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

.submit-row {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px solid var(--ink);
}

.save-btn {
  padding: 14px 32px;
  font-size: 16px;
}

/* Items List Styling */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0 36px;
}

.list-item-row {
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
  gap: 4px;
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

.social-icon-preview {
  width: 40px;
  height: 40px;
  border: 1.5px solid var(--ink);
  border-radius: 8px;
  background: var(--paper);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.soc-thumb {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.soc-no-thumb {
  font-size: 9px;
  color: var(--muted);
  text-align: center;
  line-height: 1.1;
  padding: 2px;
}

.item-text {
  flex-grow: 1;
}

.item-text h4 {
  font-size: 17px;
  margin: 2px 0;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.action-btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.action-btn-del {
  background: #f8d7da;
  color: #721c24;
  border: 1.5px solid var(--ink);
  border-radius: 6px;
  padding: 6px 12px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.social-icon-picker-row {
  margin: 14px 0;
}

.new-icon-preview {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--paper);
  border: 1.5px solid var(--ink);
  border-radius: 8px;
  padding: 6px 12px;
}

.btn-text-del {
  background: none;
  border: none;
  color: var(--red);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.add-item-form {
  padding: 24px;
  background: var(--cream);
  border: 2px dashed var(--ink);
  border-radius: 14px;
}

.add-item-form h4 {
  font-size: 18px;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .form-grid-2,
  .form-grid-3,
  .assets-pickers-row {
    grid-template-columns: 1fr;
  }
}
</style>
