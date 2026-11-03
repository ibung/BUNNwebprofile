<script setup lang="ts">
import { useRoute } from 'vue-router'
import { usePublicApi } from '~/composables/usePublicApi'
import AppImage from '~/components/AppImage.vue'
import MediaGallery from '~/components/MediaGallery.vue'
import TheFooter from '~/components/TheFooter.vue'

const route = useRoute()
const publicApi = usePublicApi()
const slug = route.params.slug as string

const { data: project, error } = await useAsyncData(
  `project-detail-${slug}`,
  () => publicApi.getProject(slug)
)

if (error.value || !project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Proyek tidak ditemukan atau belum dipublikasikan.',
    fatal: true,
  })
}

if (project.value) {
  const p = project.value
  useSeoMeta({
    title: `${p.title} — Ibnu Hilmi Athaillah`,
    description: p.summary,
    ogTitle: `${p.title} — Ibnu Hilmi Athaillah`,
    ogDescription: p.summary,
    ogType: 'article',
    ogImage: p.cover?.urls?.original || p.cover?.urls?.lg,
    twitterCard: 'summary_large_image',
    twitterTitle: `${p.title} — Ibnu Hilmi Athaillah`,
    twitterDescription: p.summary,
  })
}

const formatDateRange = (startedOn: string | null, endedOn: string | null) => {
  if (!startedOn) return null
  const start = startedOn.slice(0, 7)
  const end = endedOn ? endedOn.slice(0, 7) : 'Sekarang'
  return `${start} — ${end}`
}
</script>

<template>
  <div v-if="project" class="project-detail-page">
    <header class="project-header wrap">
      <NuxtLink to="/projects" class="back-link">
        ← Kembali ke Semua Proyek
      </NuxtLink>

      <div class="meta-row">
        <span class="label">{{ project.kind || 'Proyek' }}</span>
        <span v-if="project.role" class="role-badge">
          Peran: <strong>{{ project.role }}</strong>
        </span>
        <span v-if="formatDateRange(project.startedOn, project.endedOn)" class="date-badge">
          {{ formatDateRange(project.startedOn, project.endedOn) }}
        </span>
      </div>

      <h1>{{ project.title }}</h1>
      <p class="project-lead">{{ project.summary }}</p>

      <!-- Tombol Aksi Demo / Repositori -->
      <div v-if="project.demoUrl || project.repoUrl" class="project-actions">
        <a
          v-if="project.demoUrl"
          :href="project.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn y"
        >
          Kunjungi Situs Demo ↗
        </a>

        <a
          v-if="project.repoUrl"
          :href="project.repoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn"
        >
          Lihat Repositori Kode ↗
        </a>
      </div>
    </header>

    <main class="wrap project-main">
      <!-- Gambar Sampul Besar -->
      <div v-if="project.cover" class="cover-wrapper">
        <AppImage :media="project.cover" priority bordered />
      </div>

      <!-- Deskripsi Detail (Markdown Tersanitasi) -->
      <section class="description-section">
        <div class="markdown-body" v-html="project.descriptionHtml" />
      </section>

      <!-- Teknologi / Keterampilan yang Digunakan -->
      <section v-if="project.skills && project.skills.length > 0" class="skills-section">
        <h3>Teknologi & Keterampilan</h3>
        <div class="skills-pills">
          <NuxtLink
            v-for="s in project.skills"
            :key="s.id"
            :to="`/skills/${s.slug}`"
            class="pill"
          >
            {{ s.name }}
          </NuxtLink>
        </div>
      </section>

      <!-- Galeri Media Tambahan & Tangkapan Layar -->
      <section v-if="project.media && project.media.length > 0" class="gallery-section">
        <h3>Galeri & Dokumentasi</h3>
        <MediaGallery :media="project.media" />
      </section>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.project-detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.project-header {
  padding-top: 48px;
  padding-bottom: 32px;
}

.back-link {
  display: inline-block;
  font-weight: 700;
  font-size: 15px;
  color: var(--red);
  margin-bottom: 24px;
}

.back-link:hover {
  text-decoration: underline;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.role-badge,
.date-badge {
  font-size: 14px;
  color: var(--muted);
}

.project-header h1 {
  font-size: clamp(38px, 6vw, 64px);
  margin: 8px 0 16px;
}

.project-lead {
  font-size: 20px;
  color: var(--muted);
  max-width: 36em;
  line-height: 1.5;
}

.project-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 28px;
}

.project-main {
  flex-grow: 1;
  padding-bottom: 80px;
}

.cover-wrapper {
  margin: 16px 0 48px;
}

.description-section {
  padding: 0;
  margin-bottom: 48px;
}

.skills-section,
.gallery-section {
  padding: 32px 0 0;
  border-top: 2px dashed var(--ink);
  margin-top: 32px;
}

.skills-section h3,
.gallery-section h3 {
  font-size: 26px;
  margin-bottom: 16px;
}

.skills-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
