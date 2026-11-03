<script setup lang="ts">
import type { PublicMedia } from '@bunn/shared'

defineProps<{
  media: PublicMedia
}>()
</script>

<template>
  <div class="video-player-wrapper">
    <video
      controls
      preload="metadata"
      playsinline
      :poster="media.posterUrl || undefined"
      class="video-player"
    >
      <source
        v-if="media.urls.original"
        :src="media.urls.original"
        :type="media.mimeType || 'video/mp4'"
      >
      Peramban Anda tidak mendukung pemutaran video.
    </video>
  </div>
</template>

<style scoped>
.video-player-wrapper {
  width: 100%;
  border: 2.5px solid var(--ink);
  border-radius: 16px;
  box-shadow: 7px 7px 0 var(--ink);
  overflow: hidden;
  background: var(--ink);
}

.video-player {
  width: 100%;
  display: block;
  max-height: 540px;
}
</style>
