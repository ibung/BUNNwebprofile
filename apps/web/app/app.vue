<script setup lang="ts">
import { computed } from 'vue'
import { usePublicApi } from '~/composables/usePublicApi'

const publicApi = usePublicApi()
const { data: siteSettings } = await useAsyncData('site-settings', () =>
  publicApi.getSettings()
)

const faviconUrl = computed(() => {
  const fav = siteSettings.value?.favicon
  return fav?.urls?.thumb || fav?.urls?.original || '/favicon.ico'
})

const faviconType = computed(() => {
  const fav = siteSettings.value?.favicon
  if (fav?.mimeType) return fav.mimeType
  if (faviconUrl.value?.endsWith('.svg')) return 'image/svg+xml'
  if (faviconUrl.value?.endsWith('.png')) return 'image/png'
  return 'image/x-icon'
})

useHead({
  link: computed(() => [
    {
      key: 'favicon',
      rel: 'icon',
      type: faviconType.value,
      href: faviconUrl.value,
    },
  ]),
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
