export interface ParsedYouTube {
  id: string
  startSeconds: number
}

export class YouTubeService {
  /**
   * Mengekstrak ID video YouTube (11 karakter) dan start seconds dari URL.
   * Menerima format:
   * - https://www.youtube.com/watch?v=XXXXXXXXXXX
   * - https://youtu.be/XXXXXXXXXXX
   * - https://www.youtube.com/shorts/XXXXXXXXXXX
   * - https://www.youtube.com/embed/XXXXXXXXXXX
   *
   * Tanpa melakukan permintaan jaringan ke YouTube.
   */
  static parse(urlStr: string): ParsedYouTube | null {
    if (!urlStr || typeof urlStr !== 'string') return null

    try {
      const parsedUrl = new URL(urlStr.trim())
      const hostname = parsedUrl.hostname.replace(/^www\./, '').toLowerCase()

      let videoId: string | null = null

      if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
        if (parsedUrl.pathname === '/watch') {
          videoId = parsedUrl.searchParams.get('v')
        } else if (parsedUrl.pathname.startsWith('/shorts/')) {
          videoId = parsedUrl.pathname.split('/')[2] ?? null
        } else if (parsedUrl.pathname.startsWith('/embed/')) {
          videoId = parsedUrl.pathname.split('/')[2] ?? null
        }
      } else if (hostname === 'youtu.be') {
        videoId = parsedUrl.pathname.slice(1).split('/')[0] ?? null
      }

      if (!videoId) return null

      // Validasi 11 karakter YouTube ID: [A-Za-z0-9_-]
      const cleanIdMatch = videoId.match(/^[\w-]{11}$/)
      if (!cleanIdMatch) return null

      // Ekstraksi parameter waktu (t atau start)
      const timeParam = parsedUrl.searchParams.get('t') ?? parsedUrl.searchParams.get('start')
      const startSeconds = this.parseTimestamp(timeParam)

      return {
        id: videoId,
        startSeconds,
      }
    } catch {
      return null
    }
  }

  /**
   * Mengonversi string waktu (e.g. "90", "90s", "1m30s", "1h2m3s") ke detik.
   */
  static parseTimestamp(timeStr: string | null): number {
    if (!timeStr) return 0

    const cleanStr = timeStr.trim().toLowerCase()

    // Format detik murni: "90" atau "90s"
    if (/^\d+s?$/.test(cleanStr)) {
      const sec = Number.parseInt(cleanStr.replace('s', ''), 10)
      return Number.isNaN(sec) ? 0 : sec
    }

    // Format kompleks: "1h2m3s", "1m30s", "2h", "10m"
    let totalSeconds = 0
    const hourMatch = cleanStr.match(/(\d+)h/)
    const minMatch = cleanStr.match(/(\d+)m/)
    const secMatch = cleanStr.match(/(\d+)s/)

    if (hourMatch) totalSeconds += Number.parseInt(hourMatch[1], 10) * 3600
    if (minMatch) totalSeconds += Number.parseInt(minMatch[1], 10) * 60
    if (secMatch) totalSeconds += Number.parseInt(secMatch[1], 10)

    return totalSeconds
  }
}
