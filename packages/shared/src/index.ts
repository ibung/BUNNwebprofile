// Kontrak bersama web dan api. Ubah bersamaan dengan docs/DATABASE.md dan migrasi.
// Tanpa dependensi runtime. Hanya tipe dan konstanta.

export const MEDIA_KINDS = ['image', 'video', 'youtube', 'document'] as const
export type MediaKind = (typeof MEDIA_KINDS)[number]

export const PUBLISH_STATUSES = ['draft', 'published', 'archived'] as const
export type PublishStatus = (typeof PUBLISH_STATUSES)[number]

export const MESSAGE_STATUSES = ['new', 'read', 'archived', 'spam'] as const
export type MessageStatus = (typeof MESSAGE_STATUSES)[number]

export const SOCIAL_PLATFORMS = [
  'github',
  'linkedin',
  'instagram',
  'youtube',
  'x',
  'tiktok',
  'email',
  'website',
  'other',
] as const
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]

export const EXPERIENCE_KINDS = ['education', 'work', 'project', 'milestone'] as const
export type ExperienceKind = (typeof EXPERIENCE_KINDS)[number]

export const HIGHLIGHT_PLACEMENTS = ['about', 'skills'] as const
export type HighlightPlacement = (typeof HIGHLIGHT_PLACEMENTS)[number]

export const SKILL_LEVELS = ['learning', 'comfortable', 'strong'] as const
export type SkillLevel = (typeof SKILL_LEVELS)[number]

export const CATEGORY_ACCENTS = ['red', 'yellow'] as const
export type CategoryAccent = (typeof CATEGORY_ACCENTS)[number]

export const UPLOAD_LIMITS = {
  imageBytes: 10 * 1024 * 1024,
  videoBytes: 50 * 1024 * 1024,
  documentBytes: 10 * 1024 * 1024,
} as const

export const ALLOWED_UPLOAD_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'video/mp4',
  'video/webm',
  'application/pdf',
] as const
export type AllowedUploadMime = (typeof ALLOWED_UPLOAD_MIME)[number]

export const IMAGE_VARIANTS = { thumb: 480, md: 960, lg: 1600 } as const
export type ImageVariant = keyof typeof IMAGE_VARIANTS

// Amplop respons API
export interface ApiMeta {
  total?: number
  page?: number
  perPage?: number
}

export interface ApiSuccess<T> {
  data: T
  meta?: ApiMeta
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'PAYLOAD_TOO_LARGE'
  | 'RATE_LIMITED'
  | 'INTERNAL'

export interface ApiError {
  error: {
    code: ApiErrorCode
    message: string
    details?: Array<{ field: string; message: string }>
  }
}

// Media sebagaimana dilihat API publik
export interface PublicMedia {
  id: number
  kind: MediaKind
  title: string | null
  altText: string | null
  caption: string | null
  width: number | null
  height: number | null
  urls: Partial<Record<ImageVariant | 'original', string>>
  youtube: { id: string; startSeconds: number } | null
  posterUrl: string | null
  mimeType: string | null
  durationSeconds: number | null
}

// Data situs publik
export interface PublicSiteSettings {
  siteTitle: string
  metaDescription: string
  footerText: string | null
  ogImage: PublicMedia | null
  contactFormEnabled: boolean
  aboutLabel?: string | null
  aboutTitleMain?: string | null
  aboutTitleAccent?: string | null
  projectsLabel?: string | null
  projectsTitleMain?: string | null
  projectsTitleAccent?: string | null
  projectsSubtitle?: string | null
  skillsLabel?: string | null
  skillsTitleMain?: string | null
  skillsTitleAccent?: string | null
  skillsSubtitle?: string | null
  experiencesLabel?: string | null
  experiencesTitleMain?: string | null
  experiencesTitleAccent?: string | null
  experiencesSubtitle?: string | null
  contactLabel?: string | null
  contactTitleMain?: string | null
  contactTitleAccent?: string | null
  contactSubtitle?: string | null
}

export interface PublicProfile {
  fullName: string
  heroPrefix?: string | null
  displayName: string
  headline: string
  tagline: string | null
  heroIntroHtml: string
  aboutHtml: string
  location: string | null
  emailPublic: string | null
  phonePublic: string | null
  availabilityText: string | null
  avatar: PublicMedia | null
  resume: PublicMedia | null
}

export interface PublicProfileFact {
  label: string
  value: string
}

export interface PublicSocialLink {
  id?: number
  platform: SocialPlatform
  label: string
  url: string
  mediaId?: number | null
  icon?: PublicMedia | null
}

export interface PublicHighlight {
  id: number
  value: string
  label: string
  note: string | null
}

export interface PublicSkillItem {
  id: number
  name: string
  slug: string
  level: SkillLevel | null
  summary: string
  yearsExperience: number | null
  icon?: PublicMedia | null
}

export interface PublicSkillCategory {
  slug: string
  name: string
  description: string | null
  accent: CategoryAccent
  skills: PublicSkillItem[]
}

export interface PublicExperience {
  id: number
  kind: ExperienceKind
  title: string
  organization: string | null
  descriptionHtml: string | null
  startedOn: string
  endedOn: string | null
  media: PublicMedia[]
}

export interface PublicProjectItem {
  id: number
  slug: string
  title: string
  summary: string
  role: string | null
  kind: string | null
  isFeatured: boolean
  demoUrl: string | null
  repoUrl: string | null
  startedOn: string | null
  endedOn: string | null
  publishedAt: string | null
  cover: PublicMedia | null
  skills: Array<{ id: number; name: string; slug: string }>
}

export interface PublicProjectDetail extends PublicProjectItem {
  descriptionHtml: string
  media: PublicMedia[]
}

export interface PublicSkillDetail {
  id: number
  slug: string
  name: string
  level: SkillLevel | null
  summary: string
  descriptionHtml: string | null
  yearsExperience: number | null
  category: { slug: string; name: string; accent: CategoryAccent }
  media: PublicMedia[]
  projects: PublicProjectItem[]
}

export interface PublicHomeData {
  settings: PublicSiteSettings
  profile: PublicProfile
  facts: PublicProfileFact[]
  socials: PublicSocialLink[]
  highlights: {
    about: PublicHighlight[]
    skills: PublicHighlight[]
  }
  featuredProjects: PublicProjectItem[]
  skillCategories: PublicSkillCategory[]
  experiences: PublicExperience[]
}

export interface PublicSitemapData {
  projects: Array<{ slug: string; updatedAt: string }>
  skills: Array<{ slug: string; updatedAt: string }>
}

