export interface TitleSegment {
  text: string
  isAccent: boolean
}

/**
 * Validates whether the accent text is contained within the full main title text.
 * - If accent is empty, returns true (accent is optional).
 * - If accent is provided but main is empty, returns false.
 * - Otherwise checks if main contains accent (case-insensitive).
 */
export function isAccentMatching(main?: string | null, accent?: string | null): boolean {
  if (!accent || !accent.trim()) {
    return true
  }
  if (!main || !main.trim()) {
    return false
  }
  return main.toLowerCase().includes(accent.trim().toLowerCase())
}

/**
 * Parses a section title into segments of regular text and accented/italic text.
 *
 * Concepts supported:
 * 1. Substring Accent (New Concept):
 *    Main title contains the full headline (e.g. "Alat pendukung.").
 *    Accent specifies the word or substring to italicize (e.g. "pendukung." or "ukung").
 *    Any spaces before/after are cleanly preserved.
 *
 * 2. Legacy Two-Part Data:
 *    If main and accent were saved as separate chunks (e.g. main: "Alat", accent: "pendukung."),
 *    joins them with a guaranteed space so words never stick together.
 */
export function parseSectionTitle(
  main?: string | null,
  accent?: string | null,
  defaultMain: string = '',
  defaultAccent: string = ''
): TitleSegment[] {
  const full = (main !== undefined && main !== null && main.trim() !== '') ? main : defaultMain
  const highlight = (accent !== undefined && accent !== null && accent.trim() !== '') ? accent : defaultAccent

  if (!full) {
    return []
  }

  if (!highlight || !highlight.trim()) {
    return [{ text: full, isAccent: false }]
  }

  const lowerFull = full.toLowerCase()
  const trimmedHighlight = highlight.trim()
  const lowerHighlight = trimmedHighlight.toLowerCase()
  const matchIndex = lowerFull.indexOf(lowerHighlight)

  if (matchIndex !== -1) {
    const before = full.slice(0, matchIndex)
    const matched = full.slice(matchIndex, matchIndex + trimmedHighlight.length)
    const after = full.slice(matchIndex + trimmedHighlight.length)

    const segments: TitleSegment[] = []
    if (before) segments.push({ text: before, isAccent: false })
    segments.push({ text: matched, isAccent: true })
    if (after) segments.push({ text: after, isAccent: false })
    return segments
  }

  // Fallback for legacy split chunks: ensures guaranteed single space between words
  const trimmedMain = full.trimEnd()
  const trimmedAccent = highlight.trimStart()

  return [
    { text: `${trimmedMain} `, isAccent: false },
    { text: trimmedAccent, isAccent: true },
  ]
}

