/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

export type { Route, Path } from './schema.d.ts'

const placeholder: any = {}

const routes = {
  'public.home': {
    methods: ["GET","HEAD"],
    pattern: '/api/public/home',
    tokens: [[0,"api"],[0,"public"],[0,"home"]],
    types: placeholder as Registry['public.home']['types'],
  },
  'public.projects': {
    methods: ["GET","HEAD"],
    pattern: '/api/public/projects',
    tokens: [[0,"api"],[0,"public"],[0,"projects"]],
    types: placeholder as Registry['public.projects']['types'],
  },
  'public.project_detail': {
    methods: ["GET","HEAD"],
    pattern: '/api/public/projects/:slug',
    tokens: [[0,"api"],[0,"public"],[0,"projects"],[1,"slug"]],
    types: placeholder as Registry['public.project_detail']['types'],
  },
  'public.skill_detail': {
    methods: ["GET","HEAD"],
    pattern: '/api/public/skills/:slug',
    tokens: [[0,"api"],[0,"public"],[0,"skills"],[1,"slug"]],
    types: placeholder as Registry['public.skill_detail']['types'],
  },
  'public.sitemap': {
    methods: ["GET","HEAD"],
    pattern: '/api/public/sitemap',
    tokens: [[0,"api"],[0,"public"],[0,"sitemap"]],
    types: placeholder as Registry['public.sitemap']['types'],
  },
  'contact.submit': {
    methods: ["POST"],
    pattern: '/api/public/contact',
    tokens: [[0,"api"],[0,"public"],[0,"contact"]],
    types: placeholder as Registry['contact.submit']['types'],
  },
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/admin/auth/login',
    tokens: [[0,"api"],[0,"admin"],[0,"auth"],[0,"login"]],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/api/admin/auth/logout',
    tokens: [[0,"api"],[0,"admin"],[0,"auth"],[0,"logout"]],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'auth.me': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/auth/me',
    tokens: [[0,"api"],[0,"admin"],[0,"auth"],[0,"me"]],
    types: placeholder as Registry['auth.me']['types'],
  },
  'auth.change_password': {
    methods: ["PUT"],
    pattern: '/api/admin/auth/password',
    tokens: [[0,"api"],[0,"admin"],[0,"auth"],[0,"password"]],
    types: placeholder as Registry['auth.change_password']['types'],
  },
  'profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/profile',
    tokens: [[0,"api"],[0,"admin"],[0,"profile"]],
    types: placeholder as Registry['profile.show']['types'],
  },
  'profile.update': {
    methods: ["PUT"],
    pattern: '/api/admin/profile',
    tokens: [[0,"api"],[0,"admin"],[0,"profile"]],
    types: placeholder as Registry['profile.update']['types'],
  },
  'site_settings.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/settings',
    tokens: [[0,"api"],[0,"admin"],[0,"settings"]],
    types: placeholder as Registry['site_settings.show']['types'],
  },
  'site_settings.update': {
    methods: ["PUT"],
    pattern: '/api/admin/settings',
    tokens: [[0,"api"],[0,"admin"],[0,"settings"]],
    types: placeholder as Registry['site_settings.update']['types'],
  },
  'profile_facts.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/profile-facts',
    tokens: [[0,"api"],[0,"admin"],[0,"profile-facts"]],
    types: placeholder as Registry['profile_facts.index']['types'],
  },
  'profile_facts.store': {
    methods: ["POST"],
    pattern: '/api/admin/profile-facts',
    tokens: [[0,"api"],[0,"admin"],[0,"profile-facts"]],
    types: placeholder as Registry['profile_facts.store']['types'],
  },
  'profile_facts.reorder': {
    methods: ["PATCH"],
    pattern: '/api/admin/profile-facts/reorder',
    tokens: [[0,"api"],[0,"admin"],[0,"profile-facts"],[0,"reorder"]],
    types: placeholder as Registry['profile_facts.reorder']['types'],
  },
  'profile_facts.update': {
    methods: ["PATCH"],
    pattern: '/api/admin/profile-facts/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"profile-facts"],[1,"id"]],
    types: placeholder as Registry['profile_facts.update']['types'],
  },
  'profile_facts.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/profile-facts/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"profile-facts"],[1,"id"]],
    types: placeholder as Registry['profile_facts.destroy']['types'],
  },
  'social_links.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/social-links',
    tokens: [[0,"api"],[0,"admin"],[0,"social-links"]],
    types: placeholder as Registry['social_links.index']['types'],
  },
  'social_links.store': {
    methods: ["POST"],
    pattern: '/api/admin/social-links',
    tokens: [[0,"api"],[0,"admin"],[0,"social-links"]],
    types: placeholder as Registry['social_links.store']['types'],
  },
  'social_links.reorder': {
    methods: ["PATCH"],
    pattern: '/api/admin/social-links/reorder',
    tokens: [[0,"api"],[0,"admin"],[0,"social-links"],[0,"reorder"]],
    types: placeholder as Registry['social_links.reorder']['types'],
  },
  'social_links.update': {
    methods: ["PATCH"],
    pattern: '/api/admin/social-links/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"social-links"],[1,"id"]],
    types: placeholder as Registry['social_links.update']['types'],
  },
  'social_links.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/social-links/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"social-links"],[1,"id"]],
    types: placeholder as Registry['social_links.destroy']['types'],
  },
  'highlights.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/highlights',
    tokens: [[0,"api"],[0,"admin"],[0,"highlights"]],
    types: placeholder as Registry['highlights.index']['types'],
  },
  'highlights.store': {
    methods: ["POST"],
    pattern: '/api/admin/highlights',
    tokens: [[0,"api"],[0,"admin"],[0,"highlights"]],
    types: placeholder as Registry['highlights.store']['types'],
  },
  'highlights.reorder': {
    methods: ["PATCH"],
    pattern: '/api/admin/highlights/reorder',
    tokens: [[0,"api"],[0,"admin"],[0,"highlights"],[0,"reorder"]],
    types: placeholder as Registry['highlights.reorder']['types'],
  },
  'highlights.update': {
    methods: ["PATCH"],
    pattern: '/api/admin/highlights/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"highlights"],[1,"id"]],
    types: placeholder as Registry['highlights.update']['types'],
  },
  'highlights.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/highlights/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"highlights"],[1,"id"]],
    types: placeholder as Registry['highlights.destroy']['types'],
  },
  'skill_categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/skill-categories',
    tokens: [[0,"api"],[0,"admin"],[0,"skill-categories"]],
    types: placeholder as Registry['skill_categories.index']['types'],
  },
  'skill_categories.store': {
    methods: ["POST"],
    pattern: '/api/admin/skill-categories',
    tokens: [[0,"api"],[0,"admin"],[0,"skill-categories"]],
    types: placeholder as Registry['skill_categories.store']['types'],
  },
  'skill_categories.reorder': {
    methods: ["PATCH"],
    pattern: '/api/admin/skill-categories/reorder',
    tokens: [[0,"api"],[0,"admin"],[0,"skill-categories"],[0,"reorder"]],
    types: placeholder as Registry['skill_categories.reorder']['types'],
  },
  'skill_categories.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/skill-categories/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"skill-categories"],[1,"id"]],
    types: placeholder as Registry['skill_categories.show']['types'],
  },
  'skill_categories.update': {
    methods: ["PATCH"],
    pattern: '/api/admin/skill-categories/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"skill-categories"],[1,"id"]],
    types: placeholder as Registry['skill_categories.update']['types'],
  },
  'skill_categories.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/skill-categories/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"skill-categories"],[1,"id"]],
    types: placeholder as Registry['skill_categories.destroy']['types'],
  },
  'skills.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/skills',
    tokens: [[0,"api"],[0,"admin"],[0,"skills"]],
    types: placeholder as Registry['skills.index']['types'],
  },
  'skills.store': {
    methods: ["POST"],
    pattern: '/api/admin/skills',
    tokens: [[0,"api"],[0,"admin"],[0,"skills"]],
    types: placeholder as Registry['skills.store']['types'],
  },
  'skills.reorder': {
    methods: ["PATCH"],
    pattern: '/api/admin/skills/reorder',
    tokens: [[0,"api"],[0,"admin"],[0,"skills"],[0,"reorder"]],
    types: placeholder as Registry['skills.reorder']['types'],
  },
  'skills.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/skills/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"skills"],[1,"id"]],
    types: placeholder as Registry['skills.show']['types'],
  },
  'skills.update': {
    methods: ["PATCH"],
    pattern: '/api/admin/skills/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"skills"],[1,"id"]],
    types: placeholder as Registry['skills.update']['types'],
  },
  'skills.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/skills/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"skills"],[1,"id"]],
    types: placeholder as Registry['skills.destroy']['types'],
  },
  'projects.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/projects',
    tokens: [[0,"api"],[0,"admin"],[0,"projects"]],
    types: placeholder as Registry['projects.index']['types'],
  },
  'projects.store': {
    methods: ["POST"],
    pattern: '/api/admin/projects',
    tokens: [[0,"api"],[0,"admin"],[0,"projects"]],
    types: placeholder as Registry['projects.store']['types'],
  },
  'projects.reorder': {
    methods: ["PATCH"],
    pattern: '/api/admin/projects/reorder',
    tokens: [[0,"api"],[0,"admin"],[0,"projects"],[0,"reorder"]],
    types: placeholder as Registry['projects.reorder']['types'],
  },
  'projects.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/projects/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"projects"],[1,"id"]],
    types: placeholder as Registry['projects.show']['types'],
  },
  'projects.update': {
    methods: ["PATCH"],
    pattern: '/api/admin/projects/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"projects"],[1,"id"]],
    types: placeholder as Registry['projects.update']['types'],
  },
  'projects.update_status': {
    methods: ["PATCH"],
    pattern: '/api/admin/projects/:id/status',
    tokens: [[0,"api"],[0,"admin"],[0,"projects"],[1,"id"],[0,"status"]],
    types: placeholder as Registry['projects.update_status']['types'],
  },
  'projects.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/projects/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"projects"],[1,"id"]],
    types: placeholder as Registry['projects.destroy']['types'],
  },
  'experiences.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/experiences',
    tokens: [[0,"api"],[0,"admin"],[0,"experiences"]],
    types: placeholder as Registry['experiences.index']['types'],
  },
  'experiences.store': {
    methods: ["POST"],
    pattern: '/api/admin/experiences',
    tokens: [[0,"api"],[0,"admin"],[0,"experiences"]],
    types: placeholder as Registry['experiences.store']['types'],
  },
  'experiences.reorder': {
    methods: ["PATCH"],
    pattern: '/api/admin/experiences/reorder',
    tokens: [[0,"api"],[0,"admin"],[0,"experiences"],[0,"reorder"]],
    types: placeholder as Registry['experiences.reorder']['types'],
  },
  'experiences.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/experiences/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"experiences"],[1,"id"]],
    types: placeholder as Registry['experiences.show']['types'],
  },
  'experiences.update': {
    methods: ["PATCH"],
    pattern: '/api/admin/experiences/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"experiences"],[1,"id"]],
    types: placeholder as Registry['experiences.update']['types'],
  },
  'experiences.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/experiences/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"experiences"],[1,"id"]],
    types: placeholder as Registry['experiences.destroy']['types'],
  },
  'messages.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/messages',
    tokens: [[0,"api"],[0,"admin"],[0,"messages"]],
    types: placeholder as Registry['messages.index']['types'],
  },
  'messages.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/messages/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"messages"],[1,"id"]],
    types: placeholder as Registry['messages.show']['types'],
  },
  'messages.update': {
    methods: ["PATCH"],
    pattern: '/api/admin/messages/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"messages"],[1,"id"]],
    types: placeholder as Registry['messages.update']['types'],
  },
  'messages.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/messages/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"messages"],[1,"id"]],
    types: placeholder as Registry['messages.destroy']['types'],
  },
  'media.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/media',
    tokens: [[0,"api"],[0,"admin"],[0,"media"]],
    types: placeholder as Registry['media.index']['types'],
  },
  'media.upload': {
    methods: ["POST"],
    pattern: '/api/admin/media/upload',
    tokens: [[0,"api"],[0,"admin"],[0,"media"],[0,"upload"]],
    types: placeholder as Registry['media.upload']['types'],
  },
  'media.create_youtube': {
    methods: ["POST"],
    pattern: '/api/admin/media/youtube',
    tokens: [[0,"api"],[0,"admin"],[0,"media"],[0,"youtube"]],
    types: placeholder as Registry['media.create_youtube']['types'],
  },
  'media.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/media/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"media"],[1,"id"]],
    types: placeholder as Registry['media.show']['types'],
  },
  'media.update': {
    methods: ["PATCH"],
    pattern: '/api/admin/media/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"media"],[1,"id"]],
    types: placeholder as Registry['media.update']['types'],
  },
  'media.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/media/:id',
    tokens: [[0,"api"],[0,"admin"],[0,"media"],[1,"id"]],
    types: placeholder as Registry['media.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
