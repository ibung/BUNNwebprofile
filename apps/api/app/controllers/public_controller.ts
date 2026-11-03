import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import type {
  PublicExperience,
  PublicHighlight,
  PublicHomeData,
  PublicProfileFact,
  PublicProjectDetail,
  PublicProjectItem,
  PublicSitemapData,
  PublicSkillCategory,
  PublicSkillDetail,
  PublicSkillItem,
  PublicSocialLink,
} from '@bunn/shared'
import SiteSettings from '#models/site_settings'
import Profile from '#models/profile'
import ProfileFact from '#models/profile_fact'
import SocialLink from '#models/social_link'
import Highlight from '#models/highlight'
import Project from '#models/project'
import SkillCategory from '#models/skill_category'
import Skill from '#models/skill'
import Experience from '#models/experience'
import MarkdownService from '#services/markdown_service'
import PublicMediaTransformer from '#transformers/public_media_transformer'
import { publicProjectsQueryValidator } from '#validators/public_query'

function formatDate(date: DateTime | string | null | undefined): string | null {
  if (!date) return null
  if (typeof date === 'string') return date
  return date.toISODate()
}

function formatDateTime(date: DateTime | string | null | undefined): string | null {
  if (!date) return null
  if (typeof date === 'string') return date
  return date.toISO()
}

function transformProjectItem(project: Project): PublicProjectItem {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    role: project.role,
    kind: project.kind,
    isFeatured: project.isFeatured,
    demoUrl: project.demoUrl,
    repoUrl: project.repoUrl,
    startedOn: formatDate(project.startedOn),
    endedOn: formatDate(project.endedOn),
    publishedAt: formatDateTime(project.publishedAt),
    cover: PublicMediaTransformer.transform(project.coverMedia),
    skills: (project.skills || []).map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
    })),
  }
}

