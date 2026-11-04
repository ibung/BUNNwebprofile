<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useAdminToast } from '~/composables/useAdminToast'

const { state, close } = useAdminToast()

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && state.value.isOpen) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="toast-modal-fade">
      <div
        v-if="state.isOpen"
        class="toast-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="toast-title"
        @click.self="close"
      >
        <div
          class="toast-modal"
          :class="'toast-modal--' + state.type"
        >
          <!-- Tombol Close Silang -->
          <button
            type="button"
            class="toast-close-btn"
            aria-label="Tutup notifikasi"
            @click="close"
          >
            ✕
          </button>

          <!-- Header Modal -->
          <div class="toast-header">
            <div class="toast-icon-wrap" :class="'icon--' + state.type">
              <!-- Success: Checkmark -->
              <svg
                v-if="state.type === 'success'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="toast-svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>

              <!-- Error: Cross / Alert -->
              <svg
                v-else-if="state.type === 'error'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="toast-svg"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>

              <!-- Warning / Info: Exclamation / Info -->
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="toast-svg"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <div class="toast-heading-group">
              <span class="toast-badge">{{ state.type === 'success' ? 'SUKSES' : state.type === 'error' ? 'GAGAL' : 'INFO' }}</span>
              <h3 id="toast-title" class="toast-title">
                {{ state.title }}
              </h3>
            </div>
          </div>

          <!-- Body Pesan -->
          <div class="toast-body">
            <p class="toast-message">
              {{ state.message }}
            </p>

            <ul v-if="state.details && state.details.length > 0" class="toast-details-list">
              <li v-for="(detail, idx) in state.details" :key="idx">
                {{ detail }}
              </li>
            </ul>
          </div>

          <!-- Footer Modal -->
          <div class="toast-footer">
            <span class="toast-timer-hint">Auto-tutup dalam 3 detik (atau klik di luar)</span>
            <button
              type="button"
              class="toast-action-btn"
              @click="close"
            >
              Tutup
            </button>
          </div>

          <!-- Progress Countdown Bar -->
          <div
            v-if="state.duration > 0"
            class="toast-progress-bar"
            :style="{ animationDuration: state.duration + 'ms' }"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 16, 15, 0.55);
  backdrop-filter: blur(2px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.toast-modal {
  background: var(--cream);
  border: 3px solid var(--ink);
  border-radius: 14px;
  box-shadow: 6px 6px 0 var(--ink);
  width: 100%;
  max-width: 480px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: toast-modal-pop 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-modal--success {
  border-color: var(--ink);
}

.toast-modal--error {
  border-color: var(--ink);
}

.toast-close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: 2px solid transparent;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 900;
  color: var(--ink);
  cursor: pointer;
  transition: all 0.12s ease;
}

.toast-close-btn:hover {
  background: rgba(20, 16, 15, 0.08);
  border-color: var(--ink);
}

.toast-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toast-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2.5px solid var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 2px 2px 0 var(--ink);
}

.icon--success {
  background: #22c55e;
  color: #ffffff;
}

.icon--error {
  background: #ef4444;
  color: #ffffff;
}

.icon--warning,
.icon--info {
  background: var(--yellow);
  color: var(--ink);
}

.toast-svg {
  width: 24px;
  height: 24px;
}

.toast-heading-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toast-badge {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

.toast-title {
  font-family: var(--serif);
  font-size: 22px;
  font-weight: 900;
  color: var(--ink);
  margin: 0;
  line-height: 1.2;
}

.toast-body {
  font-size: 15px;
  line-height: 1.5;
  color: var(--ink);
}

.toast-message {
  margin: 0;
  font-weight: 600;
}

.toast-details-list {
  margin: 10px 0 0;
  padding-left: 20px;
  font-size: 13px;
  color: #991b1b;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toast-details-list li {
  line-height: 1.4;
}

.toast-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1.5px dashed rgba(20, 16, 15, 0.2);
}

.toast-timer-hint {
  font-size: 11px;
  color: var(--muted);
  font-style: italic;
}

.toast-action-btn {
  background: var(--paper);
  border: 2px solid var(--ink);
  box-shadow: 2px 2px 0 var(--ink);
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 800;
  color: var(--ink);
  cursor: pointer;
  transition: all 0.1s ease;
}

.toast-action-btn:hover {
  background: var(--yellow);
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 var(--ink);
}

.toast-action-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 var(--ink);
}

.toast-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: var(--ink);
  width: 100%;
  animation-name: toast-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes toast-progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

@keyframes toast-modal-pop {
  from {
    transform: scale(0.92);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Transition Backdrop Fade */
.toast-modal-fade-enter-active,
.toast-modal-fade-leave-active {
  transition: opacity 0.18s ease;
}

.toast-modal-fade-enter-from,
.toast-modal-fade-leave-to {
  opacity: 0;
}
</style>
