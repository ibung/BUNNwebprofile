<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { PublicMedia } from '@bunn/shared'
import AppImage from './AppImage.vue'
import YouTubePlayer from './YouTubePlayer.vue'
import VideoPlayer from './VideoPlayer.vue'

const props = defineProps<{
  media: PublicMedia[]
}>()

const activeIndex = ref<number | null>(null)
const triggerElement = ref<HTMLElement | null>(null)
const modalRef = ref<HTMLElement | null>(null)

const activeMedia = computed(() => {
  if (activeIndex.value === null) return null
  return props.media[activeIndex.value] ?? null
})

const openLightbox = (index: number, event: MouseEvent | KeyboardEvent) => {
  triggerElement.value = event.currentTarget as HTMLElement
  activeIndex.value = index
  nextTick(() => {
    modalRef.value?.focus()
  })
}

const closeLightbox = () => {
  activeIndex.value = null
  nextTick(() => {
    triggerElement.value?.focus()
    triggerElement.value = null
  })
}

const nextMedia = () => {
  if (activeIndex.value === null) return
  activeIndex.value = (activeIndex.value + 1) % props.media.length
}

const prevMedia = () => {
  if (activeIndex.value === null) return
  activeIndex.value = (activeIndex.value - 1 + props.media.length) % props.media.length
}

const handleKeydown = (event: KeyboardEvent) => {
  if (activeIndex.value === null) return

  if (event.key === 'Escape') {
    closeLightbox()
  } else if (event.key === 'ArrowRight') {
    nextMedia()
  } else if (event.key === 'ArrowLeft') {
    prevMedia()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div v-if="media && media.length > 0" class="gallery-wrapper">
    <div class="gallery-grid">
      <button
        v-for="(item, index) in media"
        :key="item.id"
        type="button"
        class="gallery-item"
        :aria-label="'Buka media ' + (index + 1) + ': ' + (item.title || item.altText || 'Lihat foto')"
        @click="openLightbox(index, $event)"
      >
        <div v-if="item.kind === 'image'" class="thumbnail-container">
          <AppImage :media="item" aspect-ratio="4/3" />
        </div>
        <div v-else-if="item.kind === 'youtube'" class="thumbnail-container thumbnail--video">
          <div v-if="item.posterUrl" class="thumb-poster">
            <img :src="item.posterUrl" :alt="item.title || 'YouTube'" >
          </div>
          <div v-else class="thumb-placeholder">YouTube</div>
          <div class="thumb-badge">▶ Video</div>
        </div>
        <div v-else-if="item.kind === 'video'" class="thumbnail-container thumbnail--video">
          <div v-if="item.posterUrl" class="thumb-poster">
            <img :src="item.posterUrl" :alt="item.title || 'Video'" >
          </div>
          <div v-else class="thumb-placeholder">Video</div>
          <div class="thumb-badge">▶ Video</div>
        </div>
        <div v-else-if="item.kind === 'document'" class="thumbnail-container thumbnail--doc">
          <div class="doc-icon">📄</div>
          <div class="doc-title">{{ item.title || 'Dokumen PDF' }}</div>
        </div>
      </button>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="activeMedia"
        ref="modalRef"
        class="lightbox-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Pratinjau galeri media"
        tabindex="-1"
        @click.self="closeLightbox"
      >
        <div class="lightbox-container">
          <!-- Tombol Tutup -->
          <button
            type="button"
            class="lightbox-close"
            aria-label="Tutup lightbox"
            @click="closeLightbox"
          >
            ✕
          </button>

          <!-- Navigasi Kiri / Kanan -->
          <button
            v-if="media.length > 1"
            type="button"
            class="lightbox-nav lightbox-nav--prev"
            aria-label="Media sebelumnya"
            @click="prevMedia"
          >
            ‹
          </button>

          <button
            v-if="media.length > 1"
            type="button"
            class="lightbox-nav lightbox-nav--next"
            aria-label="Media berikutnya"
            @click="nextMedia"
          >
            ›
          </button>

          <!-- Tampilan Konten Media Aktif -->
          <div class="lightbox-content">
            <div v-if="activeMedia.kind === 'image'" class="lightbox-media-frame">
              <AppImage :media="activeMedia" priority />
            </div>

            <div v-else-if="activeMedia.kind === 'youtube'" class="lightbox-media-frame">
              <YouTubePlayer :media="activeMedia" />
            </div>

            <div v-else-if="activeMedia.kind === 'video'" class="lightbox-media-frame">
              <VideoPlayer :media="activeMedia" />
            </div>

            <div v-else-if="activeMedia.kind === 'document'" class="lightbox-doc-frame">
              <h3>{{ activeMedia.title || 'Dokumen' }}</h3>
              <a
                v-if="activeMedia.urls.original"
                :href="activeMedia.urls.original"
                target="_blank"
                rel="noopener noreferrer"
                class="btn y"
              >
                Unduh / Buka Dokumen PDF
              </a>
            </div>

            <!-- Teks Caption -->
            <div v-if="activeMedia.caption || activeMedia.title" class="lightbox-caption">
              <strong>{{ activeMedia.title }}</strong>
              <p v-if="activeMedia.caption">{{ activeMedia.caption }}</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery-wrapper {
  margin: 28px 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}

.gallery-item {
  background: var(--paper);
  border: 2.5px solid var(--ink);
  border-radius: 14px;
  box-shadow: 4px 4px 0 var(--ink);
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  text-align: left;
}

.gallery-item:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--ink);
}

.thumbnail-container {
  width: 100%;
  aspect-ratio: 4 / 3;
  position: relative;
  overflow: hidden;
  background: var(--cream);
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.thumb-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 20px;
  color: var(--muted);
}

.thumb-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: var(--ink);
  color: var(--cream);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.05em;
}

.thumbnail--doc {
  flex-direction: column;
  padding: 16px;
  gap: 8px;
  text-align: center;
}

.doc-icon {
  font-size: 32px;
}

.doc-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
}

/* Lightbox Modal */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(42, 31, 27, 0.88);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.lightbox-container {
  position: relative;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-close {
  position: absolute;
  top: -48px;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--cream);
  background: var(--red);
  color: var(--cream);
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0 var(--ink);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 2px solid var(--ink);
  background: var(--yellow);
  color: var(--ink);
  font-size: 28px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 3px 3px 0 var(--ink);
  z-index: 10;
}

.lightbox-nav--prev {
  left: -24px;
}

.lightbox-nav--next {
  right: -24px;
}

.lightbox-content {
  width: 100%;
  background: var(--paper);
  border: 3px solid var(--ink);
  border-radius: 18px;
  box-shadow: 10px 10px 0 var(--ink);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.lightbox-media-frame {
  max-height: 70vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ink);
}

.lightbox-doc-frame {
  padding: 48px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.lightbox-caption {
  padding: 16px 20px;
  background: var(--paper);
  border-top: 2px solid var(--ink);
  font-size: 15px;
  color: var(--ink);
}

.lightbox-caption strong {
  display: block;
  font-size: 16px;
  margin-bottom: 4px;
}

@media (max-width: 860px) {
  .lightbox-nav--prev {
    left: 4px;
  }
  .lightbox-nav--next {
    right: 4px;
  }
  .lightbox-close {
    top: -42px;
    right: 4px;
  }
}
</style>
