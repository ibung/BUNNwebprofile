<script setup lang="ts">
import { usePublicApi } from '~/composables/usePublicApi'
import HeroSection from '~/components/HeroSection.vue'
import AboutSection from '~/components/AboutSection.vue'
import ProjectsSection from '~/components/ProjectsSection.vue'
import SkillsSection from '~/components/SkillsSection.vue'
import TimelineSection from '~/components/TimelineSection.vue'
import ContactSection from '~/components/ContactSection.vue'
import TheFooter from '~/components/TheFooter.vue'

const publicApi = usePublicApi()

const { data: homeData, error } = await useAsyncData('public-home', () =>
  publicApi.getHome()
)

if (homeData.value) {
  const siteTitle =
    homeData.value.settings.siteTitle || 'Ibnu Hilmi Athaillah — Portofolio'
  const metaDescription =
    homeData.value.settings.metaDescription ||
    homeData.value.profile.headline ||
    'Portofolio Ibnu Hilmi Athaillah: Frontend Developer & QA Tester.'

  useSeoMeta({
    title: siteTitle,
    description: metaDescription,
    ogTitle: siteTitle,
    ogDescription: metaDescription,
    ogType: 'website',
    ogImage:
      homeData.value.settings.ogImage?.urls?.original ||
      homeData.value.profile.avatar?.urls?.original,
    twitterCard: 'summary_large_image',
    twitterTitle: siteTitle,
    twitterDescription: metaDescription,
  })
}
</script>

<template>
  <div v-if="homeData" class="page-home">
    <HeroSection
      :profile="homeData.profile"
      :site-title="homeData.settings.siteTitle"
    />

    <AboutSection
      :profile="homeData.profile"
      :facts="homeData.facts"
      :highlights="homeData.highlights.about"
      :settings="homeData.settings"
    />

    <ProjectsSection
      :projects="homeData.featuredProjects"
      :settings="homeData.settings"
    />

    <SkillsSection
      :categories="homeData.skillCategories"
      :highlights="homeData.highlights.skills"
      :settings="homeData.settings"
    />

    <TimelineSection
      :experiences="homeData.experiences"
      :settings="homeData.settings"
    />

    <ContactSection
      :profile="homeData.profile"
      :socials="homeData.socials"
      :settings="homeData.settings"
    />

    <TheFooter
      :footer-text="homeData.settings.footerText"
      :site-title="homeData.settings.siteTitle || homeData.profile.fullName"
    />
  </div>

  <div v-else-if="error" class="error-screen wrap">
    <h1>Gagal memuat data</h1>
    <p>Terjadi kendala saat mengambil data portofolio dari server.</p>
  </div>
</template>

<style scoped>
.error-screen {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 16px;
}
</style>
