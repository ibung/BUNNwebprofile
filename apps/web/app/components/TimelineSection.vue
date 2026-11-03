<script setup lang="ts">
import type { PublicExperience, PublicSiteSettings } from '@bunn/shared'
import MediaGallery from './MediaGallery.vue'

defineProps<{
  experiences: PublicExperience[]
  settings?: PublicSiteSettings
}>()

const getYearDisplay = (startedOn: string, endedOn: string | null) => {
  const startYear = startedOn.slice(0, 4)
  if (!endedOn) {
    return `${startYear} — Sekarang`
  }
  const endYear = endedOn.slice(0, 4)
  return startYear === endYear ? startYear : `${startYear} — ${endYear}`
}
</script>

<template>
  <section v-if="experiences && experiences.length > 0" id="jalan">
    <span class="label">{{ settings?.experiencesLabel || 'Perjalanan' }}</span>
    <h2>{{ settings?.experiencesTitleMain || 'Satu langkah, ' }}<em>{{ settings?.experiencesTitleAccent || 'lalu berikutnya.' }}</em></h2>
    <p v-if="settings?.experiencesSubtitle" class="sub" style="margin-top: 8px; color: var(--muted); font-size: 16px;">
      {{ settings.experiencesSubtitle }}
    </p>

    <div class="timeline">
      <div
        v-for="(exp, index) in experiences"
        :key="exp.id"
        class="row"
      >
        <div class="when">
          {{ getYearDisplay(exp.startedOn, exp.endedOn) }}
        </div>

        <div class="card" :class="{ y: index % 2 === 0 }">
          <span class="label" :style="index % 2 === 0 ? 'color: var(--ink)' : ''">
            {{ exp.kind }}
          </span>

          <h3>{{ exp.title }}</h3>

          <p v-if="exp.organization" class="org">
            <strong>{{ exp.organization }}</strong>
          </p>

          <div
            v-if="exp.descriptionHtml"
            class="markdown-body exp-desc"
            v-html="exp.descriptionHtml"
          />

          <div v-if="exp.media && exp.media.length > 0" class="exp-gallery">
            <MediaGallery :media="exp.media" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline {
  display: grid;
  gap: 24px;
  max-width: 860px;
  margin-top: 40px;
}

.row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 24px;
  align-items: start;
}

.when {
  font-family: var(--serif);
  font-weight: 900;
  font-size: 20px;
  color: var(--red);
  padding-top: 22px;
}

.org {
  margin: 4px 0 10px;
  font-size: 15px;
}

.exp-desc {
  margin-top: 10px;
  font-size: 16px;
}

.exp-gallery {
  margin-top: 16px;
}

@media (max-width: 860px) {
  .row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .when {
    padding-top: 0;
  }
}
</style>
