/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  public: {
    home: typeof routes['public.home']
    projects: typeof routes['public.projects']
    projectDetail: typeof routes['public.project_detail']
    skillDetail: typeof routes['public.skill_detail']
    sitemap: typeof routes['public.sitemap']
  }
  contact: {
    submit: typeof routes['contact.submit']
  }
  auth: {
    login: typeof routes['auth.login']
    logout: typeof routes['auth.logout']
    me: typeof routes['auth.me']
    changePassword: typeof routes['auth.change_password']
  }
  profile: {
    show: typeof routes['profile.show']
    update: typeof routes['profile.update']
  }
  siteSettings: {
    show: typeof routes['site_settings.show']
    update: typeof routes['site_settings.update']
  }
  profileFacts: {
    index: typeof routes['profile_facts.index']
    store: typeof routes['profile_facts.store']
    reorder: typeof routes['profile_facts.reorder']
    update: typeof routes['profile_facts.update']
    destroy: typeof routes['profile_facts.destroy']
  }
  socialLinks: {
    index: typeof routes['social_links.index']
    store: typeof routes['social_links.store']
    reorder: typeof routes['social_links.reorder']
    update: typeof routes['social_links.update']
    destroy: typeof routes['social_links.destroy']
  }
  highlights: {
    index: typeof routes['highlights.index']
    store: typeof routes['highlights.store']
    reorder: typeof routes['highlights.reorder']
    update: typeof routes['highlights.update']
    destroy: typeof routes['highlights.destroy']
  }
  skillCategories: {
    index: typeof routes['skill_categories.index']
    store: typeof routes['skill_categories.store']
    reorder: typeof routes['skill_categories.reorder']
    show: typeof routes['skill_categories.show']
    update: typeof routes['skill_categories.update']
    destroy: typeof routes['skill_categories.destroy']
  }
  skills: {
    index: typeof routes['skills.index']
    store: typeof routes['skills.store']
    reorder: typeof routes['skills.reorder']
    show: typeof routes['skills.show']
    update: typeof routes['skills.update']
    destroy: typeof routes['skills.destroy']
  }
  projects: {
    index: typeof routes['projects.index']
    store: typeof routes['projects.store']
    reorder: typeof routes['projects.reorder']
    show: typeof routes['projects.show']
    update: typeof routes['projects.update']
    updateStatus: typeof routes['projects.update_status']
    destroy: typeof routes['projects.destroy']
  }
  experiences: {
    index: typeof routes['experiences.index']
    store: typeof routes['experiences.store']
    reorder: typeof routes['experiences.reorder']
    show: typeof routes['experiences.show']
    update: typeof routes['experiences.update']
    destroy: typeof routes['experiences.destroy']
  }
  messages: {
    index: typeof routes['messages.index']
    show: typeof routes['messages.show']
    update: typeof routes['messages.update']
    destroy: typeof routes['messages.destroy']
  }
  media: {
    index: typeof routes['media.index']
    upload: typeof routes['media.upload']
    createYoutube: typeof routes['media.create_youtube']
    show: typeof routes['media.show']
    update: typeof routes['media.update']
    destroy: typeof routes['media.destroy']
  }
}
