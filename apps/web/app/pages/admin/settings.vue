<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PublicMedia } from '@bunn/shared'
import { useAdminApi } from '~/composables/useAdminApi'
import { useAdminToast } from '~/composables/useAdminToast'
import type { AdminSiteSettingsData } from '~/composables/useAdminApi'
import MediaPickerModal from '~/components/admin/MediaPickerModal.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const adminApi = useAdminApi()
const toast = useAdminToast()

const activeTab = ref<'general' | 'sections' | 'password'>('general')
const isLoading = ref(true)

// Settings Form
const settingsForm = ref<Partial<AdminSiteSettingsData>>({
  siteTitle: '',
  metaDescription: '',
  footerText: '',
  contactFormEnabled: true,
  ogImageMediaId: null,
  faviconMediaId: null,

  aboutLabel: '',
  aboutTitleMain: '',
  aboutTitleAccent: '',

  projectsLabel: '',
  projectsTitleMain: '',
  projectsTitleAccent: '',
  projectsSubtitle: '',

  skillsLabel: '',
  skillsTitleMain: '',
  skillsTitleAccent: '',
  skillsSubtitle: '',

  experiencesLabel: '',
  experiencesTitleMain: '',
  experiencesTitleAccent: '',
  experiencesSubtitle: '',

  contactLabel: '',
  contactTitleMain: '',
  contactTitleAccent: '',
  contactSubtitle: '',
})

const selectedOgImage = ref<PublicMedia | null>(null)
const selectedFavicon = ref<PublicMedia | null>(null)
const isSavingSettings = ref(false)
const isOgPickerOpen = ref(false)
const isFaviconPickerOpen = ref(false)

// Password Form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const isChangingPassword = ref(false)

const loadSettings = async () => {
  isLoading.value = true
  try {
    const s = await adminApi.getSettings()
    settingsForm.value = {
      ...settingsForm.value,
      ...s,
    }
    selectedOgImage.value = s.ogImage || null
    selectedFavicon.value = s.favicon || null
  } catch (err) {
    console.error('Gagal memuat pengaturan:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadSettings()
})

const handleSaveSettings = async () => {
  isSavingSettings.value = true

  try {
    const updated = await adminApi.updateSettings({
      siteTitle: settingsForm.value.siteTitle,
      metaDescription: settingsForm.value.metaDescription,
      footerText: settingsForm.value.footerText,
      contactFormEnabled: settingsForm.value.contactFormEnabled,
      ogImageMediaId: settingsForm.value.ogImageMediaId,
      faviconMediaId: settingsForm.value.faviconMediaId,

      aboutLabel: settingsForm.value.aboutLabel,
      aboutTitleMain: settingsForm.value.aboutTitleMain,
      aboutTitleAccent: settingsForm.value.aboutTitleAccent,

      projectsLabel: settingsForm.value.projectsLabel,
      projectsTitleMain: settingsForm.value.projectsTitleMain,
      projectsTitleAccent: settingsForm.value.projectsTitleAccent,
      projectsSubtitle: settingsForm.value.projectsSubtitle,

      skillsLabel: settingsForm.value.skillsLabel,
      skillsTitleMain: settingsForm.value.skillsTitleMain,
      skillsTitleAccent: settingsForm.value.skillsTitleAccent,
      skillsSubtitle: settingsForm.value.skillsSubtitle,

      experiencesLabel: settingsForm.value.experiencesLabel,
      experiencesTitleMain: settingsForm.value.experiencesTitleMain,
      experiencesTitleAccent: settingsForm.value.experiencesTitleAccent,
      experiencesSubtitle: settingsForm.value.experiencesSubtitle,

      contactLabel: settingsForm.value.contactLabel,
      contactTitleMain: settingsForm.value.contactTitleMain,
      contactTitleAccent: settingsForm.value.contactTitleAccent,
      contactSubtitle: settingsForm.value.contactSubtitle,
    })
    settingsForm.value = {
      ...settingsForm.value,
      ...updated,
    }
    toast.success('Pengaturan berhasil disimpan!')
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    toast.error(errorObj.data?.error?.message || 'Gagal menyimpan pengaturan.')
  } finally {
    isSavingSettings.value = false
  }
}

const handleOgSelected = (media: PublicMedia | PublicMedia[]) => {
  const item = Array.isArray(media) ? media[0] : media
  if (!item) return
  selectedOgImage.value = item
  settingsForm.value.ogImageMediaId = item.id
}

const handleFaviconSelected = (media: PublicMedia | PublicMedia[]) => {
  const item = Array.isArray(media) ? media[0] : media
  if (!item) return
  selectedFavicon.value = item
  settingsForm.value.faviconMediaId = item.id
}

const handleChangePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error('Konfirmasi kata sandi baru tidak cocok.')
    return
  }

  if (passwordForm.value.newPassword.length < 12) {
    toast.error('Kata sandi baru minimal harus 12 karakter.')
    return
  }

  isChangingPassword.value = true

  try {
    const res = await adminApi.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    })
    toast.success(res.message || 'Kata sandi berhasil diperbarui.')
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    toast.error(errorObj.data?.error?.message || 'Gagal mengubah kata sandi.')
  } finally {
    isChangingPassword.value = false
  }
}

