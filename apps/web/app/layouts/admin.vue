<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminAuth } from '~/composables/useAdminAuth'

const route = useRoute()
const { user, logout } = useAdminAuth()

const isMobileNavOpen = ref(false)

const navLinks = [
  { label: 'Dasbor', to: '/admin', icon: '📊' },
  { label: 'Profil', to: '/admin/profile', icon: '👤' },
  { label: 'Proyek', to: '/admin/projects', icon: '💼' },
  { label: 'Keahlian', to: '/admin/skills', icon: '⚡' },
  { label: 'Perjalanan', to: '/admin/experiences', icon: '🗺️' },
  { label: 'Pustaka Media', to: '/admin/media', icon: '🖼️' },
  { label: 'Kotak Pesan', to: '/admin/messages', icon: '✉️' },
  { label: 'Pengaturan', to: '/admin/settings', icon: '⚙️' },
]

const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="admin-wrapper">
    <!-- Overlay backdrop untuk mobile drawer -->
    <div
      v-if="isMobileNavOpen"
      class="nav-backdrop"
      @click="isMobileNavOpen = false"
    />

    <!-- Sidebar Admin -->
    <aside class="sidebar" :class="{ 'sidebar--open': isMobileNavOpen }">
      <div class="sidebar-header">
        <NuxtLink to="/admin" class="sidebar-logo">
          BUNN <span>CMS</span>
        </NuxtLink>
        <button
          type="button"
          class="sidebar-close-btn"
          aria-label="Tutup menu"
          @click="isMobileNavOpen = false"
        >
          ✕
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="nav-item"
              :class="{ 'nav-item--active': isActive(link.to) }"
              @click="isMobileNavOpen = false"
            >
              <span class="nav-icon">{{ link.icon }}</span>
              <span>{{ link.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="user-badge">
          <small>Masuk sebagai:</small>
          <strong>{{ user?.email || 'admin' }}</strong>
        </div>

        <div class="footer-actions">
          <NuxtLink to="/" target="_blank" class="preview-site-link">
            Lihat Situs ↗
          </NuxtLink>
          <button type="button" class="logout-btn" @click="logout">
            Keluar
          </button>
        </div>
      </div>
    </aside>

    <!-- Area Konten Utama -->
    <div class="main-column">
      <header class="topbar">
        <button
          type="button"
          class="mobile-menu-btn"
          aria-label="Buka menu navigasi"
          @click="isMobileNavOpen = true"
        >
          ☰ Menu
        </button>

        <div class="topbar-right">
          <NuxtLink to="/" target="_blank" class="topbar-site-link">
            🌐 Buka Situs Publik ↗
          </NuxtLink>
          <button type="button" class="topbar-logout" @click="logout">
            Keluar
          </button>
        </div>
      </header>

      <main class="page-body">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-wrapper {
  display: flex;
  min-height: 100vh;
  background: var(--cream);
  color: var(--ink);
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: var(--ink);
  color: var(--cream);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 50;
  border-right: 2.5px solid var(--ink);
}

.sidebar-header {
  padding: 24px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1.5px solid rgba(246, 237, 224, 0.15);
}

.sidebar-logo {
  font-family: var(--serif);
  font-weight: 900;
  font-size: 24px;
  color: var(--cream);
  text-decoration: none;
}

.sidebar-logo span {
  color: var(--yellow);
  font-size: 16px;
  background: rgba(242, 184, 75, 0.15);
  padding: 2px 8px;
  border-radius: 6px;
  margin-left: 4px;
}

.sidebar-close-btn {
  display: none;
  background: none;
  border: none;
  color: var(--cream);
  font-size: 20px;
  cursor: pointer;
}

.sidebar-nav {
  flex-grow: 1;
  padding: 20px 12px;
  overflow-y: auto;
}

.sidebar-nav ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 15px;
  color: var(--cream);
  text-decoration: none;
  transition: all 0.12s ease;
}

.nav-item:hover {
  background: rgba(246, 237, 224, 0.1);
  color: var(--yellow);
}

.nav-item--active {
  background: var(--yellow) !important;
  color: var(--ink) !important;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
}

.nav-icon {
  font-size: 18px;
}

.sidebar-footer {
  padding: 20px 16px;
  border-top: 1.5px solid rgba(246, 237, 224, 0.15);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-badge small {
  display: block;
  font-size: 11px;
  color: #cdbfb0;
}

.user-badge strong {
  display: block;
  font-size: 13px;
  word-break: break-all;
}

.footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-site-link {
  font-size: 13px;
  font-weight: 700;
  color: var(--yellow);
}

.logout-btn {
  background: none;
  border: none;
  color: #ff8b73;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.logout-btn:hover {
  text-decoration: underline;
}

/* Kolom Utama */
.main-column {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 28px;
  background: var(--paper);
  border-bottom: 2px solid var(--ink);
}

.mobile-menu-btn {
  display: none;
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: 8px;
  padding: 6px 12px;
  font-weight: 700;
  cursor: pointer;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.topbar-site-link {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  padding: 6px 12px;
  border: 1.5px solid var(--ink);
  border-radius: 8px;
  background: var(--cream);
}

.topbar-site-link:hover {
  background: var(--yellow);
}

.topbar-logout {
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 700;
  color: var(--red);
  cursor: pointer;
}

.page-body {
  flex-grow: 1;
  padding: 32px 28px 64px;
}

/* Responsif Mobile & Tablet */
@media (max-width: 860px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: -280px;
    transition: transform 0.25s ease;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.4);
  }

  .sidebar--open {
    transform: translateX(280px);
  }

  .sidebar-close-btn {
    display: block;
  }

  .mobile-menu-btn {
    display: block;
  }

  .nav-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 45;
  }

  .page-body {
    padding: 20px 16px 48px;
  }
}
</style>
