<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MESSAGE_STATUSES } from '@bunn/shared'
import type { MessageStatus } from '@bunn/shared'
import { useAdminApi } from '~/composables/useAdminApi'
import type { AdminMessage } from '~/composables/useAdminApi'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const adminApi = useAdminApi()

const messages = ref<AdminMessage[]>([])
const isLoading = ref(true)
const selectedStatus = ref<string>('')
const statusMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

// Detail Modal
const activeMessage = ref<AdminMessage | null>(null)
const isDetailOpen = ref(false)

const loadMessages = async () => {
  isLoading.value = true
  try {
    const res = await adminApi.getMessages({
      status: selectedStatus.value || undefined,
      perPage: 50,
    })
    messages.value = res.data || []
  } catch (err) {
    console.error('Gagal mengambil pesan kontak:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadMessages()
})

const showMessage = (type: 'success' | 'error', text: string) => {
  statusMessage.value = { type, text }
  setTimeout(() => {
    if (statusMessage.value?.text === text) statusMessage.value = null
  }, 4000)
}

const openMessage = async (msg: AdminMessage) => {
  activeMessage.value = msg
  isDetailOpen.value = true

  // Jika pesan berstatus 'new', otomatis tandai sebagai 'read'
  if (msg.status === 'new') {
    try {
      await adminApi.updateMessageStatus(msg.id, 'read')
      msg.status = 'read'
    } catch (err) {
      console.error(err)
    }
  }
}

const handleStatusChange = async (newStatus: MessageStatus) => {
  if (!activeMessage.value) return
  try {
    await adminApi.updateMessageStatus(activeMessage.value.id, newStatus)
    activeMessage.value.status = newStatus
    showMessage('success', `Status pesan diubah ke "${newStatus}".`)
    await loadMessages()
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    showMessage('error', errorObj.data?.error?.message || 'Gagal mengubah status pesan.')
  }
}

const handleDeleteMessage = async () => {
  if (!activeMessage.value) return
  if (!confirm(`Hapus pesan dari "${activeMessage.value.name}"?`)) return

  try {
    await adminApi.deleteMessage(activeMessage.value.id)
    isDetailOpen.value = false
    showMessage('success', 'Pesan berhasil dihapus.')
    await loadMessages()
  } catch (err: unknown) {
    const errorObj = err as { data?: { error?: { message?: string } } }
    showMessage('error', errorObj.data?.error?.message || 'Gagal menghapus pesan.')
  }
}

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

useSeoMeta({
  title: 'Kotak Pesan — bunn.my.id',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="messages-admin-page">
    <div class="page-header">
      <div>
        <span class="label">Kotak Masuk</span>
        <h1>Pesan <em>Kontak.</em></h1>
      </div>
    </div>

    <!-- Alert Status -->
    <div
      v-if="statusMessage"
      class="alert-bar"
      :class="statusMessage.type === 'success' ? 'alert--success' : 'alert--error'"
      role="alert"
    >
      {{ statusMessage.text }}
    </div>

    <!-- Filter Status Tabs -->
    <div class="admin-tab-bar">
      <button
        type="button"
        class="admin-tab-btn"
        :class="{ 'admin-tab-btn--active': selectedStatus === '' }"
        @click="selectedStatus = ''; loadMessages()"
      >
        Semua Pesan
      </button>
      <button
        v-for="st in MESSAGE_STATUSES"
        :key="st"
        type="button"
        class="admin-tab-btn"
        :class="{ 'admin-tab-btn--active': selectedStatus === st }"
        @click="selectedStatus = st; loadMessages()"
      >
        {{ st === 'new' ? 'Baru' : st === 'read' ? 'Dibaca' : st === 'archived' ? 'Arsip' : 'Spam' }}
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
      <p>Memuat pesan kontak...</p>
    </div>

    <!-- Daftar Pesan -->
    <div v-else-if="messages.length > 0" class="messages-list card">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message-row"
        :class="{ 'message-row--new': msg.status === 'new' }"
        role="button"
        tabindex="0"
        @click="openMessage(msg)"
        @keydown.enter="openMessage(msg)"
      >
        <div class="msg-status-indicator">
          <span v-if="msg.status === 'new'" class="unread-dot" title="Pesan baru" />
        </div>

        <div class="msg-sender">
          <strong>{{ msg.name }}</strong>
          <small>{{ msg.email }}</small>
        </div>

        <div class="msg-preview">
          <strong class="msg-subject">{{ msg.subject || '(Tanpa Subjek)' }}</strong>
          <span class="msg-snippet"> — {{ msg.body }}</span>
        </div>

        <div class="msg-date">
          {{ formatDate(msg.createdAt) }}
        </div>
      </div>
    </div>

    <div v-else class="empty-state card">
      <h3>Kotak pesan kosong</h3>
      <p>Tidak ada pesan kontak untuk kategori status yang dipilih.</p>
    </div>

    <!-- Modal Detail Pesan -->
    <Teleport to="body">
      <div
        v-if="isDetailOpen && activeMessage"
        class="modal-backdrop"
        @click.self="isDetailOpen = false"
      >
        <div class="modal-card">
          <div class="modal-header">
            <h3>{{ activeMessage.subject || 'Pesan Kontak' }}</h3>
            <button
              type="button"
              class="close-btn"
              @click="isDetailOpen = false"
            >
              ✕
            </button>
          </div>

          <div class="modal-body">
            <div class="msg-meta-box">
              <p>Pengirim: <strong>{{ activeMessage.name }}</strong></p>
              <p>Email: <a :href="`mailto:${activeMessage.email}`" class="mail-link">{{ activeMessage.email }}</a></p>
              <p>Waktu Masuk: <strong>{{ formatDate(activeMessage.createdAt) }}</strong></p>
              <p>Status: <span class="status-pill">{{ activeMessage.status }}</span></p>
            </div>

            <div class="msg-body-content">
              <h4>Isi Pesan:</h4>
              <div class="body-text">{{ activeMessage.body }}</div>
            </div>

            <!-- Tombol Aksi Status & Hapus -->
            <div class="msg-action-bar">
              <div class="status-switchers">
                <button
                  v-if="activeMessage.status !== 'new'"
                  type="button"
                  class="btn"
                  @click="handleStatusChange('new')"
                >
                  Tandai Belum Dibaca
                </button>
                <button
                  v-if="activeMessage.status !== 'archived'"
                  type="button"
                  class="btn"
                  @click="handleStatusChange('archived')"
                >
                  Arsipkan
                </button>
                <button
                  v-if="activeMessage.status !== 'spam'"
                  type="button"
                  class="btn"
                  @click="handleStatusChange('spam')"
                >
                  Tandai Spam
                </button>
              </div>

              <button
                type="button"
                class="btn action-btn-del"
                @click="handleDeleteMessage"
              >
                Hapus Pesan
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 34px;
}

.alert-bar {
  padding: 12px 18px;
  border: 2px solid var(--ink);
  border-radius: 10px;
  font-weight: 700;
  margin-bottom: 24px;
}

.alert--success {
  background: #d4edda;
  color: #155724;
}

.alert--error {
  background: #f8d7da;
  color: #721c24;
}

.admin-tab-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.admin-tab-btn {
  padding: 10px 18px;
  border: 2px solid var(--ink);
  border-radius: 10px;
  background: var(--paper);
  font-family: var(--sans);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

.admin-tab-btn--active {
  background: var(--yellow) !important;
  box-shadow: 2px 2px 0 var(--ink);
}

.messages-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-row {
  display: grid;
  grid-template-columns: 24px 220px 1fr 180px;
  gap: 16px;
  align-items: center;
  padding: 14px 18px;
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.1s ease;
}

.message-row:hover {
  transform: translate(2px, 2px);
}

.message-row--new {
  background: #fff8e8;
  font-weight: 700;
  border-color: var(--red);
}

.unread-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--red);
}

.msg-sender {
  display: flex;
  flex-direction: column;
}

.msg-sender strong {
  font-size: 15px;
}

.msg-sender small {
  color: var(--muted);
  font-size: 13px;
}

.msg-preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
}

