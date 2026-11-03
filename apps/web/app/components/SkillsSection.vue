<script setup lang="ts">
import type { PublicSkillCategory, PublicHighlight } from '@bunn/shared'

defineProps<{
  categories: PublicSkillCategory[]
  highlights?: PublicHighlight[]
}>()
</script>

<template>
  <section v-if="categories && categories.length > 0" id="keahlian" class="skills">
    <span class="label">Keahlian</span>
    <h2>Alat <em>pendukung.</em></h2>
    <p class="sub">
      Teknologi, pustaka, dan perangkat yang biasa saya gunakan dalam proses pengembangan dan pengujian.
    </p>

    <div class="skills-grid">
      <!-- Kartu Kategori Skill -->
      <div
        v-for="cat in categories"
        :key="cat.slug"
        class="card"
        :class="{ y: cat.accent === 'yellow' }"
      >
        <span class="label" :style="cat.accent === 'yellow' ? 'color: var(--ink)' : ''">
          {{ cat.name }}
        </span>
        <p v-if="cat.description" class="cat-desc">{{ cat.description }}</p>

        <div class="pills-container">
          <NuxtLink
            v-for="s in cat.skills"
            :key="s.slug"
            :to="`/skills/${s.slug}`"
            class="pill"
          >
            {{ s.name }}
          </NuxtLink>
        </div>
      </div>

      <!-- Kartu Sorotan Angka (Highlights) -->
      <div
        v-for="(h, idx) in highlights"
        :key="h.id"
        class="card"
        :class="{ y: idx % 2 === 1 }"
      >
        <span class="label" :style="idx % 2 === 1 ? 'color: var(--ink)' : ''">
          Dalam angka
        </span>
        <div class="big">{{ h.value }}</div>
        <p>{{ h.label }}</p>
        <small v-if="h.note" class="highlight-note">{{ h.note }}</small>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills {
  background: var(--ink);
  color: var(--cream);
}

.skills .card {
  background: var(--cream);
  color: var(--ink);
  box-shadow: 7px 7px 0 var(--red);
}

.skills .card.y {
  background: var(--yellow);
  box-shadow: 7px 7px 0 var(--yellow);
}

.skills h2 {
  color: var(--cream);
}

.skills > p.sub {
  color: #cdbfb0;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
}

.cat-desc {
  font-size: 14px;
  margin: 6px 0 12px;
}

.pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.highlight-note {
  display: block;
  font-size: 13px;
  color: var(--muted);
  margin-top: 6px;
}
</style>
