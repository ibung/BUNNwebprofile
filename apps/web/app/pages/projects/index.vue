<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePublicApi } from '~/composables/usePublicApi'
import ProjectCard from '~/components/ProjectCard.vue'
import TheFooter from '~/components/TheFooter.vue'

const route = useRoute()
const router = useRouter()
const publicApi = usePublicApi()

const selectedSkill = ref<string>((route.query.skill as string) || '')
const currentPage = ref<number>(Number(route.query.page) || 1)

const { data: projectResponse, status, refresh } = await useAsyncData(
  `projects-list-${selectedSkill.value}-${currentPage.value}`,
  () =>
    publicApi.getProjects({
      skill: selectedSkill.value || undefined,
      page: currentPage.value,
      perPage: 12,
    })
)

watch(
  () => [route.query.skill, route.query.page],
  ([newSkill, newPage]) => {
    selectedSkill.value = (newSkill as string) || ''
    currentPage.value = Number(newPage) || 1
    refresh()
  }
)

const setFilter = (skillSlug: string) => {
  selectedSkill.value = skillSlug
  currentPage.value = 1
  router.push({
    query: {
      ...(skillSlug ? { skill: skillSlug } : {}),
      page: 1,
    },
  })
}

useSeoMeta({
  title: 'Semua Proyek — Ibnu Hilmi Athaillah',
  description: 'Daftar lengkap proyek dan portofolio pengembangan web dan pengujian perangkat lunak.',
  ogTitle: 'Semua Proyek — Ibnu Hilmi Athaillah',
  ogDescription: 'Daftar lengkap proyek dan portofolio pengembangan web dan pengujian perangkat lunak.',
})
</script>

<template>
  <div class="projects-archive-page">
    <header class="archive-header wrap">
      <NuxtLink to="/" class="back-link">
        ← Kembali ke Beranda
      </NuxtLink>

      <span class="label">Portofolio</span>
      <h1>Semua <em>Proyek.</em></h1>
      <p class="sub">
        Kumpulan seluruh proyek yang pernah saya kerjakan, mulai dari aplikasi web skala penuh hingga eksplorasi kode.
      </p>

      <!-- Filter Keterampilan yang Sedang Aktif -->
      <div v-if="selectedSkill" class="active-filter-bar">
        <span>Menampilkan filter untuk skill: <strong>{{ selectedSkill }}</strong></span>
        <button type="button" class="clear-filter" @click="setFilter('')">
          Hapus filter (Tampilkan semua)
        </button>
      </div>
    </header>

    <main class="wrap archive-main">
      <div v-if="status === 'pending'" class="loading-state">
        <p>Memuat proyek...</p>
      </div>

      <div
        v-else-if="projectResponse?.data && projectResponse.data.length > 0"
        class="projects-grid"
      >
        <ProjectCard
          v-for="(p, index) in projectResponse.data"
          :key="p.id"
          :project="p"
          :is-yellow="index % 2 === 1"
        />
      </div>

      <div v-else class="empty-state card">
        <h3>Belum ada proyek yang cocok</h3>
        <p>Tidak ada proyek yang ditemukan untuk kriteria filter yang dipilih.</p>
        <button type="button" class="btn y" @click="setFilter('')">
          Lihat Semua Proyek
        </button>
      </div>

      <!-- Navigasi Halaman (Paginasi) -->
      <div
        v-if="projectResponse?.meta && projectResponse.meta.total && projectResponse.meta.total > 12"
        class="pagination"
      >
        <button
          type="button"
          class="btn"
          :disabled="currentPage <= 1"
          @click="
            router.push({
              query: { ...route.query, page: currentPage - 1 },
            })
          "
        >
          ← Sebelumnya
        </button>

        <span class="page-indicator">
          Halaman {{ currentPage }} dari
          {{ Math.ceil((projectResponse.meta.total || 1) / 12) }}
        </span>

        <button
          type="button"
          class="btn"
          :disabled="
            currentPage >=
            Math.ceil((projectResponse.meta.total || 1) / 12)
          "
          @click="
            router.push({
              query: { ...route.query, page: currentPage + 1 },
            })
          "
        >
          Berikutnya →
        </button>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.projects-archive-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.archive-header {
  padding-top: 48px;
  padding-bottom: 24px;
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

.archive-header h1 {
  font-size: clamp(40px, 6vw, 68px);
  margin: 12px 0;
}

.active-filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  padding: 10px 16px;
  background: var(--paper);
  border: 2px solid var(--ink);
  border-radius: 10px;
  font-size: 15px;
}

.clear-filter {
  background: none;
  border: none;
  color: var(--red);
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
}

.archive-main {
  flex-grow: 1;
  padding-bottom: 80px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.empty-state {
  text-align: center;
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 56px;
}

.page-indicator {
  font-weight: 700;
  font-size: 15px;
}
</style>
