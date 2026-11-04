import type { PublicMedia } from '@bunn/shared'
import type Media from '#models/media'

export default class PublicMediaTransformer {
  /**
   * Mengubah model Media menjadi representasi PublicMedia sesuai kontrak API publik.
   */
  static transform(media: Media | null | undefined): PublicMedia | null {
    if (!media) {
      return null
    }

    const urls: PublicMedia['urls'] = {}

    if (media.kind === 'image') {
      if (media.storageKey) {
        urls.original = `/uploads/${media.storageKey}`
      }
      if (media.variants) {
        if (media.variants.thumb) {
          urls.thumb = `/uploads/${media.variants.thumb}`
        }
        if (media.variants.md) {
          urls.md = `/uploads/${media.variants.md}`
        }
        if (media.variants.lg) {
          urls.lg = `/uploads/${media.variants.lg}`
        }
      }
      if (!urls.thumb && urls.original) {
        urls.thumb = urls.original
      }
      if (!urls.md && urls.original) {
        urls.md = urls.original
      }
    } else if (media.kind === 'video' || media.kind === 'document') {
      if (media.storageKey) {
        urls.original = `/uploads/${media.storageKey}`
      }
    }

    return {
      id: media.id,
      kind: media.kind,
      title: media.title,
      altText: media.altText,
      caption: media.caption,
      width: media.width,
      height: media.height,
      urls,
      youtube:
        media.kind === 'youtube' && media.youtubeId
          ? {
              id: media.youtubeId,
              startSeconds: media.youtubeStartSeconds ?? 0,
            }
          : null,
      posterUrl: media.posterKey ? `/uploads/${media.posterKey}` : null,
      mimeType: media.mimeType,
      durationSeconds: media.durationSeconds,
    }
  }

  /**
   * Mengubah kumpulan model Media menjadi PublicMedia[]
   */
  static transformMany(mediaList: (Media | null | undefined)[]): PublicMedia[] {
    const results: PublicMedia[] = []
    for (const item of mediaList) {
      const transformed = this.transform(item)
      if (transformed) {
        results.push(transformed)
      }
    }
    return results
  }
}
