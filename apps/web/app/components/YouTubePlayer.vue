<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PublicMedia } from '@bunn/shared'

const props = defineProps<{
  media: PublicMedia
}>()

const isPlaying = ref(false)

const embedUrl = computed(() => {
  if (!props.media.youtube?.id) return ''
  const id = props.media.youtube.id
  const start = props.media.youtube.startSeconds
  const startParam = start ? `&start=${start}` : ''
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1${startParam}`
})

const play = () => {
  isPlaying.value = true
}
</script>

<template>
  <div class="youtube-facade-wrapper">
    <!-- Facade sebelum diklik (Zero external requests / tracker) -->
    <div
      v-if="!isPlaying"
      class="youtube-facade"
      role="button"
      tabindex="0"
      :aria-label="'Putar video: ' + (media.title || 'YouTube')"
      @click="play"
      @keydown.enter.prevent="play"
      @keydown.space.prevent="play"
    >
      <div v-if="media.posterUrl" class="facade-poster">
        <img :src="media.posterUrl" :alt="media.title || 'Poster video'" >
      </div>

      <div class="facade-overlay">
        <button
          type="button"
          class="play-button"
          :aria-label="'Putar video: ' + (media.title || 'YouTube')"
        >
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        <div v-if="media.title" class="facade-title">
          {{ media.title }}
        </div>
      </div>
    </div>

    <!-- Iframe YouTube Nocookie setelah diklik pengguna -->
    <div v-else class="youtube-iframe-container">
      <iframe
        :src="embedUrl"
        :title="media.title || 'Video YouTube'"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </div>
  </div>
</template>

<style scoped>
.youtube-facade-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 2.5px solid var(--ink);
  border-radius: 16px;
  box-shadow: 7px 7px 0 var(--ink);
  overflow: hidden;
  background: var(--paper);
}

.youtube-facade {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--cream);
}

.facade-poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.facade-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.facade-overlay {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  text-align: center;
}

.play-button {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2.5px solid var(--ink);
  background: var(--yellow);
  color: var(--ink);
  box-shadow: 4px 4px 0 var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.youtube-facade:hover .play-button {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--ink);
}

.facade-title {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 18px;
  color: var(--ink);
  background: var(--paper);
  border: 2px solid var(--ink);
  border-radius: 8px;
  padding: 6px 14px;
  box-shadow: 3px 3px 0 var(--ink);
}

.youtube-iframe-container {
  width: 100%;
  height: 100%;
}

.youtube-iframe-container iframe {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