useSeoMeta({
  title: 'Pengaturan Situs — bunn.my.id',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="settings-page">
    <div class="page-header">
      <div>
        <span class="label">Konfigurasi</span>
        <h1>Pengaturan <em>Situs.</em></h1>
      </div>
    </div>

    <!-- Tab Bar -->
    <div class="admin-tab-bar">
      <button
        type="button"
        class="admin-tab-btn"
        :class="{ 'admin-tab-btn--active': activeTab === 'general' }"
        @click="activeTab = 'general'"
      >
        Umum & SEO
      </button>
      <button
        type="button"
        class="admin-tab-btn"
        :class="{ 'admin-tab-btn--active': activeTab === 'sections' }"
        @click="activeTab = 'sections'"
      >
        Teks & Judul Landing Page
      </button>
      <button
        type="button"
        class="admin-tab-btn"
        :class="{ 'admin-tab-btn--active': activeTab === 'password' }"
        @click="activeTab = 'password'"
      >
        Ganti Kata Sandi
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
      <p>Memuat pengaturan...</p>
    </div>

    <div v-else class="settings-content">
      <!-- TAB 1: FORM PENGATURAN UMUM & SEO -->
      <section v-if="activeTab === 'general'" class="card settings-card">
        <h2>Metadata & Tampilan Situs</h2>
        <p class="section-sub">Atur judul web, deskripsi mesin pencari, gambar pratinjau media sosial, dan teks footer.</p>

        <form @submit.prevent="handleSaveSettings">
          <div class="form-group">
            <label for="siteTitle">Judul Situs (Site Title) *</label>
            <input
              id="siteTitle"
              v-model="settingsForm.siteTitle"
              type="text"
              required
              placeholder="Contoh: Ibnu Hilmi Athaillah — Portofolio"
            >
          </div>

          <div class="form-group">
            <label for="metaDescription">Deskripsi Meta SEO</label>
            <textarea
              id="metaDescription"
              v-model="settingsForm.metaDescription"
              rows="3"
              placeholder="Deskripsi ringkas yang tampil di mesin pencari..."
            />
          </div>

          <!-- Baris Picker Gambar OG & Favicon (2 Kolom) -->
          <div class="media-pickers-row">
            <!-- Open Graph Image Picker -->
            <div class="og-picker-box">
              <label>Gambar Open Graph (og:image untuk media sosial & preview link)</label>
              <div class="og-preview-frame">
                <img
                  v-if="selectedOgImage?.urls?.md || selectedOgImage?.urls?.original"
                  :src="(selectedOgImage.urls.md || selectedOgImage.urls.original) ?? undefined"
                  alt="OG Preview"
                >
                <div v-else class="empty-og">Belum ada gambar Open Graph</div>
              </div>

              <div class="og-btn-row">
                <button
                  type="button"
                  class="btn"
                  @click="isOgPickerOpen = true"
                >
                  Pilih Gambar OG
                </button>
                <button
                  v-if="settingsForm.ogImageMediaId"
                  type="button"
                  class="btn text-btn"
                  @click="
                    settingsForm.ogImageMediaId = null;
                    selectedOgImage = null;
                  "
                >
                  Hapus
                </button>
              </div>
            </div>

            <!-- Favicon / Ikon Tab Browser Picker -->
            <div class="favicon-picker-box">
              <label>Favicon / Ikon Tab Browser (Pengganti Logo Nuxt di Tab)</label>
              <p class="picker-sub">
                Unggah logo ikon Anda sendiri untuk menggantikan ikon default Nuxt di tab peramban (disarankan PNG, SVG, atau ICO rasio 1:1).
              </p>

              <div class="browser-tab-mock">
                <div class="tab-preview">
                  <img
                    v-if="selectedFavicon?.urls?.thumb || selectedFavicon?.urls?.original"
                    :src="(selectedFavicon.urls.thumb || selectedFavicon.urls.original) ?? undefined"
                    alt="Favicon Preview"
                    class="tab-favicon"
                  >
                  <div v-else class="tab-favicon-fallback">
                    <svg viewBox="0 0 24 24" class="tab-fallback-svg" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" stroke-width="2" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12h20" />
                    </svg>
                  </div>
                  <span class="tab-title">{{ settingsForm.siteTitle || 'Web Portofolio' }}</span>
                  <span class="tab-close" aria-hidden="true">×</span>
                </div>
              </div>

              <div class="favicon-btn-row">
                <button
                  type="button"
                  class="btn"
                  @click="isFaviconPickerOpen = true"
                >
                  Pilih Favicon dari Pustaka
                </button>
                <button
                  v-if="settingsForm.faviconMediaId"
                  type="button"
                  class="btn text-btn"
                  @click="
                    settingsForm.faviconMediaId = null;
                    selectedFavicon = null;
                  "
                >
                  Hapus Favicon (Gunakan Default)
                </button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="footerText">Teks Hak Cipta Footer</label>
            <input
              id="footerText"
              v-model="settingsForm.footerText"
              type="text"
              placeholder="Contoh: © 2026 Ibnu Hilmi Athaillah"
            >
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                v-model="settingsForm.contactFormEnabled"
                type="checkbox"
              >
              <span>Aktifkan Formulir Kontak Publik</span>
            </label>
            <small>Bila dinonaktifkan, bagian kontak di situs publik hanya menampilkan tautan sosial.</small>
          </div>

          <div class="submit-row">
            <button
              type="submit"
              class="btn y"
              :disabled="isSavingSettings"
            >
              <span v-if="isSavingSettings">Menyimpan...</span>
              <span v-else>Simpan Pengaturan Umum</span>
            </button>
          </div>
        </form>
      </section>

      <!-- TAB 2: TEKS & JUDUL SEGMEN LANDING PAGE -->
      <section v-else-if="activeTab === 'sections'" class="sections-tab-container">
        <form @submit.prevent="handleSaveSettings">
          <!-- 1. Bagian Tentang Saya -->
          <div class="card section-editor-card">
            <div class="section-editor-header">
              <h3>1. Bagian Tentang Saya (About)</h3>
              <p class="section-sub">Mengatur label atas dan judul headline di bagian cerita diri.</p>
            </div>

            <div class="section-editor-split">
              <div class="section-editor-fields">
                <div class="form-group">
                  <label for="aboutLabel">Label Kategori</label>
                  <input
                    id="aboutLabel"
                    v-model="settingsForm.aboutLabel"
                    type="text"
                    placeholder="Contoh: TENTANG SAYA"
                  >
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label for="aboutTitleMain">Judul Teks Biasa</label>
                    <input
                      id="aboutTitleMain"
                      v-model="settingsForm.aboutTitleMain"
                      type="text"
                      placeholder="Contoh: Membangun, "
                    >
                  </div>

                  <div class="form-group">
                    <label for="aboutTitleAccent">Judul Aksen Italic Oranye</label>
                    <input
                      id="aboutTitleAccent"
                      v-model="settingsForm.aboutTitleAccent"
                      type="text"
                      placeholder="Contoh: lalu menguji."
                    >
                  </div>
                </div>
              </div>

              <div class="section-editor-preview">
                <div class="live-preview-box">
                  <span class="preview-tag">Pratinjau Tampilan:</span>
                  <span class="preview-label">{{ settingsForm.aboutLabel || 'TENTANG SAYA' }}</span>
                  <h2 class="preview-heading">
                    {{ settingsForm.aboutTitleMain || 'Membangun, ' }}
                    <em class="preview-accent">{{ settingsForm.aboutTitleAccent || 'lalu menguji.' }}</em>
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Bagian Proyek -->
          <div class="card section-editor-card">
            <div class="section-editor-header">
              <h3>2. Bagian Proyek (Projects)</h3>
              <p class="section-sub">Mengatur label, judul, dan deskripsi singkat di galeri karya.</p>
            </div>

            <div class="section-editor-split">
              <div class="section-editor-fields">
                <div class="form-group">
                  <label for="projectsLabel">Label Kategori</label>
                  <input
                    id="projectsLabel"
                    v-model="settingsForm.projectsLabel"
                    type="text"
                    placeholder="Contoh: KARYA PILIHAN"
                  >
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label for="projectsTitleMain">Judul Teks Biasa</label>
                    <input
                      id="projectsTitleMain"
                      v-model="settingsForm.projectsTitleMain"
                      type="text"
                      placeholder="Contoh: Pilihan "
                    >
                  </div>

                  <div class="form-group">
                    <label for="projectsTitleAccent">Judul Aksen Italic Oranye</label>
                    <input
                      id="projectsTitleAccent"
                      v-model="settingsForm.projectsTitleAccent"
                      type="text"
                      placeholder="Contoh: karya."
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label for="projectsSubtitle">Deskripsi / Subtitle Bagian Proyek</label>
                  <textarea
                    id="projectsSubtitle"
                    v-model="settingsForm.projectsSubtitle"
                    rows="2"
                    placeholder="Contoh: Beberapa proyek yang saya rancang, kembangkan, dan uji kualitasnya."
                  />
                </div>
              </div>

              <div class="section-editor-preview">
                <div class="live-preview-box">
                  <span class="preview-tag">Pratinjau Tampilan:</span>
                  <span class="preview-label">{{ settingsForm.projectsLabel || 'KARYA PILIHAN' }}</span>
                  <h2 class="preview-heading">
                    {{ settingsForm.projectsTitleMain || 'Pilihan ' }}
                    <em class="preview-accent">{{ settingsForm.projectsTitleAccent || 'karya.' }}</em>
                  </h2>
                  <p class="preview-subtitle">
                    {{ settingsForm.projectsSubtitle || 'Beberapa proyek yang saya rancang, kembangkan, dan uji kualitasnya.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Bagian Keahlian -->
          <div class="card section-editor-card">
            <div class="section-editor-header">
              <h3>3. Bagian Keahlian & Teknologi (Skills)</h3>
              <p class="section-sub">Mengatur label, judul, dan deskripsi di bagian daftar keahlian teknis.</p>
            </div>

            <div class="section-editor-split">
              <div class="section-editor-fields">
                <div class="form-group">
                  <label for="skillsLabel">Label Kategori</label>
                  <input
                    id="skillsLabel"
                    v-model="settingsForm.skillsLabel"
                    type="text"
                    placeholder="Contoh: KEAHLIAN"
                  >
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label for="skillsTitleMain">Judul Teks Biasa</label>
                    <input
                      id="skillsTitleMain"
                      v-model="settingsForm.skillsTitleMain"
                      type="text"
                      placeholder="Contoh: Alat dan "
                    >
                  </div>

                  <div class="form-group">
                    <label for="skillsTitleAccent">Judul Aksen Italic Oranye</label>
                    <input
                      id="skillsTitleAccent"
                      v-model="settingsForm.skillsTitleAccent"
                      type="text"
                      placeholder="Contoh: teknologi."
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label for="skillsSubtitle">Deskripsi / Subtitle Bagian Keahlian</label>
                  <textarea
                    id="skillsSubtitle"
                    v-model="settingsForm.skillsSubtitle"
                    rows="2"
                    placeholder="Contoh: Teknologi, framework, dan perkakas yang saya gunakan untuk membangun antarmuka web dan otomatisasi pengujian."
                  />
                </div>
              </div>

              <div class="section-editor-preview">
                <div class="live-preview-box">
                  <span class="preview-tag">Pratinjau Tampilan:</span>
                  <span class="preview-label">{{ settingsForm.skillsLabel || 'KEAHLIAN' }}</span>
                  <h2 class="preview-heading">
                    {{ settingsForm.skillsTitleMain || 'Alat dan ' }}
                    <em class="preview-accent">{{ settingsForm.skillsTitleAccent || 'teknologi.' }}</em>
                  </h2>
                  <p class="preview-subtitle">
                    {{ settingsForm.skillsSubtitle || 'Teknologi, framework, dan perkakas yang saya gunakan untuk membangun antarmuka web dan otomatisasi pengujian.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. Bagian Perjalanan (Experiences) -->
          <div class="card section-editor-card">
            <div class="section-editor-header">
              <h3>4. Bagian Perjalanan & Linimasa (Experiences)</h3>
              <p class="section-sub">Mengatur label, judul, dan deskripsi di bagian rekam jejak linimasa.</p>
            </div>

            <div class="section-editor-split">
              <div class="section-editor-fields">
                <div class="form-group">
                  <label for="experiencesLabel">Label Kategori</label>
                  <input
                    id="experiencesLabel"
                    v-model="settingsForm.experiencesLabel"
                    type="text"
                    placeholder="Contoh: PERJALANAN"
                  >
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label for="experiencesTitleMain">Judul Teks Biasa</label>
                    <input
                      id="experiencesTitleMain"
                      v-model="settingsForm.experiencesTitleMain"
                      type="text"
                      placeholder="Contoh: Satu langkah, "
                    >
                  </div>

                  <div class="form-group">
                    <label for="experiencesTitleAccent">Judul Aksen Italic Oranye</label>
                    <input
                      id="experiencesTitleAccent"
                      v-model="settingsForm.experiencesTitleAccent"
                      type="text"
                      placeholder="Contoh: lalu berikutnya."
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label for="experiencesSubtitle">Deskripsi / Subtitle Bagian Perjalanan</label>
                  <textarea
                    id="experiencesSubtitle"
                    v-model="settingsForm.experiencesSubtitle"
                    rows="2"
                    placeholder="Contoh: Catatan pengalaman kerja, proyek freelance, dan pendidikan yang membentuk pemahaman teknis saya."
                  />
                </div>
              </div>

              <div class="section-editor-preview">
                <div class="live-preview-box">
                  <span class="preview-tag">Pratinjau Tampilan:</span>
                  <span class="preview-label">{{ settingsForm.experiencesLabel || 'PERJALANAN' }}</span>
                  <h2 class="preview-heading">
                    {{ settingsForm.experiencesTitleMain || 'Satu langkah, ' }}
                    <em class="preview-accent">{{ settingsForm.experiencesTitleAccent || 'lalu berikutnya.' }}</em>
                  </h2>
                  <p class="preview-subtitle">
                    {{ settingsForm.experiencesSubtitle || 'Catatan pengalaman kerja, proyek freelance, dan pendidikan yang membentuk pemahaman teknis saya.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Bagian Kontak -->
          <div class="card section-editor-card">
            <div class="section-editor-header">
              <h3>5. Bagian Kontak (Contact)</h3>
              <p class="section-sub">Mengatur label, judul, dan deskripsi ajakan di bagian formulir & tautan kontak.</p>
            </div>

            <div class="section-editor-split">
              <div class="section-editor-fields">
                <div class="form-group">
                  <label for="contactLabel">Label Kategori</label>
                  <input
                    id="contactLabel"
                    v-model="settingsForm.contactLabel"
                    type="text"
                    placeholder="Contoh: KONTAK"
                  >
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label for="contactTitleMain">Judul Teks Biasa</label>
                    <input
                      id="contactTitleMain"
                      v-model="settingsForm.contactTitleMain"
                      type="text"
                      placeholder="Contoh: Ayo "
                    >
                  </div>

                  <div class="form-group">
                    <label for="contactTitleAccent">Judul Aksen Italic Oranye/Kuning</label>
                    <input
                      id="contactTitleAccent"
                      v-model="settingsForm.contactTitleAccent"
                      type="text"
                      placeholder="Contoh: ngobrol."
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label for="contactSubtitle">Deskripsi / Subtitle Bagian Kontak</label>
                  <textarea
                    id="contactSubtitle"
                    v-model="settingsForm.contactSubtitle"
                    rows="2"
                    placeholder="Contoh: Punya proyek atau kesempatan kerja sama? Kirim pesan lewat formulir di bawah atau hubungi saya langsung."
                  />
                </div>
              </div>

              <div class="section-editor-preview">
                <div class="live-preview-box live-preview-box--terracotta" style="background-color: var(--red, #DA3F1B) !important;">
                  <span class="preview-tag">Pratinjau Tampilan (Latar Terracotta):</span>
                  <span class="preview-label preview-label--light">{{ settingsForm.contactLabel || 'KONTAK' }}</span>
                  <h2 class="preview-heading preview-heading--light">
                    {{ settingsForm.contactTitleMain || 'Ayo ' }}
                    <em class="preview-accent preview-accent--gold">{{ settingsForm.contactTitleAccent || 'ngobrol.' }}</em>
                  </h2>
                  <p class="preview-subtitle preview-subtitle--light">
                    {{ settingsForm.contactSubtitle || 'Punya proyek atau kesempatan kerja sama? Kirim pesan lewat formulir di bawah atau hubungi saya langsung.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="submit-row sticky-submit">
            <button
              type="submit"
              class="btn y save-sections-btn"
              :disabled="isSavingSettings"
            >
              <span v-if="isSavingSettings">Menyimpan...</span>
              <span v-else>Simpan Semua Teks Landing Page</span>
            </button>
          </div>
        </form>
      </section>

      <!-- TAB 3: FORM GANTI KATA SANDI -->
      <section v-else-if="activeTab === 'password'" class="card password-card">
        <h2>Ganti Kata Sandi Admin</h2>
        <p class="section-sub">Pastikan kata sandi baru kuat dan minimal 12 karakter.</p>

        <form class="password-form" @submit.prevent="handleChangePassword">
          <div class="form-group">
            <label for="currentPassword">Kata Sandi Saat Ini *</label>
            <input
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              type="password"
              required
              autocomplete="current-password"
            >
          </div>

          <div class="form-group">
            <label for="newPassword">Kata Sandi Baru (Min. 12 Karakter) *</label>
            <input
              id="newPassword"
              v-model="passwordForm.newPassword"
              type="password"
              required
              minlength="12"
              autocomplete="new-password"
            >
          </div>

          <div class="form-group">
            <label for="confirmPassword">Konfirmasi Kata Sandi Baru *</label>
            <input
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              type="password"
              required
              autocomplete="new-password"
            >
          </div>

          <button
            type="submit"
            class="btn y"
            :disabled="isChangingPassword"
          >
            <span v-if="isChangingPassword">Memperbarui Sandi...</span>
            <span v-else>Perbarui Kata Sandi</span>
          </button>
        </form>
      </section>
    </div>

    <!-- OG Media Picker Modal -->
    <MediaPickerModal
      :is-open="isOgPickerOpen"
      allowed-kind="image"
      @close="isOgPickerOpen = false"
      @select="handleOgSelected"
    />

    <!-- Favicon Media Picker Modal -->
    <MediaPickerModal
      :is-open="isFaviconPickerOpen"
      allowed-kind="image"
      @close="isFaviconPickerOpen = false"
      @select="handleFaviconSelected"
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

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}

.settings-card,
.password-card,
.section-editor-card {
  padding: 32px;
}

.media-pickers-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin: 20px 0;
}

.section-editor-card {
  margin-bottom: 28px;
}

.section-editor-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.section-editor-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-editor-preview {
  position: sticky;
  top: 24px;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.section-editor-header h3 {
  font-size: 22px;
  margin-bottom: 4px;
}

.section-sub {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 20px;
}

/* Pratinjau Tampilan Header Segmen */
.live-preview-box {
  background: var(--paper);
  border: 2px solid var(--ink);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  position: relative;
}

.live-preview-box--terracotta,
.live-preview-box.live-preview-box--terracotta {
  background: var(--red, #DA3F1B) !important;
  color: var(--cream, #F6EDE0);
}

.preview-tag {
  display: block;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 12px;
  letter-spacing: 0.05em;
}

.live-preview-box--terracotta .preview-tag {
  color: rgba(255, 255, 255, 0.7);
}

.preview-label {
  display: block;
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--red, #DA3F1B);
  margin-bottom: 6px;
}

.preview-label--light,
.live-preview-box--terracotta .preview-label {
  color: var(--yellow, #F2B84B) !important;
  opacity: 1;
}

.preview-heading {
  font-family: var(--serif);
  font-size: 32px;
  font-weight: 900;
  color: var(--ink);
  line-height: 1.15;
  margin: 0 0 8px;
}

.preview-heading--light,
.live-preview-box--terracotta .preview-heading {
  color: var(--cream, #F6EDE0) !important;
}

.preview-accent {
  font-style: italic;
  color: var(--accent-orange, #d9531e);
}

.preview-accent--gold,
.live-preview-box--terracotta .preview-accent {
  color: var(--yellow, #F2B84B) !important;
}

.preview-subtitle {
  font-family: var(--sans);
  font-size: 14px;
  color: var(--ink);
  line-height: 1.5;
  margin: 0;
  max-width: 650px;
}

.preview-subtitle--light {
  color: #fff;
  opacity: 0.9;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
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
.form-group textarea:focus {
  outline: none;
  background: var(--paper);
  box-shadow: 3px 3px 0 var(--ink);
}

.og-picker-box {
  margin: 20px 0;
  padding: 20px;
  background: var(--cream);
  border: 2px dashed var(--ink);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.og-preview-frame {
  width: 100%;
  max-width: 420px;
  aspect-ratio: 1.91 / 1;
  border: 2px solid var(--ink);
  border-radius: 10px;
  overflow: hidden;
  background: var(--paper);
  display: flex;
  align-items: center;
  justify-content: center;
}

.og-preview-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-og {
  font-size: 13px;
  color: var(--muted);
}

.og-btn-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Favicon Picker & Browser Tab Mock */
.favicon-picker-box {
  margin: 20px 0;
  padding: 20px;
  background: var(--cream);
  border: 2px dashed var(--ink);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.picker-sub {
  font-size: 13px;
  color: var(--muted);
  margin-top: -4px;
}

.browser-tab-mock {
  background: #2b2b2b;
  padding: 12px 16px 0;
  border-radius: 10px 10px 0 0;
  border: 2px solid var(--ink);
  max-width: 320px;
}

.tab-preview {
  background: var(--paper);
  color: var(--ink);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 8px 8px 0 0;
  font-size: 13px;
  font-weight: 600;
  max-width: 240px;
  border: 1.5px solid var(--ink);
  border-bottom: none;
}

.tab-favicon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 3px;
}

.tab-favicon-fallback {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tab-fallback-svg {
  width: 18px;
  height: 18px;
  stroke: var(--muted);
}

.tab-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}

.tab-close {
  font-size: 16px;
  color: var(--muted);
  margin-left: 4px;
}

.favicon-btn-row {
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

.checkbox-group {
  margin: 20px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.checkbox-label input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-group small {
  color: var(--muted);
  margin-top: 4px;
}

.submit-row {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px solid var(--ink);
}

.save-sections-btn {
  padding: 14px 32px;
  font-size: 16px;
}

.password-form {
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

@media (max-width: 1024px) {
  .section-editor-split {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .media-pickers-row {
    grid-template-columns: 1fr;
  }

  .section-editor-preview {
    position: static;
  }
}

@media (max-width: 768px) {
  .form-grid-2,
  .form-grid-3 {
    grid-template-columns: 1fr;
  }
}
</style>