export default class PublicController {
  /**
   * GET /api/public/home
   * Mengembalikan semua data yang diperlukan untuk halaman beranda dalam satu panggilan.
   */
  async home({ response }: HttpContext) {
    response.header('Cache-Control', 'no-store')
    const now = DateTime.utc().toSQL()

    // 1. Site Settings (singleton id = 1)
    const settings = await SiteSettings.query().where('id', 1).preload('ogImage').first()

    // 2. Profile (singleton id = 1)
    const profile = await Profile.query().where('id', 1).preload('avatar').preload('resume').first()

    const heroIntroHtml = await MarkdownService.render(profile?.heroIntroMd)
    const aboutHtml = await MarkdownService.render(profile?.aboutMd)

    // 3. Profile Facts (isVisible = true)
    const facts = await ProfileFact.query().where('isVisible', true).orderBy('sortOrder', 'asc')

    // 4. Social Links (isVisible = true)
    const socials = await SocialLink.query().where('isVisible', true).orderBy('sortOrder', 'asc')

    // 5. Highlights (isVisible = true)
    const highlights = await Highlight.query().where('isVisible', true).orderBy('sortOrder', 'asc')

    // 6. Featured Projects (published & publishedAt <= now & isFeatured = true)
    const featuredProjects = await Project.query()
      .where('status', 'published')
      .where('publishedAt', '<=', now)
      .where('isFeatured', true)
      .orderBy('sortOrder', 'asc')
      .preload('coverMedia')
      .preload('skills', (skillQuery) => {
        skillQuery
          .where('isVisible', true)
          .whereHas('category', (catQuery) => {
            catQuery.where('isVisible', true)
          })
          .orderBy('project_skills.sort_order', 'asc')
      })

    // 7. Skill Categories & visible skills
    const categories = await SkillCategory.query()
      .where('isVisible', true)
      .orderBy('sortOrder', 'asc')
      .preload('skills', (skillQuery) => {
        skillQuery.where('isVisible', true).orderBy('sortOrder', 'asc')
      })

    // 8. Experiences (isVisible = true)
    const experiences = await Experience.query()
      .where('isVisible', true)
      .orderBy('sortOrder', 'asc')
      .preload('media', (mediaQuery) => {
        mediaQuery.orderBy('experience_media.sort_order', 'asc')
      })

    const experiencesWithHtml: PublicExperience[] = await Promise.all(
      experiences.map(async (exp) => ({
        id: exp.id,
        kind: exp.kind,
        title: exp.title,
        organization: exp.organization,
        descriptionHtml: await MarkdownService.renderOrNull(exp.descriptionMd),
        startedOn: formatDate(exp.startedOn)!,
        endedOn: formatDate(exp.endedOn),
        media: PublicMediaTransformer.transformMany(exp.media || []),
      }))
    )

    const homeData: PublicHomeData = {
      settings: {
        siteTitle: settings?.siteTitle || 'Ibnu Hilmi Athaillah',
        metaDescription: settings?.metaDescription || '',
        footerText: settings?.footerText ?? null,
        ogImage: PublicMediaTransformer.transform(settings?.ogImage),
        contactFormEnabled: settings?.contactFormEnabled ?? true,
      },
      profile: {
        fullName: profile?.fullName || '',
        displayName: profile?.displayName || '',
        headline: profile?.headline || '',
        tagline: profile?.tagline ?? null,
        heroIntroHtml,
        aboutHtml,
        location: profile?.location ?? null,
        emailPublic: profile?.emailPublic ?? null,
        phonePublic: profile?.phonePublic ?? null,
        availabilityText: profile?.availabilityText ?? null,
        avatar: PublicMediaTransformer.transform(profile?.avatar),
        resume: PublicMediaTransformer.transform(profile?.resume),
      },
      facts: facts.map((f): PublicProfileFact => ({
        label: f.label,
        value: f.value,
      })),
      socials: socials.map((s): PublicSocialLink => ({
        platform: s.platform,
        label: s.label,
        url: s.url,
      })),
      highlights: {
        about: highlights
          .filter((h) => h.placement === 'about')
          .map((h): PublicHighlight => ({
            id: h.id,
            value: h.value,
            label: h.label,
            note: h.note,
          })),
        skills: highlights
          .filter((h) => h.placement === 'skills')
          .map((h): PublicHighlight => ({
            id: h.id,
            value: h.value,
            label: h.label,
            note: h.note,
          })),
      },
      featuredProjects: featuredProjects.map(transformProjectItem),
      skillCategories: categories.map((cat): PublicSkillCategory => ({
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        accent: cat.accent,
        skills: (cat.skills || []).map((s): PublicSkillItem => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          level: s.level,
          summary: s.summary,
          yearsExperience: s.yearsExperience !== null ? Number(s.yearsExperience) : null,
        })),
      })),
      experiences: experiencesWithHtml,
    }

    return response.ok({ data: homeData })
  }

  /**
   * GET /api/public/projects
   * Daftar proyek terbit dengan filter opsional `featured`, `skill` (slug), serta paginasi.
   */
  async projects({ request, response }: HttpContext) {
    response.header('Cache-Control', 'no-store')
    const payload = await request.validateUsing(publicProjectsQueryValidator)
    const now = DateTime.utc().toSQL()

    const page = payload.page || 1
    const perPage = payload.perPage || 12

    const query = Project.query()
      .where('status', 'published')
      .where('publishedAt', '<=', now)
      .orderBy('sortOrder', 'asc')
      .preload('coverMedia')
      .preload('skills', (skillQuery) => {
        skillQuery
          .where('isVisible', true)
          .whereHas('category', (catQuery) => {
            catQuery.where('isVisible', true)
          })
          .orderBy('project_skills.sort_order', 'asc')
      })

    if (payload.featured === 'true') {
      query.where('isFeatured', true)
    } else if (payload.featured === 'false') {
      query.where('isFeatured', false)
    }

    if (payload.skill) {
      const skillSlug = payload.skill
      query.whereHas('skills', (skillQuery) => {
        skillQuery
          .where('slug', skillSlug)
          .where('isVisible', true)
          .whereHas('category', (catQuery) => {
            catQuery.where('isVisible', true)
          })
      })
    }

    const paginated = await query.paginate(page, perPage)

    const items: PublicProjectItem[] = paginated.all().map(transformProjectItem)

    return response.ok({
      data: items,
      meta: {
        total: paginated.total,
        page: paginated.currentPage,
        perPage: paginated.perPage,
      },
    })
  }

  /**
   * GET /api/public/projects/:slug
   * Detail satu proyek terbit beserta galeri media, skill terkait, dan deskripsi HTML.
   */
  async projectDetail({ params, response }: HttpContext) {
    response.header('Cache-Control', 'no-store')
    const now = DateTime.utc().toSQL()

    const project = await Project.query()
      .where('slug', params.slug)
      .where('status', 'published')
      .where('publishedAt', '<=', now)
      .preload('coverMedia')
      .preload('media', (mediaQuery) => {
        mediaQuery.orderBy('project_media.sort_order', 'asc')
      })
      .preload('skills', (skillQuery) => {
        skillQuery
          .where('isVisible', true)
          .whereHas('category', (catQuery) => {
            catQuery.where('isVisible', true)
          })
          .orderBy('project_skills.sort_order', 'asc')
      })
      .first()

    if (!project) {
      return response.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Proyek tidak ditemukan atau belum dipublikasikan.',
        },
      })
    }

    const base = transformProjectItem(project)
    const descriptionHtml = await MarkdownService.render(project.descriptionMd)
    const media = PublicMediaTransformer.transformMany(project.media || [])

    const detail: PublicProjectDetail = {
      ...base,
      descriptionHtml,
      media,
    }

    return response.ok({ data: detail })
  }

  /**
   * GET /api/public/skills/:slug
   * Detail satu skill yang aktif beserta media dan proyek terkait yang terbit.
   */
  async skillDetail({ params, response }: HttpContext) {
    response.header('Cache-Control', 'no-store')
    const now = DateTime.utc().toSQL()

    const skill = await Skill.query()
      .where('slug', params.slug)
      .where('isVisible', true)
      .whereHas('category', (catQuery) => {
        catQuery.where('isVisible', true)
      })
      .preload('category')
      .preload('media', (mediaQuery) => {
        mediaQuery.orderBy('skill_media.sort_order', 'asc')
      })
      .preload('projects', (projectQuery) => {
        projectQuery
          .where('status', 'published')
          .where('publishedAt', '<=', now)
          .orderBy('sortOrder', 'asc')
          .preload('coverMedia')
          .preload('skills', (sq) => {
            sq.where('isVisible', true)
              .whereHas('category', (cq) => {
                cq.where('isVisible', true)
              })
              .orderBy('project_skills.sort_order', 'asc')
          })
      })
      .first()

    if (!skill) {
      return response.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Skill tidak ditemukan atau tidak tersedia.',
        },
      })
    }

    const descriptionHtml = await MarkdownService.renderOrNull(skill.descriptionMd)
    const media = PublicMediaTransformer.transformMany(skill.media || [])
    const projects = (skill.projects || []).map(transformProjectItem)

    const detail: PublicSkillDetail = {
      id: skill.id,
      slug: skill.slug,
      name: skill.name,
      level: skill.level,
      summary: skill.summary,
      descriptionHtml,
      yearsExperience: skill.yearsExperience !== null ? Number(skill.yearsExperience) : null,
      category: {
        slug: skill.category.slug,
        name: skill.category.name,
        accent: skill.category.accent,
      },
      media,
      projects,
    }

    return response.ok({ data: detail })
  }

  /**
   * GET /api/public/sitemap
   * Mengembalikan daftar slug dan waktu pembaruan untuk proyek dan skill publik.
   */
  async sitemap({ response }: HttpContext) {
    response.header('Cache-Control', 'no-store')
    const now = DateTime.utc().toSQL()

    const projects = await Project.query()
      .where('status', 'published')
      .where('publishedAt', '<=', now)
      .orderBy('sortOrder', 'asc')
      .select('slug', 'updatedAt')

    const skills = await Skill.query()
      .where('isVisible', true)
      .whereHas('category', (catQuery) => {
        catQuery.where('isVisible', true)
      })
      .orderBy('sortOrder', 'asc')
      .select('slug', 'updatedAt')

    const sitemapData: PublicSitemapData = {
      projects: projects.map((p) => ({
        slug: p.slug,
        updatedAt: formatDateTime(p.updatedAt) || formatDateTime(DateTime.utc())!,
      })),
      skills: skills.map((s) => ({
        slug: s.slug,
        updatedAt: formatDateTime(s.updatedAt) || formatDateTime(DateTime.utc())!,
      })),
    }

    return response.ok({ data: sitemapData })
  }
}
