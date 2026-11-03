<script setup lang="ts">
import type { PublicProjectItem, PublicSiteSettings } from '@bunn/shared'
import ProjectCard from './ProjectCard.vue'

defineProps<{
  projects: PublicProjectItem[]
  settings?: PublicSiteSettings
}>()
</script>

<template>
  <section v-if="projects && projects.length > 0" id="proyek" style="background: #efe2ce">
    <span class="label">{{ settings?.projectsLabel || 'Karya pilihan' }}</span>
    <h2>{{ settings?.projectsTitleMain || 'Pilihan ' }}<em>{{ settings?.projectsTitleAccent || 'karya.' }}</em></h2>
    <p v-if="settings?.projectsSubtitle" class="sub">
      {{ settings.projectsSubtitle }}
    </p>

    <div class="projects-grid">
      <ProjectCard
        v-for="(p, index) in projects"
        :key="p.id"
        :project="p"
        :is-yellow="index % 2 === 1"
      />
    </div>

    <div class="all-projects-cta">
      <NuxtLink to="/projects" class="btn y">
        Lihat semua proyek →
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
}

.all-projects-cta {
  margin-top: 48px;
  text-align: center;
}
</style>
