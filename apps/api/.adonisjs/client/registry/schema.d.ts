/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractRawResponse, ExtractResponse, Method, PathWithRegistry, PatternsByMethod, RouteWithRegistry } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'
import type { routes } from './index.ts'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'public.home': {
    methods: ["GET","HEAD"]
    pattern: '/api/public/home'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public_controller').default['home']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public_controller').default['home']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/public_controller').default['home']>>>
    }
  }
  'public.projects': {
    methods: ["GET","HEAD"]
    pattern: '/api/public/projects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/public_query').publicProjectsQueryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public_controller').default['projects']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public_controller').default['projects']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/public_controller').default['projects']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'public.project_detail': {
    methods: ["GET","HEAD"]
    pattern: '/api/public/projects/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public_controller').default['projectDetail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public_controller').default['projectDetail']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/public_controller').default['projectDetail']>>>
    }
  }
  'public.skill_detail': {
    methods: ["GET","HEAD"]
    pattern: '/api/public/skills/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public_controller').default['skillDetail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public_controller').default['skillDetail']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/public_controller').default['skillDetail']>>>
    }
  }
  'public.sitemap': {
    methods: ["GET","HEAD"]
    pattern: '/api/public/sitemap'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public_controller').default['sitemap']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public_controller').default['sitemap']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/public_controller').default['sitemap']>>>
    }
  }
  'contact.submit': {
    methods: ["POST"]
    pattern: '/api/public/contact'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/contact').publicContactValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/contact').publicContactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['submit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['submit']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['submit']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.login': {
    methods: ["POST"]
    pattern: '/api/admin/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.logout': {
    methods: ["POST"]
    pattern: '/api/admin/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
    }
  }
  'auth.me': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/auth/me'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['me']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['me']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['me']>>>
    }
  }
  'auth.change_password': {
    methods: ["PUT"]
    pattern: '/api/admin/auth/password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').changePasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').changePasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['changePassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['changePassword']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['changePassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'profile.update': {
    methods: ["PUT"]
    pattern: '/api/admin/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/profile').updateProfileValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/profile').updateProfileValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'site_settings.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/site_settings_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/site_settings_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/site_settings_controller').default['show']>>>
    }
  }
  'site_settings.update': {
    methods: ["PUT"]
    pattern: '/api/admin/settings'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/site_settings').updateSiteSettingsValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/site_settings').updateSiteSettingsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/site_settings_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/site_settings_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/site_settings_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile_facts.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/profile-facts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['index']>>>
    }
  }
  'profile_facts.store': {
    methods: ["POST"]
    pattern: '/api/admin/profile-facts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/profile_fact').createProfileFactValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/profile_fact').createProfileFactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile_facts.reorder': {
    methods: ["PATCH"]
    pattern: '/api/admin/profile-facts/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile_facts.update': {
    methods: ["PATCH"]
    pattern: '/api/admin/profile-facts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/profile_fact').updateProfileFactValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/profile_fact').updateProfileFactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile_facts.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/profile-facts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/profile_facts_controller').default['destroy']>>>
    }
  }
  'social_links.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/social-links'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['index']>>>
    }
  }
  'social_links.store': {
    methods: ["POST"]
    pattern: '/api/admin/social-links'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/social_link').createSocialLinkValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/social_link').createSocialLinkValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'social_links.reorder': {
    methods: ["PATCH"]
    pattern: '/api/admin/social-links/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'social_links.update': {
    methods: ["PATCH"]
    pattern: '/api/admin/social-links/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/social_link').updateSocialLinkValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/social_link').updateSocialLinkValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'social_links.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/social-links/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/social_links_controller').default['destroy']>>>
    }
  }
  'highlights.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/highlights'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['index']>>>
    }
  }
  'highlights.store': {
    methods: ["POST"]
    pattern: '/api/admin/highlights'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/highlight').createHighlightValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/highlight').createHighlightValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'highlights.reorder': {
    methods: ["PATCH"]
    pattern: '/api/admin/highlights/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'highlights.update': {
    methods: ["PATCH"]
    pattern: '/api/admin/highlights/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/highlight').updateHighlightValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/highlight').updateHighlightValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'highlights.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/highlights/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/highlights_controller').default['destroy']>>>
    }
  }
  'skill_categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/skill-categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['index']>>>
    }
  }
  'skill_categories.store': {
    methods: ["POST"]
    pattern: '/api/admin/skill-categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/skill_category').createSkillCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/skill_category').createSkillCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'skill_categories.reorder': {
    methods: ["PATCH"]
    pattern: '/api/admin/skill-categories/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'skill_categories.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/skill-categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['show']>>>
    }
  }
  'skill_categories.update': {
    methods: ["PATCH"]
    pattern: '/api/admin/skill-categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/skill_category').updateSkillCategoryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/skill_category').updateSkillCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'skill_categories.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/skill-categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/skill_categories_controller').default['destroy']>>>
    }
  }
  'skills.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/skills'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['index']>>>
    }
  }
  'skills.store': {
    methods: ["POST"]
    pattern: '/api/admin/skills'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/skill').createSkillValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/skill').createSkillValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'skills.reorder': {
    methods: ["PATCH"]
    pattern: '/api/admin/skills/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'skills.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/skills/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['show']>>>
    }
  }
  'skills.update': {
    methods: ["PATCH"]
    pattern: '/api/admin/skills/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/skill').updateSkillValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/skill').updateSkillValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'skills.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/skills/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/skills_controller').default['destroy']>>>
    }
  }
  'projects.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/projects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['index']>>>
    }
  }
  'projects.store': {
    methods: ["POST"]
    pattern: '/api/admin/projects'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project').createProjectValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/project').createProjectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'projects.reorder': {
    methods: ["PATCH"]
    pattern: '/api/admin/projects/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'projects.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/projects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
    }
  }
  'projects.update': {
    methods: ["PATCH"]
    pattern: '/api/admin/projects/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project').updateProjectValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/project').updateProjectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'projects.update_status': {
    methods: ["PATCH"]
    pattern: '/api/admin/projects/:id/status'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project').updateProjectStatusValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/project').updateProjectStatusValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['updateStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['updateStatus']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['updateStatus']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'projects.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/projects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['destroy']>>>
    }
  }
  'experiences.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/experiences'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['index']>>>
    }
  }
  'experiences.store': {
    methods: ["POST"]
    pattern: '/api/admin/experiences'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/experience').createExperienceValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/experience').createExperienceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'experiences.reorder': {
    methods: ["PATCH"]
    pattern: '/api/admin/experiences/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/reorder').reorderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'experiences.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/experiences/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['show']>>>
    }
  }
  'experiences.update': {
    methods: ["PATCH"]
    pattern: '/api/admin/experiences/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/experience').updateExperienceValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/experience').updateExperienceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'experiences.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/experiences/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/experiences_controller').default['destroy']>>>
    }
  }
  'messages.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/messages'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['index']>>>
    }
  }
  'messages.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/messages/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['show']>>>
    }
  }
  'messages.update': {
    methods: ["PATCH"]
    pattern: '/api/admin/messages/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/contact').updateMessageStatusValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/contact').updateMessageStatusValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'messages.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/messages/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['destroy']>>>
    }
  }
  'media.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/media'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/media_controller').default['index']>>>
    }
  }
  'media.upload': {
    methods: ["POST"]
    pattern: '/api/admin/media/upload'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_controller').default['upload']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_controller').default['upload']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/media_controller').default['upload']>>>
    }
  }
  'media.create_youtube': {
    methods: ["POST"]
    pattern: '/api/admin/media/youtube'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/media').createYoutubeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/media').createYoutubeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_controller').default['createYoutube']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_controller').default['createYoutube']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/media_controller').default['createYoutube']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'media.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/media/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/media_controller').default['show']>>>
    }
  }
  'media.update': {
    methods: ["PATCH"]
    pattern: '/api/admin/media/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/media').updateMediaValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/media').updateMediaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/media_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'media.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/media/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/media_controller').default['destroy']>>>
    }
  }
}

export namespace Route {
  export type Request<Name extends keyof typeof routes> = RouteWithRegistry.Request<typeof routes, Name>
  export type Response<Name extends keyof typeof routes> = RouteWithRegistry.Response<typeof routes, Name>
  export type Params<Name extends keyof typeof routes> = RouteWithRegistry.Params<typeof routes, Name>
  export type Body<Name extends keyof typeof routes> = RouteWithRegistry.Body<typeof routes, Name>
  export type Query<Name extends keyof typeof routes> = RouteWithRegistry.Query<typeof routes, Name>
  export type Error<Name extends keyof typeof routes> = RouteWithRegistry.Error<typeof routes, Name>
}

export namespace Path {
  export type Request<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Request<typeof routes, M, P>
  export type Response<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Response<typeof routes, M, P>
  export type Params<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Params<typeof routes, M, P>
  export type Body<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Body<typeof routes, M, P>
  export type Query<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Query<typeof routes, M, P>
  export type Error<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Error<typeof routes, M, P>
}
