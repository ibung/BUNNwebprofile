<script setup lang="ts">
import { computed } from 'vue'
import type { PublicProfile } from '@bunn/shared'
import TheNavbar from './TheNavbar.vue'

const props = defineProps<{
  profile: PublicProfile
  siteTitle?: string
}>()

const avatarUrl = computed(() => {
  const urls = props.profile.avatar?.urls
  return urls?.md || urls?.lg || urls?.original || null
})
</script>

<template>
  <header id="top" class="hero on-red">
    <TheNavbar :brand-name="siteTitle || profile.fullName || 'Ibnu Hilmi Athaillah'" />

    <div class="sun" aria-hidden="true" />

    <div class="hero-left">
      <h1>{{ profile.heroPrefix || 'Halo, saya' }} <em>{{ profile.displayName || 'Ibnu' }}.</em></h1>

      <div
        v-if="profile.heroIntroHtml"
        class="lead markdown-lead"
        v-html="profile.heroIntroHtml"
      />
      <p v-else class="lead">
        {{ profile.headline || 'Frontend Developer & QA Tester' }}
      </p>

      <div class="btns">
        <a class="btn y" href="#proyek">Lihat proyek</a>
        <a class="btn" href="#kontak">Hubungi saya</a>
      </div>
    </div>

    <div class="hero-visual" :class="{ 'has-photo': avatarUrl }">
      <div v-if="avatarUrl" class="portrait">
        <img
          :src="avatarUrl"
          :alt="profile.avatar?.altText || `Foto ${profile.fullName || 'profil'}`"
          :width="profile.avatar?.width ?? undefined"
          :height="profile.avatar?.height ?? undefined"
          fetchpriority="high"
        >
      </div>

      <div class="win" aria-hidden="true">
        <div class="bar">
          <span class="dot" />
          <span class="dot" />
          <span class="dot" />
        </div>
        <div class="body">
          <span class="code"><span>const</span> developer = {</span>
          <span class="code">&nbsp;&nbsp;nama: "{{ profile.fullName || 'Ibnu Hilmi Athaillah' }}",</span>
          <span class="code">&nbsp;&nbsp;peran: "{{ profile.headline || 'Frontend Developer & QA Tester' }}",</span>
          <span class="code">&nbsp;&nbsp;status: "{{ profile.availabilityText || 'Terbuka untuk proyek' }}"</span>
          <span class="code">}<span class="cursor" /></span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero {
  background: var(--red);
  color: var(--cream);
  position: relative;
  overflow: hidden;
  padding: 150px var(--pad) 100px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: center;
  min-height: 100vh;
}

.hero-left {
  position: relative;
  z-index: 2;
}

.hero h1 {
  font-size: clamp(52px, 9vw, 128px);
  color: var(--cream);
}

.lead {
  font-size: clamp(18px, 2vw, 22px);
  max-width: 32em;
  margin: 26px 0 34px;
  color: #fbe9d6;
  line-height: 1.5;
}

:deep(.markdown-lead p) {
  margin: 0;
  font-size: inherit;
  color: inherit;
  line-height: inherit;
}

.btns {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.sun {
  position: absolute;
  right: -80px;
  top: 18%;
  width: min(46vw, 560px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--yellow);
  z-index: 1;
}

.hero-visual {
  position: relative;
  z-index: 2;
}

/* Foto profil: lingkaran kuning ala neo-brutalist, jendela kode menumpuk di bawah-kiri */
.hero-visual.has-photo {
  justify-self: center;
  width: min(100%, 470px);
  padding-bottom: 70px;
}

.portrait {
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--yellow);
  border: 3px solid var(--ink);
  box-shadow: 12px 12px 0 var(--ink);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

/* Foto diletakkan di dasar lingkaran agar ada ruang di atas kepala */
.portrait img {
  display: block;
  width: 80%;
  height: auto;
}

.has-photo .win {
  position: absolute;
  left: -48px;
  bottom: 0;
  width: min(330px, 80%);
  box-shadow: 8px 8px 0 var(--ink);
}

.has-photo .win .body {
  min-height: 0;
  padding: 16px 18px;
  gap: 6px;
}

.has-photo .code {
  font-size: 12px;
}

.win {
  position: relative;
  z-index: 2;
  background: var(--paper);
  border: 3px solid var(--ink);
  border-radius: 18px;
  box-shadow: 12px 12px 0 var(--ink);
  color: var(--ink);
  overflow: hidden;
}

.win .bar {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 13px 16px;
  background: #eadfc8;
  border-bottom: 3px solid var(--ink);
}

.dot {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2px solid var(--ink);
}

.dot:nth-child(1) {
  background: var(--red);
}

.dot:nth-child(2) {
  background: var(--yellow);
}

.dot:nth-child(3) {
  background: var(--green);
}

.win .body {
  padding: 28px;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.code {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 14px;
  color: var(--muted);
}

.code span {
  color: var(--red);
}

.cursor {
  display: inline-block;
  width: 9px;
  height: 1em;
  background: var(--ink);
  vertical-align: -2px;
  animation: blink 1.1s steps(2) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (max-width: 860px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 130px;
    min-height: 0;
  }

  .hero-visual.has-photo {
    width: min(100%, 340px);
    padding-bottom: 0;
  }

  .has-photo .win {
    position: relative;
    left: auto;
    width: 100%;
    margin-top: -36px;
  }
}
</style>
