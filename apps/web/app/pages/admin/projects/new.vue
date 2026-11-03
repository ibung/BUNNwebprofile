<script setup lang="ts">
import ProjectForm from '~/components/admin/ProjectForm.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({
  title: 'Buat Proyek Baru — bunn.my.id',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="new-project-page">
    <div class="page-header">
      <NuxtLink to="/admin/projects" class="back-link">
        ← Kembali ke Daftar Proyek
      </NuxtLink>
      <h1>Buat <em>Proyek Baru.</em></h1>
    </div>

    <ProjectForm :is-edit="false" />
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 24px;
}

.back-link {
  display: inline-block;
  font-weight: 700;
  font-size: 14px;
  color: var(--red);
  margin-bottom: 12px;
}

.back-link:hover {
  text-decoration: underline;
}

.page-header h1 {
  font-size: 34px;
}
</style>

