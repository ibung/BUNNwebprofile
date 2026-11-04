<script setup lang="ts">
import { computed } from 'vue'
import { parseSectionTitle } from '~/utils/sectionTitle'

const props = withDefaults(
  defineProps<{
    main?: string | null
    accent?: string | null
    defaultMain?: string
    defaultAccent?: string
    accentClass?: string
  }>(),
  {
    main: '',
    accent: '',
    defaultMain: '',
    defaultAccent: '',
    accentClass: '',
  }
)

const segments = computed(() =>
  parseSectionTitle(props.main, props.accent, props.defaultMain, props.defaultAccent)
)
</script>

<template>
  <template v-for="(seg, idx) in segments" :key="idx"><em v-if="seg.isAccent" :class="accentClass">{{ seg.text }}</em><span v-else>{{ seg.text }}</span></template>
</template>

