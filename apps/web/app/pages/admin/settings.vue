<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PublicMedia } from '@bunn/shared'
import { useAdminApi } from '~/composables/useAdminApi'
import type { AdminSiteSettingsData } from '~/composables/useAdminApi'
import MediaPickerModal from '~/components/admin/MediaPickerModal.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const adminApi = useAdminApi()

const isLoading = ref(true)
const statusMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

// Settings Form
const settingsForm = ref<Partial<AdminSiteSettingsData>>({
  siteTitle: '',
  metaDescription: '',
  footerText: '',
  contactFormEnabled: true,
  ogImageMediaId: null,
})
const selectedOgImage = ref<PublicMedia | null>(null)
const isSavingSettings = ref(false)
const isOgPickerOpen = ref(false)

// Password Form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const isChangingPassword = ref(false)
const passwordMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const loadSettings = async () => {
  isLoading.value = true
  try {
    const s = await adminApi.getSettings()
    settingsForm.value = s
    selectedOgImage.value = s.ogImage || null
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
  statusMessage.value = null

  try {
    const updated = await adminApi.updateSettings({
      siteTitle: settingsForm.value.siteTitle,
      metaDescription: settingsForm.value.metaDescription,
      footerText: settingsForm.value.footerText,
      contactFormEnabled: settingsForm.value.contactFormEnabled,
      ogImageMediaId: settingsForm.value.ogImageMediaId,
    })
    settingsForm.value = updated
    statusMessage.value = { type: 'success', text: 'Pengaturan situs berhasil disimpan.' }
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    statusMessage.value = {
      type: 'error',
      text: errorObj.data?.error?.message || 'Gagal menyimpan pengaturan.',
    }
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

const handleChangePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordMessage.value = {
      type: 'error',
      text: 'Konfirmasi kata sandi baru tidak cocok.',
    }
    return
  }

  if (passwordForm.value.newPassword.length < 12) {
    passwordMessage.value = {
      type: 'error',
      text: 'Kata sandi baru minimal harus 12 karakter.',
    }
    return
  }

  isChangingPassword.value = true
  passwordMessage.value = null

  try {
    const res = await adminApi.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    })
    passwordMessage.value = {
      type: 'success',
      text: res.message || 'Kata sandi berhasil diperbarui.',
    }
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    passwordMessage.value = {
      type: 'error',
      text: errorObj.data?.error?.message || 'Gagal mengubah kata sandi.',
    }
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

    <div v-if="isLoading" class="loading-state">
      <p>Memuat pengaturan...</p>
    </div>

    <div v-else class="settings-content">
      <!-- Form Pengaturan Umum -->
      <section class="card settings-card">
        <h2>Metadata & Tampilan Situs</h2>

        <div
          v-if="statusMessage"
          class="alert-bar"
          :class="statusMessage.type === 'success' ? 'alert--success' : 'alert--error'"
          role="alert"
        >
          {{ statusMessage.text }}
        </div>

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
              <span v-else>Simpan Pengaturan Situs</span>
            </button>
          </div>
        </form>
      </section>

      <!-- Form Ganti Kata Sandi -->
      <section class="card password-card">
        <h2>Ganti Kata Sandi Admin</h2>
        <p class="section-sub">Pastikan kata sandi baru kuat dan minimal 12 karakter.</p>

        <div
          v-if="passwordMessage"
          class="alert-bar"
          :class="passwordMessage.type === 'success' ? 'alert--success' : 'alert--error'"
          role="alert"
        >
          {{ passwordMessage.text }}
        </div>

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
  </div>
</template>

<style scoped>
.page-header h1 {
  font-size: 34px;
  margin-bottom: 24px;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 860px;
}

.settings-card,
.password-card {
  padding: 32px;
}

.settings-card h2,
.password-card h2 {
  font-size: 24px;
  margin-bottom: 6px;
}

.section-sub {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 20px;
}

.alert-bar {
  padding: 12px 18px;
  border: 2px solid var(--ink);
  border-radius: 10px;
  font-weight: 700;
  margin: 16px 0;
}

.alert--success {
  background: #d4edda;
  color: #155724;
}

.alert--error {
  background: #f8d7da;
  color: #721c24;
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

.password-form {
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}
</style>
