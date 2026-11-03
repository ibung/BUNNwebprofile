<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { PublicProfile, PublicSocialLink, PublicSiteSettings } from '@bunn/shared'
import { usePublicApi } from '~/composables/usePublicApi'

defineProps<{
  profile: PublicProfile
  socials: PublicSocialLink[]
  settings: PublicSiteSettings
}>()

const publicApi = usePublicApi()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  body: '',
  website: '', // Honeypot trap
})

const isSubmitting = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const handleSubmit = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  successMessage.value = null
  errorMessage.value = null

  try {
    const res = await publicApi.submitContact({
      name: form.name,
      email: form.email,
      subject: form.subject || undefined,
      body: form.body,
      website: form.website,
    })

    successMessage.value = res.message || 'Pesan berhasil terkirim. Terima kasih!'
    form.name = ''
    form.email = ''
    form.subject = ''
    form.body = ''
    form.website = ''
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    errorMessage.value =
      errorObj.data?.error?.message ||
      'Terjadi kesalahan saat mengirim pesan. Silakan coba kembali nanti.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section id="kontak" class="contact on-red">
    <span class="label">Kontak</span>
    <h2>Ayo <em>ngobrol.</em></h2>
    <p class="contact-lead">
      Punya proyek atau kesempatan kerja sama? Kirim pesan lewat formulir di bawah atau hubungi saya langsung.
    </p>

    <div class="contact-layout">
      <!-- Formulir Kontak -->
      <div v-if="settings.contactFormEnabled" class="form-container">
        <form class="contact-form" @submit.prevent="handleSubmit">
          <!-- Honeypot Bot Trap -->
          <input
            v-model="form.website"
            type="text"
            name="website"
            class="hp-field"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          >

          <div class="form-group">
            <label for="name">Nama <span class="req">*</span></label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Nama lengkap Anda"
              :disabled="isSubmitting"
            >
          </div>

          <div class="form-group">
            <label for="email">Email <span class="req">*</span></label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="nama@domain.com"
              :disabled="isSubmitting"
            >
          </div>

          <div class="form-group">
            <label for="subject">Subjek</label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              placeholder="Perihal pesan"
              :disabled="isSubmitting"
            >
          </div>

          <div class="form-group">
            <label for="body">Pesan <span class="req">*</span></label>
            <textarea
              id="body"
              v-model="form.body"
              rows="4"
              required
              placeholder="Tulis pesan Anda di sini..."
              :disabled="isSubmitting"
            />
          </div>

          <!-- Pesan Status -->
          <div v-if="successMessage" class="alert alert--success" role="alert">
            ✓ {{ successMessage }}
          </div>

          <div v-if="errorMessage" class="alert alert--error" role="alert">
            ⚠ {{ errorMessage }}
          </div>

          <button type="submit" class="btn y" :disabled="isSubmitting">
            <span v-if="isSubmitting">Mengirim pesan...</span>
            <span v-else>Kirim Pesan</span>
          </button>
        </form>
      </div>

      <!-- Tautan Langsung & Sosial -->
      <div class="links-container">
        <h3 class="links-heading">Tautan Langsung</h3>
        <div class="links">
          <a
            v-if="profile.emailPublic"
            :href="`mailto:${profile.emailPublic}`"
            class="btn y"
          >
            ✉ {{ profile.emailPublic }}
          </a>

          <a
            v-for="s in socials"
            :key="s.platform + s.url"
            :href="s.url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn"
          >
            {{ s.label }} ↗
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  background: var(--red);
  color: var(--cream);
  text-align: left;
}

.contact h2 {
  color: var(--cream);
  font-size: clamp(48px, 8vw, 110px);
}

.contact-lead {
  max-width: 34em;
  margin-top: 16px;
  color: #fbe9d6;
  font-size: 19px;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  margin-top: 48px;
  align-items: start;
}

.contact-form {
  background: var(--paper);
  border: 3px solid var(--ink);
  border-radius: 18px;
  box-shadow: 10px 10px 0 var(--ink);
  padding: 32px;
  color: var(--ink);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hp-field {
  display: none !important;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 700;
  font-size: 14px;
  color: var(--ink);
}

.req {
  color: var(--red);
}

.form-group input,
.form-group textarea {
  border: 2px solid var(--ink);
  border-radius: 10px;
  padding: 12px 16px;
  background: var(--cream);
  font-family: var(--sans);
  font-size: 16px;
  color: var(--ink);
  width: 100%;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  background: var(--paper);
  box-shadow: 3px 3px 0 var(--ink);
}

.alert {
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid var(--ink);
  font-weight: 700;
  font-size: 15px;
}

.alert--success {
  background: #d4edda;
  color: #155724;
}

.alert--error {
  background: #f8d7da;
  color: #721c24;
}

.links-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.links-heading {
  font-size: 26px;
  color: var(--cream);
}

.links {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-start;
}

@media (max-width: 860px) {
  .contact-layout {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}
</style>
