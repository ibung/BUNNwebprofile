<script setup lang="ts">
import type { PublicProjectItem } from '@bunn/shared'
import AppImage from './AppImage.vue'

defineProps<{
  project: PublicProjectItem
  isYellow?: boolean
}>()
</script>

<template>
  <article class="card project-card" :class="{ y: isYellow }">
    <div v-if="project.cover" class="project-cover">
      <AppImage :media="project.cover" aspect-ratio="16/9" bordered />
    </div>

    <div class="project-header">
      <span class="label" :style="isYellow ? 'color: var(--ink)' : ''">
        {{ project.kind || project.role || 'Proyek' }}
      </span>

      <NuxtLink :to="`/projects/${project.slug}`" class="project-title-link">
        <h3>{{ project.title }}</h3>
      </NuxtLink>
    </div>

    <p class="project-summary">
      {{ project.summary }}
    </p>

    <div v-if="project.skills && project.skills.length > 0" class="project-skills">
      <NuxtLink
        v-for="s in project.skills"
        :key="s.id"
        :to="`/skills/${s.slug}`"
        class="pill"
      >
        {{ s.name }}
      </NuxtLink>
    </div>

    <div class="project-footer">
      <NuxtLink :to="`/projects/${project.slug}`" class="read-more">
        Lihat detail →
      </NuxtLink>

      <div class="external-links">
        <a
          v-if="project.demoUrl"
          :href="project.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="ext-link"
          aria-label="Buka demo proyek"
        >
          Demo ↗
        </a>
        <a
          v-if="project.repoUrl"
          :href="project.repoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="ext-link"
          aria-label="Buka repositori kode"
        >
          Repo ↗
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.project-cover {
  margin-bottom: 16px;
}

.project-header {
  margin-bottom: 8px;
}

.project-title-link {
  text-decoration: none;
  color: inherit;
}

.project-title-link:hover h3 {
  color: var(--red);
}

.card.y .project-title-link:hover h3 {
  color: var(--ink);
  text-decoration: underline;
}

.project-summary {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}

.project-skills {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.project-footer {
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1.5px dashed var(--ink);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.read-more {
  font-weight: 700;
  font-size: 14px;
  color: var(--ink);
  text-decoration: none;
}

.read-more:hover {
  text-decoration: underline;
}

.external-links {
  display: flex;
  gap: 12px;
}

.ext-link {
  font-weight: 700;
  font-size: 13px;
  color: var(--ink);
}

.ext-link:hover {
  color: var(--red);
}
</style>
