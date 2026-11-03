<script setup lang="ts">
import { useRoute } from 'vue-router'
import { usePublicApi } from '~/composables/usePublicApi'
import ProjectCard from '~/components/ProjectCard.vue'
import MediaGallery from '~/components/MediaGallery.vue'
import TheFooter from '~/components/TheFooter.vue'

const route = useRoute()
const publicApi = usePublicApi()
const slug = route.params.slug as string

const { data: skill, error } = await useAsyncData(
  `skill-detail-${slug}`,
  () => publicApi.getSkill(slug)
)

if (error.value || !skill.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Skill tidak ditemukan atau tidak tersedia.',
    fatal: true,
  })
}

if (skill.value) {
  const s = skill.value
  useSeoMeta({
    title: `${s.name} — Keahlian Ibnu Hilmi Athaillah`,
    description: s.summary,
    ogTitle: `${s.name} — Keahlian Ibnu Hilmi Athaillah`,
    ogDescription: s.summary,
    ogType: 'article',
  })
}

const getLevelLabel = (level: string | null) => {
  if (level === 'strong') return 'Tingkat Mahir'
  if (level === 'comfortable') return 'Nyaman / Produktif'
  if (level === 'learning') return 'Sedang Mempelajari'
  return level
}
</script>

<template>
  <div v-if="skill" class="skill-detail-page">
    <header class="skill-header wrap">
      <NuxtLink to="/" class="back-link">
        ← Kembali ke Beranda
      </NuxtLink>

      <div class="meta-row">
        <span class="label" :style="skill.category.accent === 'yellow' ? 'color: var(--ink)' : ''">
          {{ skill.category.name }}
        </span>

        <span v-if="skill.level" class="level-chip">
          {{ getLevelLabel(skill.level) }}
        </span>

        <span v-if="skill.yearsExperience" class="exp-chip">
          ± {{ skill.yearsExperience }} Tahun Pengalaman
        </span>
      </div>

      <h1>{{ skill.name }}</h1>
      <p class="skill-lead">{{ skill.summary }}</p>
    </header>

    <main class="wrap skill-main">
      <!-- Deskripsi Detail Markdown -->
      <section v-if="skill.descriptionHtml" class="description-section">
        <div class="markdown-body" v-html="skill.descriptionHtml" />
      </section>

      <!-- Galeri Media Skill -->
      <section v-if="skill.media && skill.media.length > 0" class="gallery-section">
        <h3>Dokumentasi & Bukti</h3>
        <MediaGallery :media="skill.media" />
      </section>

      <!-- Proyek Terkait -->
      <section v-if="skill.projects && skill.projects.length > 0" class="projects-section">
        <h3>Proyek yang Menggunakan {{ skill.name }}</h3>
        <div class="projects-grid">
          <ProjectCard
            v-for="(p, index) in skill.projects"
            :key="p.id"
            :project="p"
            :is-yellow="index % 2 === 1"
          />
        </div>
      </section>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.skill-detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.skill-header {
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
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.level-chip,
.exp-chip {
  font-size: 14px;
  font-weight: 700;
  padding: 4px 12px;
  border: 1.5px solid var(--ink);
  border-radius: 999px;
  background: var(--paper);
}

.skill-header h1 {
  font-size: clamp(38px, 6vw, 64px);
  margin: 8px 0 16px;
}

.skill-lead {
  font-size: 20px;
  color: var(--muted);
  max-width: 36em;
  line-height: 1.5;
}

.skill-main {
  flex-grow: 1;
  padding-bottom: 80px;
}

.description-section {
  padding: 0;
  margin-bottom: 48px;
}

.gallery-section,
.projects-section {
  padding: 32px 0 0;
  border-top: 2px dashed var(--ink);
  margin-top: 32px;
}

.gallery-section h3,
.projects-section h3 {
  font-size: 26px;
  margin-bottom: 20px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
}
</style>
