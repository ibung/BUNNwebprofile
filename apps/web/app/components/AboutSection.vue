<script setup lang="ts">
import type { PublicProfile, PublicProfileFact, PublicHighlight } from '@bunn/shared'

defineProps<{
  profile: PublicProfile
  facts: PublicProfileFact[]
  highlights?: PublicHighlight[]
}>()
</script>

<template>
  <section id="tentang">
    <span class="label">Tentang {{ profile.displayName || profile.fullName || 'saya' }}</span>
    <h2>{{ profile.tagline || 'Membangun, lalu menguji.' }}</h2>

    <div class="about-grid">
      <div class="about-text">
        <div
          v-if="profile.aboutHtml"
          class="markdown-body"
          v-html="profile.aboutHtml"
        />
        <p v-else>
          {{ profile.headline || 'Frontend Developer & QA Tester' }}
        </p>

        <!-- Tautan Unduh Resume bila tersedia -->
        <div v-if="profile.resume?.urls?.original" class="resume-cta">
          <a
            :href="profile.resume.urls.original"
            target="_blank"
            rel="noopener noreferrer"
            class="btn"
          >
            Unduh Resume (PDF)
          </a>
        </div>
      </div>

      <!-- Kartu Fakta Profil -->
      <div v-if="facts && facts.length > 0" class="facts">
        <div
          v-for="(fact, index) in facts"
          :key="fact.label"
          class="card"
          :class="{ y: index % 2 === 1 }"
        >
          <span class="label" :style="index % 2 === 1 ? 'color: var(--ink)' : ''">
            {{ fact.label }}
          </span>
          <h3>{{ fact.value }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: start;
  margin-top: 24px;
}

.about-text {
  font-size: 17px;
}

.resume-cta {
  margin-top: 32px;
}

.facts {
  display: grid;
  gap: 16px;
}

@media (max-width: 860px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}
</style>
