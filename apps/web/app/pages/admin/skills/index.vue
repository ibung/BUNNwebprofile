<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CATEGORY_ACCENTS, SKILL_LEVELS } from '@bunn/shared'
import type { CategoryAccent, SkillLevel, PublicMedia } from '@bunn/shared'
import { useAdminApi } from '~/composables/useAdminApi'
import type { AdminSkillCategory, AdminSkill } from '~/composables/useAdminApi'
import MediaPickerModal from '~/components/admin/MediaPickerModal.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const adminApi = useAdminApi()

const categories = ref<AdminSkillCategory[]>([])
const skills = ref<AdminSkill[]>([])
const isLoading = ref(true)
const statusMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

// Category Modal Form
const isCategoryModalOpen = ref(false)
const editingCategory = ref<AdminSkillCategory | null>(null)
const categoryForm = ref({
  name: '',
  slug: '',
  description: '',
  accent: 'red' as CategoryAccent,
})

// Skill Modal Form
const isSkillModalOpen = ref(false)
const editingSkill = ref<AdminSkill | null>(null)
const skillForm = ref({
  name: '',
  slug: '',
  categoryId: 0,
  level: null as SkillLevel | null,
  summary: '',
  yearsExperience: null as number | null,
  descriptionMd: '',
  isVisible: true,
  mediaIds: [] as number[],
})
const selectedSkillMedia = ref<PublicMedia[]>([])
const isMediaPickerOpen = ref(false)

