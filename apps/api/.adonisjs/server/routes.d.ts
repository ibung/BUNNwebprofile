import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'public.home': { paramsTuple?: []; params?: {} }
    'public.projects': { paramsTuple?: []; params?: {} }
    'public.project_detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.skill_detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.sitemap': { paramsTuple?: []; params?: {} }
    'contact.submit': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'auth.change_password': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'site_settings.show': { paramsTuple?: []; params?: {} }
    'site_settings.update': { paramsTuple?: []; params?: {} }
    'profile_facts.index': { paramsTuple?: []; params?: {} }
    'profile_facts.store': { paramsTuple?: []; params?: {} }
    'profile_facts.reorder': { paramsTuple?: []; params?: {} }
    'profile_facts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile_facts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'social_links.index': { paramsTuple?: []; params?: {} }
    'social_links.store': { paramsTuple?: []; params?: {} }
    'social_links.reorder': { paramsTuple?: []; params?: {} }
    'social_links.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'social_links.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'highlights.index': { paramsTuple?: []; params?: {} }
    'highlights.store': { paramsTuple?: []; params?: {} }
    'highlights.reorder': { paramsTuple?: []; params?: {} }
    'highlights.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'highlights.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'skill_categories.index': { paramsTuple?: []; params?: {} }
    'skill_categories.store': { paramsTuple?: []; params?: {} }
    'skill_categories.reorder': { paramsTuple?: []; params?: {} }
    'skill_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'skill_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'skill_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'skills.index': { paramsTuple?: []; params?: {} }
    'skills.store': { paramsTuple?: []; params?: {} }
    'skills.reorder': { paramsTuple?: []; params?: {} }
    'skills.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'skills.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'skills.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'projects.reorder': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'experiences.index': { paramsTuple?: []; params?: {} }
    'experiences.store': { paramsTuple?: []; params?: {} }
    'experiences.reorder': { paramsTuple?: []; params?: {} }
    'experiences.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'experiences.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'experiences.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.index': { paramsTuple?: []; params?: {} }
    'messages.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media.index': { paramsTuple?: []; params?: {} }
    'media.upload': { paramsTuple?: []; params?: {} }
    'media.create_youtube': { paramsTuple?: []; params?: {} }
    'media.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'public.home': { paramsTuple?: []; params?: {} }
    'public.projects': { paramsTuple?: []; params?: {} }
    'public.project_detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.skill_detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.sitemap': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'site_settings.show': { paramsTuple?: []; params?: {} }
    'profile_facts.index': { paramsTuple?: []; params?: {} }
    'social_links.index': { paramsTuple?: []; params?: {} }
    'highlights.index': { paramsTuple?: []; params?: {} }
    'skill_categories.index': { paramsTuple?: []; params?: {} }
    'skill_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'skills.index': { paramsTuple?: []; params?: {} }
    'skills.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'experiences.index': { paramsTuple?: []; params?: {} }
    'experiences.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.index': { paramsTuple?: []; params?: {} }
    'messages.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media.index': { paramsTuple?: []; params?: {} }
    'media.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'public.home': { paramsTuple?: []; params?: {} }
    'public.projects': { paramsTuple?: []; params?: {} }
    'public.project_detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.skill_detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.sitemap': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'site_settings.show': { paramsTuple?: []; params?: {} }
    'profile_facts.index': { paramsTuple?: []; params?: {} }
    'social_links.index': { paramsTuple?: []; params?: {} }
    'highlights.index': { paramsTuple?: []; params?: {} }
    'skill_categories.index': { paramsTuple?: []; params?: {} }
    'skill_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'skills.index': { paramsTuple?: []; params?: {} }
    'skills.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'experiences.index': { paramsTuple?: []; params?: {} }
    'experiences.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.index': { paramsTuple?: []; params?: {} }
    'messages.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media.index': { paramsTuple?: []; params?: {} }
    'media.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'contact.submit': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'profile_facts.store': { paramsTuple?: []; params?: {} }
    'social_links.store': { paramsTuple?: []; params?: {} }
    'highlights.store': { paramsTuple?: []; params?: {} }
    'skill_categories.store': { paramsTuple?: []; params?: {} }
    'skills.store': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'experiences.store': { paramsTuple?: []; params?: {} }
    'media.upload': { paramsTuple?: []; params?: {} }
    'media.create_youtube': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'auth.change_password': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'site_settings.update': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'profile_facts.reorder': { paramsTuple?: []; params?: {} }
    'profile_facts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'social_links.reorder': { paramsTuple?: []; params?: {} }
    'social_links.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'highlights.reorder': { paramsTuple?: []; params?: {} }
    'highlights.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'skill_categories.reorder': { paramsTuple?: []; params?: {} }
    'skill_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'skills.reorder': { paramsTuple?: []; params?: {} }
    'skills.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.reorder': { paramsTuple?: []; params?: {} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'experiences.reorder': { paramsTuple?: []; params?: {} }
    'experiences.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'profile_facts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'social_links.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'highlights.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'skill_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'skills.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'experiences.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}