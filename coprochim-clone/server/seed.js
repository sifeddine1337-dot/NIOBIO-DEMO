/**
 * First-boot seed for the JSON store.
 *
 * The starting catalog is lifted verbatim out of the generated data file
 * (`src/data/catalog.generated.ts`) so the control panel begins with exactly
 * the products and categories the storefront already ships. Nothing is
 * downloaded here — the file is parsed locally.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const GENERATED_FILE = join(here, '..', 'src', 'data', 'catalog.generated.ts')

/**
 * Reads the JSON-compatible array literal that follows `marker` in `source`.
 * The generated file stores each entry as a quoted-key object, so once the
 * surrounding TypeScript is stripped the body is valid JSON.
 */
function extractArray(source, marker) {
  const markerIndex = source.indexOf(marker)
  if (markerIndex === -1) throw new Error(`Seed marker not found: ${marker}`)

  // Skip the type annotation (`Category[]`, `Product[]`) by starting after the
  // `=` that precedes the actual array literal.
  const equalsIndex = source.indexOf('=', markerIndex)
  if (equalsIndex === -1) throw new Error(`Assignment not found for: ${marker}`)

  const start = source.indexOf('[', equalsIndex)
  if (start === -1) throw new Error(`Array start not found for: ${marker}`)

  let depth = 0
  let inString = false
  let escaped = false

  for (let i = start; i < source.length; i += 1) {
    const char = source[i]

    if (inString) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === '"') inString = false
      continue
    }

    if (char === '"') inString = true
    else if (char === '[') depth += 1
    else if (char === ']') {
      depth -= 1
      if (depth === 0) return JSON.parse(source.slice(start, i + 1))
    }
  }

  throw new Error(`Unterminated array for: ${marker}`)
}

/** Default site settings, mirroring `src/data/siteDefaults.ts`. */
const DEFAULT_SITE = {
  topPhones: ['045.62.54.54 / 045.62.55.55', '0550.90.17.09', '045 .62 .03 .88'],
  phoneLines: ['045 62 04 15', '045 62 03 97', '045 62 54 54', '045 62 55 55'],
  deliveryPhone: '045 62 04 15',
  availabilityPhone: '045 62 55 55',
  fax: '045 62 03 88',
  email: 'contact@example.dz',
  address: {
    line1: '33, Rue Mustapha Benboulaid',
    line2: 'Siège social Sig',
    line3: '29300 - BP 95',
  },
  orderForm: '/images/bon-de-commande.pdf',
  socials: [
    { icon: 'facebook', label: 'Facebook' },
    { icon: 'instagram', label: 'Instagram' },
    { icon: 'twitter', label: 'Twitter' },
    { icon: 'youtube', label: 'Youtube' },
  ],
  /** Swap-in images for the home page hero / why-us / logo slots. */
  images: {
    hero: '/images/hero.png',
    whyUs: '/images/why-us.webp',
    logo: '/images/logo-header.svg',
  },
}

/** Default downloadable catalogues, mirroring `src/data/siteDefaults.ts`. */
const DEFAULT_CATALOGUES = [
  {
    titleFr: 'Catalogue 2023 - 2024',
    titleAr: 'كتالوج 2023 - 2024',
    file: '/images/bon-de-commande.pdf',
    cover: '/images/catalogue-2023-2024.png',
  },
  {
    titleFr: 'Catalogue COVID 2021 - 2022',
    titleAr: 'كتالوج 2021 - 2022',
    file: '/images/bon-de-commande.pdf',
    cover: '/images/catalogue-covid-2021-2022.png',
  },
]

/** Builds the initial store payload. */
export function buildSeed() {
  if (!existsSync(GENERATED_FILE)) {
    throw new Error(`Generated catalog not found at ${GENERATED_FILE}`)
  }

  const source = readFileSync(GENERATED_FILE, 'utf8')
  const categories = extractArray(source, 'export const categories')
  const products = extractArray(source, 'export const products')

  return {
    categories,
    products,
    settings: { site: DEFAULT_SITE, catalogues: DEFAULT_CATALOGUES },
    orders: [],
    meta: {
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }
}

export { DEFAULT_SITE, DEFAULT_CATALOGUES }