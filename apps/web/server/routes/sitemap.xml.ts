import type { ApiSuccess, PublicSitemapData } from '@bunn/shared'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl as string) || 'https://bunn.my.id'
  const apiInternalUrl = (config.apiInternalUrl as string) || 'http://localhost:3333'

  let sitemapData: PublicSitemapData = { projects: [], skills: [] }

  try {
    const res = await $fetch<ApiSuccess<PublicSitemapData>>(
      `${apiInternalUrl}/api/public/sitemap`
    )
    sitemapData = res.data
  } catch (err) {
    // Fallback jika API sedang tidak tersambung saat build
    console.error('Gagal mengambil data sitemap dari API:', err)
  }

  const urls: Array<{
    loc: string
    lastmod?: string
    changefreq: string
    priority: string
  }> = [
    { loc: `${siteUrl}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${siteUrl}/projects`, changefreq: 'weekly', priority: '0.8' },
  ]

  for (const project of sitemapData.projects) {
    urls.push({
      loc: `${siteUrl}/projects/${project.slug}`,
      lastmod: project.updatedAt ? project.updatedAt.slice(0, 10) : undefined,
      changefreq: 'monthly',
      priority: '0.7',
    })
  }

  for (const skill of sitemapData.skills) {
    urls.push({
      loc: `${siteUrl}/skills/${skill.slug}`,
      lastmod: skill.updatedAt ? skill.updatedAt.slice(0, 10) : undefined,
      changefreq: 'monthly',
      priority: '0.6',
    })
  }

  const xmlEntries = urls
    .map((u) => {
      let entry = `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>`
      if (u.lastmod) {
        entry += `\n    <lastmod>${u.lastmod}</lastmod>`
      }
      entry += `\n  </url>`
      return entry
    })
    .join('\n')

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

  return sitemapXml
})
