// Map raw event_options.category values to the 12 canonical user preference categories
// Canonical categories: sports, music, tech, arts, outdoors, academic, social, career, volunteering, gaming, food, fitness

export const CANONICAL_CATEGORIES = [
  'sports', 'music', 'tech', 'arts', 'outdoors', 'academic', 'social', 'career', 'volunteering', 'gaming', 'food', 'fitness'
]

const rawToCanonical: Record<string, string> = {
  // arts-related
  museums: 'arts',
  museum: 'arts',
  art_gallery: 'arts',
  gallery: 'arts',
  cinema: 'arts',
  movie_theater: 'arts',
  movie_theatre: 'arts',

  // outdoors/fitness/sports
  park: 'outdoors',
  stadium: 'sports',
  sports_stadium: 'sports',
  fitness_center: 'fitness',
  gym: 'fitness',

  // social / nightlife
  bar: 'social',
  pub: 'social',
  night_club: 'music',
  nightclub: 'music',
  bowling_alley: 'social',
  amusement_park: 'social',

  // food
  restaurant: 'food',
  restraunt: 'food',
  cafe: 'food',
  coffee_shop: 'food',

  // other
  museum_shop: 'arts',
  other: 'social',
}

export function mapCategory(raw?: string | null): string | null {
  if (!raw) return null

  // lowercase and trim
  const rawLower = String(raw).toLowerCase().trim()

  // normalized: replace any sequence of non-alphanumeric chars with single underscore,
  // collapse runs, trim leading/trailing underscores
  const normalized = rawLower
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')

  if (!normalized) return null

  // 1) exact lookup on normalized raw value
  if (rawToCanonical[normalized]) return rawToCanonical[normalized]

  // 2) exact canonical match
  if (CANONICAL_CATEGORIES.includes(normalized)) return normalized

  // 3) tokenize and check tokens individually
  const tokens = normalized.split('_').filter(Boolean)
  for (const t of tokens) {
    if (rawToCanonical[t]) return rawToCanonical[t]
    if (CANONICAL_CATEGORIES.includes(t)) return t
  }

  // 4) substring fallback: check canonical names inside normalized string
  for (const c of CANONICAL_CATEGORIES) {
    if (normalized.includes(c)) return c
  }

  // 5) substring fallback against rawToCanonical keys (prefer longer keys first)
  const rawKeys = Object.keys(rawToCanonical).sort((a, b) => b.length - a.length)
  const compact = rawLower.replace(/[^a-z0-9]+/g, '')
  for (const k of rawKeys) {
    if (normalized.includes(k)) return rawToCanonical[k]
    const kCompact = k.replace(/_/g, '')
    if (kCompact && compact.includes(kCompact)) return rawToCanonical[k]
  }

  return null
}
