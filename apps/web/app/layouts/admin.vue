<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminAuth } from '~/composables/useAdminAuth'

const route = useRoute()
const { user, logout } = useAdminAuth()

const isMobileNavOpen = ref(false)

const navLinks = [
  { label: 'Dasbor', to: '/admin', icon: 'dashboard' },
  { label: 'Profil', to: '/admin/profile', icon: 'profile' },
  { label: 'Proyek', to: '/admin/projects', icon: 'projects' },
  { label: 'Keahlian', to: '/admin/skills', icon: 'skills' },
  { label: 'Perjalanan', to: '/admin/experiences', icon: 'experiences' },
  { label: 'Pustaka Media', to: '/admin/media', icon: 'media' },
  { label: 'Kotak Pesan', to: '/admin/messages', icon: 'messages' },
  { label: 'Pengaturan', to: '/admin/settings', icon: 'settings' },
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
              <span class="nav-icon">
                <svg v-if="link.icon === 'dashboard'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                <svg v-else-if="link.icon === 'profile'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <svg v-else-if="link.icon === 'projects'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <svg v-else-if="link.icon === 'skills'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <svg v-else-if="link.icon === 'experiences'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                <svg v-else-if="link.icon === 'media'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                <svg v-else-if="link.icon === 'messages'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <svg v-else-if="link.icon === 'settings'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </span>
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
            <svg class="topbar-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            <span>Buka Situs Publik ↗</span>
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.svg-icon {
  width: 18px;
  height: 18px;
  stroke-linecap: round;
  stroke-linejoin: round;
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
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  padding: 6px 12px;
  border: 1.5px solid var(--ink);
  border-radius: 8px;
  background: var(--cream);
}

.topbar-svg {
  width: 16px;
  height: 16px;
  stroke-linecap: round;
  stroke-linejoin: round;
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
