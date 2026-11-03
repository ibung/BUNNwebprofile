<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminApi } from '~/composables/useAdminApi'
import type { AdminProject } from '~/composables/useAdminApi'
import ProjectForm from '~/components/admin/ProjectForm.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const route = useRoute()
const adminApi = useAdminApi()
const projectId = Number(route.params.id)

const project = ref<AdminProject | null>(null)
const isLoading = ref(true)

const loadProject = async () => {
  try {
    project.value = await adminApi.getProject(projectId)
  } catch (err) {
    console.error('Gagal memuat detail proyek:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadProject()
})

useSeoMeta({
  title: 'Sunting Proyek — bunn.my.id',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="edit-project-page">
    <div class="page-header">
      <NuxtLink to="/admin/projects" class="back-link">
        ← Kembali ke Daftar Proyek
      </NuxtLink>
      <h1>Sunting <em>Proyek.</em></h1>
    </div>

    <div v-if="isLoading" class="loading-state">
      <p>Memuat formulir proyek...</p>
    </div>

    <ProjectForm
      v-else-if="project"
      :initial-data="project"
      :is-edit="true"
    />

    <div v-else class="card empty-state">
      <h3>Proyek tidak ditemukan</h3>
      <NuxtLink to="/admin/projects" class="btn y">
        Kembali ke Daftar Proyek
      </NuxtLink>
    </div>
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