const loadData = async () => {
  isLoading.value = true
  try {
    const [catRes, skillRes] = await Promise.all([
      adminApi.getSkillCategories(),
      adminApi.getSkills(),
    ])
    categories.value = catRes || []
    skills.value = skillRes || []
  } catch (err) {
    console.error('Gagal memuat kategori & skill:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

const showMessage = (type: 'success' | 'error', text: string) => {
  statusMessage.value = { type, text }
  setTimeout(() => {
    if (statusMessage.value?.text === text) statusMessage.value = null
  }, 4000)
}

const getCategorySkills = (catId: number) => {
  return skills.value.filter((s) => s.categoryId === catId)
}

// Category Actions
const openCategoryModal = (cat?: AdminSkillCategory) => {
  if (cat) {
    editingCategory.value = cat
    categoryForm.value = {
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      accent: cat.accent,
    }
  } else {
    editingCategory.value = null
    categoryForm.value = {
      name: '',
      slug: '',
      description: '',
      accent: 'red',
    }
  }
  isCategoryModalOpen.value = true
}

const handleCategoryNameInput = () => {
  if (!editingCategory.value && !categoryForm.value.slug) {
    categoryForm.value.slug = categoryForm.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

const handleSaveCategory = async () => {
  try {
    if (editingCategory.value) {
      const updated = await adminApi.updateSkillCategory(editingCategory.value.id, {
        name: categoryForm.value.name.trim(),
        slug: categoryForm.value.slug.trim(),
        description: categoryForm.value.description.trim() || null,
        accent: categoryForm.value.accent,
      })
      const idx = categories.value.findIndex((c) => c.id === updated.id)
      if (idx >= 0) categories.value[idx] = updated
      showMessage('success', 'Kategori berhasil diperbarui.')
    } else {
      const created = await adminApi.createSkillCategory({
        name: categoryForm.value.name.trim(),
        slug: categoryForm.value.slug.trim(),
        description: categoryForm.value.description.trim() || null,
        accent: categoryForm.value.accent,
      })
      categories.value.push(created)
      showMessage('success', 'Kategori baru berhasil dibuat.')
    }
    isCategoryModalOpen.value = false
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    showMessage('error', errorObj.data?.error?.message || 'Gagal menyimpan kategori.')
  }
}

const handleDeleteCategory = async (id: number, name: string) => {
  const childSkills = getCategorySkills(id)
  if (childSkills.length > 0) {
    alert(`Tidak dapat menghapus kategori "${name}" karena masih memiliki ${childSkills.length} skill di dalamnya. Pindahkan atau hapus skill terlebih dahulu.`)
    return
  }

  if (!confirm(`Hapus kategori "${name}"?`)) return
  try {
    await adminApi.deleteSkillCategory(id)
    categories.value = categories.value.filter((c) => c.id !== id)
    showMessage('success', 'Kategori berhasil dihapus.')
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    showMessage('error', errorObj.data?.error?.message || 'Gagal menghapus kategori.')
  }
}

const moveCategory = async (index: number, direction: 'up' | 'down') => {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= categories.value.length) return

  const item = categories.value.splice(index, 1)[0]
  if (item) {
    categories.value.splice(targetIndex, 0, item)
    await adminApi.reorderSkillCategories(categories.value.map((c) => c.id))
  }
}

// Skill Actions
const openSkillModal = (catId?: number, skill?: AdminSkill) => {
  if (skill) {
    editingSkill.value = skill
    skillForm.value = {
      name: skill.name,
      slug: skill.slug,
      categoryId: skill.categoryId,
      level: skill.level,
      summary: skill.summary,
      yearsExperience: skill.yearsExperience,
      descriptionMd: skill.descriptionMd || '',
      isVisible: skill.isVisible,
      mediaIds: skill.media?.map((m) => m.id) || [],
    }
    selectedSkillMedia.value = skill.media || []
  } else {
    editingSkill.value = null
    skillForm.value = {
      name: '',
      slug: '',
      categoryId: catId || (categories.value[0]?.id || 0),
      level: 'comfortable',
      summary: '',
      yearsExperience: null,
      descriptionMd: '',
      isVisible: true,
      mediaIds: [],
    }
    selectedSkillMedia.value = []
  }
  isSkillModalOpen.value = true
}

const handleSkillNameInput = () => {
  if (!editingSkill.value && !skillForm.value.slug) {
    skillForm.value.slug = skillForm.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

const handleSaveSkill = async () => {
  const payload = {
    name: skillForm.value.name.trim(),
    slug: skillForm.value.slug.trim(),
    categoryId: skillForm.value.categoryId,
    level: skillForm.value.level,
    summary: skillForm.value.summary.trim(),
    yearsExperience: skillForm.value.yearsExperience ? Number(skillForm.value.yearsExperience) : null,
    descriptionMd: skillForm.value.descriptionMd.trim() || null,
    isVisible: skillForm.value.isVisible,
    mediaIds: skillForm.value.mediaIds,
  }

  try {
    if (editingSkill.value) {
      const updated = await adminApi.updateSkill(editingSkill.value.id, payload)
      const idx = skills.value.findIndex((s) => s.id === updated.id)
      if (idx >= 0) skills.value[idx] = updated
      showMessage('success', 'Skill berhasil diperbarui.')
    } else {
      const created = await adminApi.createSkill(payload)
      skills.value.push(created)
      showMessage('success', 'Skill baru berhasil dibuat.')
    }
    isSkillModalOpen.value = false
    await loadData()
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    showMessage('error', errorObj.data?.error?.message || 'Gagal menyimpan skill.')
  }
}

const handleDeleteSkill = async (id: number, name: string) => {
  if (!confirm(`Hapus skill "${name}"?`)) return
  try {
    await adminApi.deleteSkill(id)
    skills.value = skills.value.filter((s) => s.id !== id)
    showMessage('success', 'Skill berhasil dihapus.')
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    showMessage('error', errorObj.data?.error?.message || 'Gagal menghapus skill.')
  }
}

const moveSkill = async (catSkills: AdminSkill[], index: number, direction: 'up' | 'down') => {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= catSkills.length) return

  const item = catSkills.splice(index, 1)[0]
  if (item) {
    catSkills.splice(targetIndex, 0, item)
    await adminApi.reorderSkills(catSkills.map((s) => s.id))
    await loadData()
  }
}

// Skill Media Handlers
const handleSkillMediaSelected = (media: PublicMedia | PublicMedia[]) => {
  const items = Array.isArray(media) ? media : [media]
  for (const item of items) {
    if (!selectedSkillMedia.value.some((m) => m.id === item.id)) {
      selectedSkillMedia.value.push(item)
    }
  }
  skillForm.value.mediaIds = selectedSkillMedia.value.map((m) => m.id)
}

useSeoMeta({
  title: 'Kelola Keahlian — bunn.my.id',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="skills-admin-page">
    <div class="page-header">
      <div>
        <span class="label">Keahlian & Teknologi</span>
        <h1>Kelola <em>Keahlian.</em></h1>
      </div>

      <div class="header-actions">
        <button type="button" class="btn" @click="openCategoryModal()">
          + Kategori Baru
        </button>
        <button type="button" class="btn y" @click="openSkillModal()">
          + Skill Baru
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
      <p>Memuat kategori dan keahlian...</p>
    </div>

    <!-- Daftar Kategori & Skill (Akordeon) -->
    <div v-else-if="categories.length > 0" class="categories-list">
      <div
        v-for="(cat, cIdx) in categories"
        :key="cat.id"
        class="card category-card"
        :class="{ y: cat.accent === 'yellow' }"
      >
        <!-- Baris Header Kategori -->
        <div class="category-header">
          <div class="order-controls">
            <button
              type="button"
              :disabled="cIdx === 0"
              class="arrow-btn"
              @click="moveCategory(cIdx, 'up')"
            >
              ▲
            </button>
            <button
              type="button"
              :disabled="cIdx === categories.length - 1"
              class="arrow-btn"
              @click="moveCategory(cIdx, 'down')"
            >
              ▼
            </button>
          </div>

          <div class="category-title-info">
            <span class="label" :style="cat.accent === 'yellow' ? 'color: var(--ink)' : ''">
              Kategori Aksen: {{ cat.accent }}
            </span>
            <h3>{{ cat.name }}</h3>
            <p v-if="cat.description" class="cat-desc">{{ cat.description }}</p>
          </div>

          <div class="category-actions">
            <button
              type="button"
              class="btn text-btn"
              @click="openSkillModal(cat.id)"
            >
              + Tambah Skill di Sini
            </button>
            <button
              type="button"
              class="btn action-btn"
              @click="openCategoryModal(cat)"
            >
              Sunting
            </button>
            <button
              type="button"
              class="btn action-btn-del"
              @click="handleDeleteCategory(cat.id, cat.name)"
            >
              Hapus
            </button>
          </div>
        </div>

        <!-- Daftar Skill di Bawah Kategori -->
        <div class="skills-sublist">
          <div
            v-for="(skill, sIdx) in getCategorySkills(cat.id)"
            :key="skill.id"
            class="skill-item-row"
          >
            <div class="order-controls">
              <button
                type="button"
                :disabled="sIdx === 0"
                class="arrow-btn"
                @click="moveSkill(getCategorySkills(cat.id), sIdx, 'up')"
              >
                ▲
              </button>
              <button
                type="button"
                :disabled="sIdx === getCategorySkills(cat.id).length - 1"
                class="arrow-btn"
                @click="moveSkill(getCategorySkills(cat.id), sIdx, 'down')"
              >
                ▼
              </button>
            </div>

            <div class="skill-info">
              <div class="skill-name-row">
                <strong>{{ skill.name }}</strong>
                <span v-if="skill.level" class="level-badge">{{ skill.level }}</span>
                <span v-if="skill.yearsExperience" class="exp-badge">
                  {{ skill.yearsExperience }} thn
                </span>
                <span v-if="skill.media && skill.media.length > 0" class="media-count-badge">
                  🖼️ {{ skill.media.length }} media
                </span>
              </div>
              <p class="skill-summary">{{ skill.summary }}</p>
            </div>

            <div class="skill-actions">
              <button
                type="button"
                class="btn action-btn"
                @click="openSkillModal(cat.id, skill)"
              >
                Sunting
              </button>
              <button
                type="button"
                class="btn action-btn-del"
                @click="handleDeleteSkill(skill.id, skill.name)"
              >
                Hapus
              </button>
            </div>
          </div>

          <div
            v-if="getCategorySkills(cat.id).length === 0"
            class="empty-skills"
          >
            Belum ada skill di kategori ini.
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Kategori -->
    <Teleport to="body">
      <div
        v-if="isCategoryModalOpen"
        class="modal-backdrop"
        @click.self="isCategoryModalOpen = false"
      >
        <div class="modal-card">
          <div class="modal-header">
            <h3>{{ editingCategory ? 'Sunting Kategori' : 'Tambah Kategori Baru' }}</h3>
            <button
              type="button"
              class="close-btn"
              @click="isCategoryModalOpen = false"
            >
              ✕
            </button>
          </div>

          <form class="modal-body" @submit.prevent="handleSaveCategory">
            <div class="form-group">
              <label for="c-name">Nama Kategori *</label>
              <input
                id="c-name"
                v-model="categoryForm.name"
                type="text"
                required
                placeholder="Contoh: Frontend Development"
                @input="handleCategoryNameInput"
              >
            </div>

            <div class="form-group">
              <label for="c-slug">Slug URL *</label>
              <input
                id="c-slug"
                v-model="categoryForm.slug"
                type="text"
                required
                pattern="[a-z0-9\-]+"
                placeholder="frontend-development"
              >
            </div>

            <div class="form-group">
              <label for="c-accent">Warna Aksen</label>
              <select id="c-accent" v-model="categoryForm.accent">
                <option v-for="acc in CATEGORY_ACCENTS" :key="acc" :value="acc">
                  {{ acc === 'red' ? 'Merah (Red)' : 'Kuning (Yellow)' }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="c-desc">Deskripsi Singkat (opsional)</label>
              <textarea
                id="c-desc"
                v-model="categoryForm.description"
                rows="2"
                placeholder="Keterangan singkat kategori..."
              />
            </div>

            <div class="modal-footer-actions">
              <button
                type="button"
                class="btn"
                @click="isCategoryModalOpen = false"
              >
                Batal
              </button>
              <button type="submit" class="btn y">
                Simpan Kategori
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Skill -->
    <Teleport to="body">
      <div
        v-if="isSkillModalOpen"
        class="modal-backdrop"
        @click.self="isSkillModalOpen = false"
      >
        <div class="modal-card modal-card--large">
          <div class="modal-header">
            <h3>{{ editingSkill ? 'Sunting Skill' : 'Tambah Skill Baru' }}</h3>
            <button
              type="button"
              class="close-btn"
              @click="isSkillModalOpen = false"
            >
              ✕
            </button>
          </div>

          <form class="modal-body" @submit.prevent="handleSaveSkill">
            <div class="form-grid-2">
              <div class="form-group">
                <label for="s-name">Nama Skill / Alat *</label>
                <input
                  id="s-name"
                  v-model="skillForm.name"
                  type="text"
                  required
                  placeholder="Contoh: Nuxt, TypeScript, Docker"
                  @input="handleSkillNameInput"
                >
              </div>

              <div class="form-group">
                <label for="s-slug">Slug URL *</label>
                <input
                  id="s-slug"
                  v-model="skillForm.slug"
                  type="text"
                  required
                  pattern="[a-z0-9\-]+"
                  placeholder="nuxt"
                >
              </div>
            </div>

            <div class="form-grid-3">
              <div class="form-group">
                <label for="s-cat">Kategori *</label>
                <select id="s-cat" v-model="skillForm.categoryId" required>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="s-level">Tingkat Kemahiran</label>
                <select id="s-level" v-model="skillForm.level">
                  <option :value="null">Tanpa Tingkatan</option>
                  <option v-for="lvl in SKILL_LEVELS" :key="lvl" :value="lvl">
                    {{ lvl === 'strong' ? 'Mahir (Strong)' : lvl === 'comfortable' ? 'Nyaman (Comfortable)' : 'Belajar (Learning)' }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="s-years">Tahun Pengalaman (angka)</label>
                <input
                  id="s-years"
                  v-model="skillForm.yearsExperience"
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  placeholder="Contoh: 1.5"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="s-summary">Ringkasan Satu Kalimat *</label>
              <textarea
                id="s-summary"
                v-model="skillForm.summary"
                rows="2"
                required
                placeholder="Penjelasan singkat penggunaan skill ini..."
              />
            </div>

            <div class="form-group">
              <label for="s-desc">Deskripsi Lengkap Halaman Detail (Markdown opsional)</label>
              <textarea
                id="s-desc"
                v-model="skillForm.descriptionMd"
                rows="4"
                placeholder="Bila diisi, skill akan memiliki halaman detail sendiri di /skills/[slug]..."
              />
            </div>

            <!-- Media Pendukung -->
            <div class="media-section-box">
              <label>Media Pendukung (Sertifikat / Screenshot / Video Demo)</label>
              <div class="skill-media-previews">
                <div
                  v-for="(m, mIdx) in selectedSkillMedia"
                  :key="m.id"
                  class="skill-media-chip"
                >
                  <span>{{ m.title || m.kind }}</span>
                  <button
                    type="button"
                    class="remove-chip-btn"
                    @click="selectedSkillMedia.splice(mIdx, 1); skillForm.mediaIds.splice(mIdx, 1)"
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
                @click="isSkillModalOpen = false"
              >
                Batal
              </button>
              <button type="submit" class="btn y">
                Simpan Skill
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Media Picker Modal untuk Skill -->
    <MediaPickerModal
      :is-open="isMediaPickerOpen"
      :multiple="true"
      @close="isMediaPickerOpen = false"
      @select="handleSkillMediaSelected"
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

.header-actions {
  display: flex;
  gap: 12px;
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

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.category-card {
  padding: 24px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--ink);
}

.category-title-info {
  flex-grow: 1;
}

.category-title-info h3 {
  font-size: 22px;
  margin: 2px 0;
}

.cat-desc {
  font-size: 13px;
  color: var(--muted);
}

.category-actions {
  display: flex;
  align-items: center;
  gap: 10px;
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

.skills-sublist {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-item-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  background: var(--cream);
  border: 1.5px solid var(--ink);
  border-radius: 10px;
}

.order-controls {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.arrow-btn {
  background: var(--paper);
  border: 1px solid var(--ink);
  border-radius: 4px;
  font-size: 10px;
  padding: 2px 5px;
  cursor: pointer;
}

.arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.skill-info {
  flex-grow: 1;
  min-width: 0;
}

.skill-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.skill-name-row strong {
  font-size: 15px;
}

.level-badge,
.exp-badge,
.media-count-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border: 1px solid var(--ink);
  border-radius: 999px;
  background: var(--paper);
}

.skill-summary {
  font-size: 13px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.skill-actions {
  display: flex;
  gap: 8px;
}

.empty-skills {
  padding: 16px;
  font-size: 13px;
  color: var(--muted);
  font-style: italic;
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

.modal-card--large {
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
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

.form-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

.media-section-box {
  padding: 16px;
  background: var(--cream);
  border: 1.5px dashed var(--ink);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-media-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-media-chip {
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
