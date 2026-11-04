import { ref } from 'vue'

export type AdminToastType = 'success' | 'error' | 'warning' | 'info'

export interface AdminToastState {
  isOpen: boolean
  type: AdminToastType
  title: string
  message: string
  details: string[]
  duration: number
}

const toastState = ref<AdminToastState>({
  isOpen: false,
  type: 'info',
  title: '',
  message: '',
  details: [],
  duration: 3000,
})

let dismissTimer: ReturnType<typeof setTimeout> | null = null

export function useAdminToast() {
  const show = (options: {
    type?: AdminToastType
    title?: string
    message: string
    details?: string[]
    duration?: number
  }) => {
    if (dismissTimer) {
      clearTimeout(dismissTimer)
      dismissTimer = null
    }

    const type = options.type || 'info'
    const defaultTitle =
      type === 'success'
        ? 'Berhasil!'
        : type === 'error'
          ? 'Terjadi Kendala'
          : type === 'warning'
            ? 'Perhatian'
            : 'Pemberitahuan'

    toastState.value = {
      isOpen: true,
      type,
      title: options.title || defaultTitle,
      message: options.message,
      details: options.details || [],
      duration: options.duration ?? 3000,
    }

    if (toastState.value.duration > 0) {
      dismissTimer = setTimeout(() => {
        close()
      }, toastState.value.duration)
    }
  }

  const success = (message: string, title?: string, duration = 3000) => {
    show({ type: 'success', title: title || 'Berhasil!', message, duration })
  }

  const error = (message: string, details?: string[], title?: string, duration = 3500) => {
    show({ type: 'error', title: title || 'Terjadi Kendala', message, details, duration })
  }

  const warning = (message: string, title?: string, duration = 3000) => {
    show({ type: 'warning', title: title || 'Perhatian', message, duration })
  }

  const info = (message: string, title?: string, duration = 3000) => {
    show({ type: 'info', title: title || 'Informasi', message, duration })
  }

  const close = () => {
    if (dismissTimer) {
      clearTimeout(dismissTimer)
      dismissTimer = null
    }
    toastState.value.isOpen = false
  }

  return {
    state: toastState,
    show,
    success,
    error,
    warning,
    info,
    close,
  }
}
