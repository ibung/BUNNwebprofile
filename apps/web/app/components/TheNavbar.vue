<script setup lang="ts">
import { useRoute } from 'vue-router'

withDefaults(
  defineProps<{
    brandName?: string
  }>(),
  {
    brandName: 'Ibnu Hilmi Athaillah',
  }
)

const route = useRoute()

const getLink = (hash: string) => {
  return route.path === '/' ? hash : `/${hash}`
}
</script>

<template>
  <nav class="nav" aria-label="Navigasi Utama">
    <NuxtLink :to="getLink('#top')" class="logo">
      {{ brandName }}
    </NuxtLink>

    <ul class="nav-links">
      <li><NuxtLink :to="getLink('#tentang')" class="l">Tentang</NuxtLink></li>
      <li><NuxtLink :to="getLink('#proyek')" class="l">Proyek</NuxtLink></li>
      <li><NuxtLink :to="getLink('#keahlian')" class="l">Keahlian</NuxtLink></li>
      <li><NuxtLink :to="getLink('#jalan')" class="l">Perjalanan</NuxtLink></li>
      <li><NuxtLink :to="getLink('#kontak')" class="l">Kontak</NuxtLink></li>
    </ul>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 26px var(--pad);
  position: absolute;
  inset: 0 0 auto 0;
  z-index: 10;
}

.logo {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 22px;
  color: var(--cream);
  text-decoration: none;
}

.logo i {
  font-style: italic;
}

.nav-links {
  display: flex;
  gap: 22px;
  list-style: none;
  flex-wrap: wrap;
}

.l {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cream);
  text-decoration: none;
  transition: color 0.12s ease;
}

.l:hover {
  color: var(--yellow);
}

@media (max-width: 860px) {
  .nav-links {
    gap: 14px;
  }
}
</style>
