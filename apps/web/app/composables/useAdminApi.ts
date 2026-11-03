import { useRouter } from 'vue-router'
import { useCookie } from '#imports'
import type {
  ApiSuccess,
  PublishStatus,
  MessageStatus,
  SocialPlatform,
  ExperienceKind,
  HighlightPlacement,
  SkillLevel,
  CategoryAccent,
  PublicMedia,
} from '@bunn/shared'

export type { PublicMedia } from '@bunn/shared'

export interface AdminProfileData {
  id: number
  fullName: string
  heroPrefix?: string | null
  displayName: string | null
  headline: string | null
  tagline: string | null
  heroIntroMd: string | null
  aboutMd: string | null
  location: string | null
  emailPublic: string | null
  phonePublic: string | null
  availabilityText: string | null
  avatarMediaId: number | null
  resumeMediaId: number | null
  avatar?: PublicMedia | null
  resume?: PublicMedia | null
}

export interface AdminSiteSettingsData {
  id: number
  siteTitle: string
  metaDescription: string | null
  ogImageMediaId: number | null
  footerText: string | null
  contactFormEnabled: boolean
  ogImage?: PublicMedia | null
}

export interface AdminProfileFact {
  id: number
  label: string
  value: string
  sortOrder: number
  isVisible: boolean
}

export interface AdminSocialLink {
  id: number
  platform: SocialPlatform
  label: string
  url: string
  mediaId?: number | null
  sortOrder: number
  isVisible: boolean
  media?: PublicMedia | null
}

export interface AdminHighlight {
  id: number
  placement: HighlightPlacement
  value: string
  label: string
  note: string | null
  sortOrder: number
  isVisible: boolean
}

export interface AdminSkillCategory {
  id: number
  name: string
  slug: string
  description: string | null
  accent: CategoryAccent
  sortOrder: number
  isVisible: boolean
  skills?: AdminSkill[]
}

export interface AdminSkill {
  id: number
  categoryId: number
  name: string
  slug: string
  level: SkillLevel | null
  summary: string
  descriptionMd: string | null
  yearsExperience: number | null
  isVisible: boolean
  sortOrder: number
  media?: PublicMedia[]
  category?: AdminSkillCategory
}

export interface AdminProject {
  id: number
  slug: string
  title: string
  summary: string
  descriptionMd: string
  role: string | null
  kind: string | null
  status: PublishStatus
  isFeatured: boolean
  demoUrl: string | null
  repoUrl: string | null
  startedOn: string | null
  endedOn: string | null
  coverMediaId: number | null
  sortOrder: number
  publishedAt: string | null
  coverMedia?: PublicMedia | null
  skills?: AdminSkill[]
  media?: PublicMedia[]
}

export interface AdminExperience {
  id: number
  kind: ExperienceKind
  title: string
  organization: string | null
  descriptionMd: string | null
  startedOn: string
  endedOn: string | null
  sortOrder: number
  isVisible: boolean
  media?: PublicMedia[]
}

export interface AdminMessage {
  id: number
  name: string
  email: string
  subject: string | null
  body: string
  status: MessageStatus
  ipHash: string
  userAgent: string | null
  createdAt: string
  readAt: string | null
}

export interface AdminMediaUsage {
  entity: string
  id: number
  title: string
}

export interface AdminMediaDetail extends PublicMedia {
  storageKey: string | null
  originalName: string | null
  sizeBytes: number | null
  checksumSha256: string | null
  createdAt: string
  usages?: AdminMediaUsage[]
}

