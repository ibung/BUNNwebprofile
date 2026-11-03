import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

const ALLOWED_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'a',
  'b',
  'i',
  'strong',
  'em',
  'strike',
  's',
  'del',
  'code',
  'pre',
  'hr',
  'br',
  'ul',
  'ol',
  'li',
  'blockquote',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
]

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions['allowedAttributes'] = {
  a: ['href', 'name', 'target', 'rel', 'title'],
  code: ['class'],
  th: ['align'],
  td: ['align'],
}

export default class MarkdownService {
  /**
   * Mengonversi teks Markdown ke HTML yang aman (tersanitasi).
   * Mencegah serangan XSS seperti <script>, event handlers (onerror, onload), dan skema berbahaya.
   */
  static async render(markdown: string | null | undefined): Promise<string> {
    if (!markdown || markdown.trim() === '') {
      return ''
    }

    const rawHtml = await marked.parse(markdown, {
      gfm: true,
      breaks: true,
    })

    const cleanHtml = sanitizeHtml(rawHtml, {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: ALLOWED_ATTRIBUTES,
      allowedSchemes: ['http', 'https', 'mailto'],
      transformTags: {
        a: (_tagName, attribs) => {
          const href = attribs.href || ''
          const isExternal = href.startsWith('http://') || href.startsWith('https://')
          return {
            tagName: 'a',
            attribs: {
              ...attribs,
              ...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
            },
          }
        },
      },
    })

    return cleanHtml.trim()
  }

  /**
   * Mengonversi Markdown ke HTML tersanitasi, atau mengembalikan null jika input null/kosong.
   */
  static async renderOrNull(markdown: string | null | undefined): Promise<string | null> {
    if (!markdown || markdown.trim() === '') {
      return null
    }
    return this.render(markdown)
  }
}