.msg-subject {
  color: var(--ink);
}

.msg-snippet {
  color: var(--muted);
}

.msg-date {
  font-size: 12px;
  color: var(--muted);
  text-align: right;
}

.empty-state {
  text-align: center;
  padding: 48px;
}

/* Modal Detail */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(42, 31, 27, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  max-width: 640px;
  width: 100%;
  background: var(--paper);
  border: 3px solid var(--ink);
  border-radius: 16px;
  box-shadow: 8px 8px 0 var(--ink);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 2px solid var(--ink);
  background: var(--cream);
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.msg-meta-box {
  padding: 14px 18px;
  background: var(--cream);
  border: 1.5px solid var(--ink);
  border-radius: 10px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mail-link {
  color: var(--red);
  font-weight: 700;
  text-decoration: underline;
}

.status-pill {
  display: inline-block;
  padding: 2px 8px;
  background: var(--yellow);
  border: 1px solid var(--ink);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.msg-body-content h4 {
  font-size: 16px;
  margin-bottom: 8px;
}

.body-text {
  padding: 16px;
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: 10px;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.msg-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 2px solid var(--ink);
}

.status-switchers {
  display: flex;
  gap: 8px;
}

.action-btn-del {
  background: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .message-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .msg-date {
    text-align: left;
  }

  .msg-action-bar {
    flex-direction: column;
    gap: 12px;
  }
}
</style>