export function useAdminApi() {
  const router = useRouter()

  const adminFetch = $fetch.create({
    baseURL: '/api',
    credentials: 'include',
    onRequest({ options }) {
      const csrfToken = useCookie('XSRF-TOKEN').value
      if (csrfToken) {
        const headers = new Headers(options.headers)
        headers.set('X-XSRF-TOKEN', csrfToken)
        options.headers = headers
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await router.push('/admin/login')
      }
    },
  })

  // Profil & Settings
  const getProfile = () =>
    adminFetch<ApiSuccess<AdminProfileData>>('/admin/profile').then((r) => r.data)
  const updateProfile = (data: Partial<AdminProfileData>) =>
    adminFetch<ApiSuccess<AdminProfileData>>('/admin/profile', {
      method: 'PUT',
      body: data,
    }).then((r) => r.data)

  const getSettings = () =>
    adminFetch<ApiSuccess<AdminSiteSettingsData>>('/admin/settings').then((r) => r.data)
  const updateSettings = (data: Partial<AdminSiteSettingsData>) =>
    adminFetch<ApiSuccess<AdminSiteSettingsData>>('/admin/settings', {
      method: 'PUT',
      body: data,
    }).then((r) => r.data)

  // Fakta Profil
  const getProfileFacts = () =>
    adminFetch<ApiSuccess<AdminProfileFact[]>>('/admin/profile-facts').then((r) => r.data)
  const createProfileFact = (data: Partial<AdminProfileFact>) =>
    adminFetch<ApiSuccess<AdminProfileFact>>('/admin/profile-facts', {
      method: 'POST',
      body: data,
    }).then((r) => r.data)
  const updateProfileFact = (id: number, data: Partial<AdminProfileFact>) =>
    adminFetch<ApiSuccess<AdminProfileFact>>(`/admin/profile-facts/${id}`, {
      method: 'PATCH',
      body: data,
    }).then((r) => r.data)
  const deleteProfileFact = (id: number) =>
    adminFetch(`/admin/profile-facts/${id}`, { method: 'DELETE' })
  const reorderProfileFacts = (ids: number[]) =>
    adminFetch('/admin/profile-facts/reorder', {
      method: 'PATCH',
      body: { ids },
    })

  // Tautan Sosial
  const getSocialLinks = () =>
    adminFetch<ApiSuccess<AdminSocialLink[]>>('/admin/social-links').then((r) => r.data)
  const createSocialLink = (data: Partial<AdminSocialLink>) =>
    adminFetch<ApiSuccess<AdminSocialLink>>('/admin/social-links', {
      method: 'POST',
      body: data,
    }).then((r) => r.data)
  const updateSocialLink = (id: number, data: Partial<AdminSocialLink>) =>
    adminFetch<ApiSuccess<AdminSocialLink>>(`/admin/social-links/${id}`, {
      method: 'PATCH',
      body: data,
    }).then((r) => r.data)
  const deleteSocialLink = (id: number) =>
    adminFetch(`/admin/social-links/${id}`, { method: 'DELETE' })
  const reorderSocialLinks = (ids: number[]) =>
    adminFetch('/admin/social-links/reorder', {
      method: 'PATCH',
      body: { ids },
    })

  // Highlights
  const getHighlights = () =>
    adminFetch<ApiSuccess<AdminHighlight[]>>('/admin/highlights').then((r) => r.data)
  const createHighlight = (data: Partial<AdminHighlight>) =>
    adminFetch<ApiSuccess<AdminHighlight>>('/admin/highlights', {
      method: 'POST',
      body: data,
    }).then((r) => r.data)
  const updateHighlight = (id: number, data: Partial<AdminHighlight>) =>
    adminFetch<ApiSuccess<AdminHighlight>>(`/admin/highlights/${id}`, {
      method: 'PATCH',
      body: data,
    }).then((r) => r.data)
  const deleteHighlight = (id: number) =>
    adminFetch(`/admin/highlights/${id}`, { method: 'DELETE' })
  const reorderHighlights = (ids: number[]) =>
    adminFetch('/admin/highlights/reorder', {
      method: 'PATCH',
      body: { ids },
    })

  // Kategori & Skill
  const getSkillCategories = () =>
    adminFetch<ApiSuccess<AdminSkillCategory[]>>('/admin/skill-categories').then((r) => r.data)
  const createSkillCategory = (data: Partial<AdminSkillCategory>) =>
    adminFetch<ApiSuccess<AdminSkillCategory>>('/admin/skill-categories', {
      method: 'POST',
      body: data,
    }).then((r) => r.data)
  const updateSkillCategory = (id: number, data: Partial<AdminSkillCategory>) =>
    adminFetch<ApiSuccess<AdminSkillCategory>>(`/admin/skill-categories/${id}`, {
      method: 'PATCH',
      body: data,
    }).then((r) => r.data)
  const deleteSkillCategory = (id: number) =>
    adminFetch(`/admin/skill-categories/${id}`, { method: 'DELETE' })
  const reorderSkillCategories = (ids: number[]) =>
    adminFetch('/admin/skill-categories/reorder', {
      method: 'PATCH',
      body: { ids },
    })

  const getSkills = () =>
    adminFetch<ApiSuccess<AdminSkill[]>>('/admin/skills').then((r) => r.data)
  const getSkill = (id: number) =>
    adminFetch<ApiSuccess<AdminSkill>>(`/admin/skills/${id}`).then((r) => r.data)
  const createSkill = (data: Record<string, unknown>) =>
    adminFetch<ApiSuccess<AdminSkill>>('/admin/skills', {
      method: 'POST',
      body: data,
    }).then((r) => r.data)
  const updateSkill = (id: number, data: Record<string, unknown>) =>
    adminFetch<ApiSuccess<AdminSkill>>(`/admin/skills/${id}`, {
      method: 'PATCH',
      body: data,
    }).then((r) => r.data)
  const deleteSkill = (id: number) =>
    adminFetch(`/admin/skills/${id}`, { method: 'DELETE' })
  const reorderSkills = (ids: number[]) =>
    adminFetch('/admin/skills/reorder', {
      method: 'PATCH',
      body: { ids },
    })

  // Proyek
  const getProjects = (params?: { status?: string; q?: string; page?: number; perPage?: number }) =>
    adminFetch<ApiSuccess<AdminProject[]>>('/admin/projects', { query: params })
  const getProject = (id: number) =>
    adminFetch<ApiSuccess<AdminProject>>(`/admin/projects/${id}`).then((r) => r.data)
  const createProject = (data: Record<string, unknown>) =>
    adminFetch<ApiSuccess<AdminProject>>('/admin/projects', {
      method: 'POST',
      body: data,
    }).then((r) => r.data)
  const updateProject = (id: number, data: Record<string, unknown>) =>
    adminFetch<ApiSuccess<AdminProject>>(`/admin/projects/${id}`, {
      method: 'PATCH',
      body: data,
    }).then((r) => r.data)
  const updateProjectStatus = (id: number, status: PublishStatus) =>
    adminFetch<ApiSuccess<AdminProject>>(`/admin/projects/${id}/status`, {
      method: 'PATCH',
      body: { status },
    }).then((r) => r.data)
  const deleteProject = (id: number) =>
    adminFetch(`/admin/projects/${id}`, { method: 'DELETE' })
  const reorderProjects = (ids: number[]) =>
    adminFetch('/admin/projects/reorder', {
      method: 'PATCH',
      body: { ids },
    })

  // Pengalaman (Linimasa)
  const getExperiences = () =>
    adminFetch<ApiSuccess<AdminExperience[]>>('/admin/experiences').then((r) => r.data)
  const createExperience = (data: Record<string, unknown>) =>
    adminFetch<ApiSuccess<AdminExperience>>('/admin/experiences', {
      method: 'POST',
      body: data,
    }).then((r) => r.data)
  const updateExperience = (id: number, data: Record<string, unknown>) =>
    adminFetch<ApiSuccess<AdminExperience>>(`/admin/experiences/${id}`, {
      method: 'PATCH',
      body: data,
    }).then((r) => r.data)
  const deleteExperience = (id: number) =>
    adminFetch(`/admin/experiences/${id}`, { method: 'DELETE' })
  const reorderExperiences = (ids: number[]) =>
    adminFetch('/admin/experiences/reorder', {
      method: 'PATCH',
      body: { ids },
    })

  // Pesan Kontak
  const getMessages = (params?: { status?: string; page?: number; perPage?: number }) =>
    adminFetch<ApiSuccess<AdminMessage[]>>('/admin/messages', { query: params })
  const getMessage = (id: number) =>
    adminFetch<ApiSuccess<AdminMessage>>(`/admin/messages/${id}`).then((r) => r.data)
  const updateMessageStatus = (id: number, status: MessageStatus) =>
    adminFetch<ApiSuccess<AdminMessage>>(`/admin/messages/${id}`, {
      method: 'PATCH',
      body: { status },
    }).then((r) => r.data)
  const deleteMessage = (id: number) =>
    adminFetch(`/admin/messages/${id}`, { method: 'DELETE' })

  // Media
  const getMedia = (params?: { kind?: string; q?: string; page?: number; perPage?: number }) =>
    adminFetch<ApiSuccess<PublicMedia[]>>('/admin/media', { query: params })
  const getMediaDetail = (id: number) =>
    adminFetch<ApiSuccess<AdminMediaDetail>>(`/admin/media/${id}`).then((r) => r.data)
  const uploadMedia = (formData: FormData) =>
    adminFetch<ApiSuccess<PublicMedia[]>>('/admin/media/upload', {
      method: 'POST',
      body: formData,
    }).then((r) => r.data)
  const createYouTubeMedia = (data: { url: string; title?: string }) =>
    adminFetch<ApiSuccess<PublicMedia>>('/admin/media/youtube', {
      method: 'POST',
      body: data,
    }).then((r) => r.data)
  const updateMedia = (id: number, data: { title?: string | null; altText?: string | null; caption?: string | null }) =>
    adminFetch<ApiSuccess<PublicMedia>>(`/admin/media/${id}`, {
      method: 'PATCH',
      body: data,
    }).then((r) => r.data)
  const deleteMedia = (id: number) =>
    adminFetch(`/admin/media/${id}`, { method: 'DELETE' })

  // Ganti Kata Sandi
  const changePassword = (data: { currentPassword: string; newPassword: string }) =>
    adminFetch<{ data: { message: string } }>('/admin/auth/password', {
      method: 'PUT',
      body: data,
    }).then((r) => r.data)

  return {
    adminFetch,
    getProfile,
    updateProfile,
    getSettings,
    updateSettings,
    getProfileFacts,
    createProfileFact,
    updateProfileFact,
    deleteProfileFact,
    reorderProfileFacts,
    getSocialLinks,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
    reorderSocialLinks,
    getHighlights,
    createHighlight,
    updateHighlight,
    deleteHighlight,
    reorderHighlights,
    getSkillCategories,
    createSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    reorderSkillCategories,
    getSkills,
    getSkill,
    createSkill,
    updateSkill,
    deleteSkill,
    reorderSkills,
    getProjects,
    getProject,
    createProject,
    updateProject,
    updateProjectStatus,
    deleteProject,
    reorderProjects,
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
    reorderExperiences,
    getMessages,
    getMessage,
    updateMessageStatus,
    deleteMessage,
    getMedia,
    getMediaDetail,
    uploadMedia,
    createYouTubeMedia,
    updateMedia,
    deleteMedia,
    changePassword,
  }
}
