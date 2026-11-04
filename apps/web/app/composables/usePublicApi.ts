import type {
  ApiSuccess,
  PublicHomeData,
  PublicProjectDetail,
  PublicProjectItem,
  PublicSiteSettings,
  PublicSkillDetail,
} from '@bunn/shared'

export interface ContactPayload {
  name: string
  email: string
  subject?: string
  body: string
  website?: string // Honeypot trap (harus kosong)
}

/**
 * usePublicApi — composable untuk memanggil endpoint publik API.
 * SSR: Nitro memanggil langsung ke NUXT_API_INTERNAL_URL (lebih cepat, satu hop).
 * Browser: path relatif /api/... → proxy Nuxt → AdonisJS.
 */
export function usePublicApi() {
  const config = useRuntimeConfig()

  /**
   * Base URL:
   * - Server side: URL internal Docker (http://api:3333 atau localhost:3333)
   * - Client side: '' → path relatif, browser memakai origin yang sama
   */
  const baseURL = import.meta.server
    ? (config.apiInternalUrl as string) || 'http://localhost:3333'
    : ''

  const apiFetch = $fetch.create({ baseURL })

  /** Mengambil seluruh data beranda */
  const getHome = async (): Promise<PublicHomeData> => {
    const res = await apiFetch<ApiSuccess<PublicHomeData>>('/api/public/home')
    return res.data
  }

  /** Mengambil pengaturan situs publik (metadata, favicon, footer, dll) */
  const getSettings = async (): Promise<PublicSiteSettings> => {
    const res = await apiFetch<ApiSuccess<PublicSiteSettings>>('/api/public/settings')
    return res.data
  }

  /** Mengambil daftar proyek terbit dengan filter opsional */
  const getProjects = async (params?: {
    featured?: boolean
    skill?: string
    page?: number
    perPage?: number
  }): Promise<ApiSuccess<PublicProjectItem[]>> => {
    const query: Record<string, string | number> = {}
    if (params?.featured !== undefined) {
      query.featured = params.featured ? 'true' : 'false'
    }
    if (params?.skill) {
      query.skill = params.skill
    }
    if (params?.page) {
      query.page = params.page
    }
    if (params?.perPage) {
      query.perPage = params.perPage
    }

    return await apiFetch<ApiSuccess<PublicProjectItem[]>>('/api/public/projects', {
      query,
    })
  }

  /** Mengambil detail satu proyek berdasarkan slug */
  const getProject = async (slug: string): Promise<PublicProjectDetail> => {
    const res = await apiFetch<ApiSuccess<PublicProjectDetail>>(`/api/public/projects/${slug}`)
    return res.data
  }

  /** Mengambil detail satu skill berdasarkan slug */
  const getSkill = async (slug: string): Promise<PublicSkillDetail> => {
    const res = await apiFetch<ApiSuccess<PublicSkillDetail>>(`/api/public/skills/${slug}`)
    return res.data
  }

  /** Mengirim pesan formulir kontak */
  const submitContact = async (payload: ContactPayload): Promise<{ message: string }> => {
    const res = await apiFetch<ApiSuccess<{ message: string }>>('/api/public/contact', {
      method: 'POST',
      body: payload,
    })
    return res.data
  }

  return {
    apiFetch,
    getHome,
    getSettings,
    getProjects,
    getProject,
    getSkill,
    submitContact,
  }
}
