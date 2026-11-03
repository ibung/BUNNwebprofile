<script setup lang="ts">
import { computed } from 'vue'
import type { PublicMedia } from '@bunn/shared'

const props = withDefaults(
  defineProps<{
    media?: PublicMedia | null
    alt?: string
    priority?: boolean
    bordered?: boolean
    aspectRatio?: string
    sizes?: string
  }>(),
  {
    media: null,
    alt: undefined,
    priority: false,
    bordered: false,
    aspectRatio: undefined,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  }
)

const effectiveAlt = computed(() => {
  return props.alt ?? props.media?.altText ?? ''
})

const src = computed(() => {
  if (!props.media?.urls) return ''
  return (
    props.media.urls.md ||
    props.media.urls.original ||
    props.media.urls.thumb ||
    props.media.urls.lg ||
    ''
  )
})

const srcset = computed(() => {
  if (!props.media?.urls) return undefined
  const parts: string[] = []
  if (props.media.urls.thumb) parts.push(`${props.media.urls.thumb} 480w`)
  if (props.media.urls.md) parts.push(`${props.media.urls.md} 960w`)
  if (props.media.urls.lg) parts.push(`${props.media.urls.lg} 1600w`)
  return parts.length > 0 ? parts.join(', ') : undefined
})
</script>

<template>
  <img
    v-if="src"
    :src="src"
    :srcset="srcset"
    :sizes="srcset ? sizes : undefined"
    :alt="effectiveAlt"
    :width="media?.width || undefined"
    :height="media?.height || undefined"
    :loading="priority ? 'eager' : 'lazy'"
    :decoding="priority ? 'sync' : 'async'"
    class="app-image"
    :class="{ 'app-image--bordered': bordered }"
    :style="aspectRatio ? { aspectRatio, objectFit: 'cover' } : undefined"
  >
</template>

<style scoped>
.app-image {
  width: 100%;
  height: auto;
  display: block;
}

.app-image--bordered {
  border: 2.5px solid var(--ink);
  border-radius: 16px;
}
</style>
