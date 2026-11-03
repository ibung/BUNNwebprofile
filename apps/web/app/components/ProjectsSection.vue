<script setup lang="ts">
import type { PublicProjectItem } from '@bunn/shared'
import ProjectCard from './ProjectCard.vue'

defineProps<{
  projects: PublicProjectItem[]
}>()
</script>

<template>
  <section v-if="projects && projects.length > 0" id="proyek" style="background: #efe2ce">
    <span class="label">Proyek</span>
    <h2>Karya <em>pilihan.</em></h2>
    <p class="sub">
      Pilihan karya dan aplikasi yang pernah saya rancang, bangun, dan uji.
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
