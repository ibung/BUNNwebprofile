<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminAuth } from '~/composables/useAdminAuth'

definePageMeta({
  layout: false, // Tidak menggunakan layout sidebar admin
})

const router = useRouter()
const route = useRoute()
const { login } = useAdminAuth()

const form = reactive({
  email: '',
  password: '',
})

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const handleLogin = async () => {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = null

  try {
    await login({
      email: form.email,
      password: form.password,
    })

    const redirectPath = (route.query.redirect as string) || '/admin'
    await router.push(redirectPath)
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    errorMessage.value =
      errorObj.data?.error?.message || 'Email atau kata sandi salah.'
  } finally {
    isLoading.value = false
  }
}

useSeoMeta({
  title: 'Masuk Panel Admin — bunn.my.id',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="login-page">
    <div class="card login-card">
      <div class="login-header">
        <span class="label">Panel Pengelola</span>
        <h1>Admin <em>Login.</em></h1>
        <p class="login-sub">Masuk untuk mengelola portofolio bunn.my.id</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div v-if="errorMessage" class="alert-error" role="alert">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            placeholder="admin@domain.com"
            :disabled="isLoading"
          >
        </div>

        <div class="form-group">
          <label for="password">Kata Sandi</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••••••"
            :disabled="isLoading"
          >
        </div>

        <button type="submit" class="btn y submit-btn" :disabled="isLoading">
          <span v-if="isLoading">Memeriksa kredensial...</span>
          <span v-else>Masuk ke Panel Admin →</span>
        </button>
      </form>

      <div class="login-footer">
        <NuxtLink to="/" class="back-home">
          ← Kembali ke Situs Publik
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  padding: 24px;
}

.login-card {
  max-width: 440px;
  width: 100%;
  padding: 40px;
  background: var(--paper);
  border: 3px solid var(--ink);
  border-radius: 18px;
  box-shadow: 10px 10px 0 var(--ink);
}

.login-header h1 {
  font-size: 36px;
  margin: 6px 0 8px;
}

.login-sub {
  font-size: 15px;
  color: var(--muted);
  margin-bottom: 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
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

.form-group input {
  border: 2px solid var(--ink);
  border-radius: 10px;
  padding: 12px 14px;
  background: var(--cream);
  font-family: var(--sans);
  font-size: 15px;
  color: var(--ink);
}

.form-group input:focus {
  outline: none;
  box-shadow: 3px 3px 0 var(--ink);
  background: var(--paper);
}

.alert-error {
  background: #f8d7da;
  color: #721c24;
  border: 2px solid var(--ink);
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
}

.submit-btn {
  margin-top: 10px;
  width: 100%;
}

.login-footer {
  margin-top: 28px;
  text-align: center;
  padding-top: 20px;
  border-top: 1.5px dashed var(--ink);
}

.back-home {
  font-size: 14px;
  font-weight: 700;
  color: var(--muted);
  text-decoration: none;
}

.back-home:hover {
  color: var(--red);
  text-decoration: underline;
}
</style>
