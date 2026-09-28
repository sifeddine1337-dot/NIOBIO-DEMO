/**
 * Builds the seed catalog from a public WooCommerce Store API and writes:
 *   - `src/data/catalog.generated.ts`  (typed categories + products)
 *   - `public/images/products/<ref>.jpg` (one thumbnail per seeded product)
 *
 * Usage:  CATALOG_API=<store-api-base-url> node scripts/generate-catalog.mjs
 *
 * This is a development-time script. The generated module is committed so the
 * app builds without network access; re-run it to refresh the catalog.
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PRODUCT_IMG_DIR = join(ROOT, 'public', 'images', 'products')
const OUT_TS = join(ROOT, 'src', 'data', 'catalog.generated.ts')

/**
 * Store API base URL. Override with the CATALOG_API environment variable.
 * The placeholder host is never contacted unless a script is actually run.
 */
const API = process.env.CATALOG_API ?? 'https://example.invalid/wp-json/wc/store/v1'
/** How many products to seed per category. */
const PER_CATEGORY = 15

async function getJson(url) {
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&rsquo;|&#8217;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '\u2026')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * WooCommerce stores the French *and* Arabic title in a single `name` field,
 * e.g. "Sismographe (EXAO)  مسجل الزلازل ". Split on the first Arabic
 * character so each language gets its own string.
 *
 * Some source rows interleave the two languages ("(عربي … Latin text"). When
 * the leading French half comes out degenerate (a stray bracket) but Latin text
 * follows the *last* Arabic character, that trailing run is the real French
 * title — without this the catalog ends up with products literally named "(".
 */
function splitBilingual(name) {
  const cleaned = decodeEntities(name)
  const first = cleaned.match(/[\u0600-\u06FF]/)
  if (!first) return { fr: cleaned, ar: '' }

  const start = first.index
  const arabicIndexes = [...cleaned.matchAll(/[\u0600-\u06FF]/g)].map((m) => m.index)
  const lastIdx = arabicIndexes[arabicIndexes.length - 1]
  const tail = cleaned.slice(lastIdx + 1).trim()
  const tailLetters = tail.replace(/[^\p{L}\p{N}]/gu, '')

  const leading = cleaned.slice(0, start).replace(/[\s|,;:\-–—/]+$/, '').trim()
  let fr = leading
  let ar = cleaned.slice(start, lastIdx + 1).trim()

  if (tailLetters.length >= 3) {
    // Real French text sits after the Arabic half — that's the actual name.
    fr = leading.replace(/[^\p{L}\p{N}]/gu, '').length < 3 ? tail : `${leading} ${tail}`.trim()
  } else if (tail) {
    // Nothing but punctuation after the Arabic half: keep the old behaviour and
    // let it stay attached to the Arabic text.
    ar = cleaned.slice(start).trim()
  }

  return { fr, ar }
}

/** The image filename doubles as the product reference, e.g. "M080.jpg" -> "M080". */
function refFromImageUrl(url) {
  if (!url) return ''
  const file = url.split('/').pop() || ''
  return file.replace(/-\d+x\d+(?=\.\w+$)/, '').replace(/\.\w+$/, '')
}

/**
 * The Store API returns percent-encoded slugs, several of which embed Arabic
 * text (e.g. "...-tp-pgysique-et-chimie"). Decode, then keep only the latin
 * part so routes stay readable: "tp-physique-et-chimie".
 */
function cleanSlug(raw, fallback) {
  let s = raw
  try {
    s = decodeURIComponent(raw)
  } catch {
    /* keep raw if it is not valid percent-encoding */
  }
  s = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
  return s || fallback
}

/** Explicit, readable route slugs per category id (menu order). */
const CATEGORY_SLUGS = {
  29: 'ensemble-de-logiciels',
  37: 'mobilier-de-laboratoire-et-de-bureau',
  28: 'education-physique-et-sportive',
  38: 'tp-physique-et-chimie',
  27: 'geologie',
  25: 'science-de-la-vie-et-de-la-terre',
  22: 'materiels-dobservation',
  23: 'verrerie-de-laboratoire',
  24: 'audio-visuel-et-animation-culturelle',
  20: 'cartes-geographiques',
  19: 'produits-chimiques',
  18: 'arduino-et-electronique',
}

/**
 * Prefix used to synthesise the "Réf :" catalogue code shown on product pages.
 *
 * NOTE: the upstream Store API returns an empty `sku` for every product, and
 * many products share a single placeholder image, so there is no real reference
 * code to read. These codes are therefore deterministic stand-ins, not real
 * manufacturer references.
 */
const CATEGORY_REF_PREFIX = {
  29: 'L',
  37: 'F',
  28: 'S',
  38: 'T',
  27: 'G',
  25: 'B',
  22: 'O',
  23: 'V',
  24: 'A',
  20: 'M',
  19: 'P',
  18: 'E',
}

const exists = async (p) => access(p).then(() => true, () => false)

/**
 * Product image keys occasionally contain non-ASCII characters (e.g. an Arabic
 * filename), which are awkward in URLs. Reduce them to a safe ASCII name.
 */
function safeFileName(name, id) {
  const ascii = name
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/[^A-Za-z0-9._-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
  return ascii || `p-${id}`
}

async function downloadProductImage(ref, imageUrl) {
  if (!ref || !imageUrl) return ''
  const dest = join(PRODUCT_IMG_DIR, `${ref}.jpg`)
  if (!(await exists(dest))) {
    try {
      const res = await fetch(imageUrl, { redirect: 'follow' })
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer())
        if (buf.length > 100) await writeFile(dest, buf)
      }
    } catch {
      // Offline / blocked: the product keeps its local path and the browser
      // renders its broken-image placeholder until the asset is fetched.
    }
  }
  return `/images/products/${ref}.jpg`
}

async function main() {
  await mkdir(PRODUCT_IMG_DIR, { recursive: true })

  const raw = await getJson(`${API}/products/categories?per_page=50`)
  // The Store API returns categories alphabetically; the live site's grid and
  // nav dropdown follow WordPress menu order, which is this explicit ID order.
  const rawCategories = CATEGORY_ID_ORDER.map((id) => {
    const found = raw.find((c) => c.id === id)
    if (!found) throw new Error(`category id ${id} missing from Store API response`)
    return found
  })
  const categories = []
  const products = []
  const seenSlugs = new Set()
  const usedProductSlugs = new Set()

  for (const [i, cat] of rawCategories.entries()) {
    const { fr, ar } = splitBilingual(cat.name)
    const catSlug = CATEGORY_SLUGS[cat.id]
    categories.push({
      id: cat.id,
      slug: catSlug,
      nameFr: fr,
      nameAr: ar,
      count: cat.count,
      image: `/images/cat-${String(i + 1).padStart(2, '0')}.jpg`,
    })

    const items = await getJson(
      `${API}/products?per_page=${PER_CATEGORY}&category=${cat.id}&orderby=title&order=asc`,
    )

    for (const [n, item] of items.entries()) {
      if (seenSlugs.has(item.slug)) continue
      seenSlugs.add(item.slug)

      const image = item.images?.[0]
      const remote = image?.thumbnail || image?.src || ''
      const imageKey = refFromImageUrl(image?.src || image?.thumbnail || '') || `ID${item.id}`
      const local = await downloadProductImage(safeFileName(imageKey, item.id), remote)
      const { fr: nameFr, ar: nameAr } = splitBilingual(item.name)

      // Guarantee unique, readable product routes.
      let slug = cleanSlug(item.slug, safeFileName(imageKey, item.id))
      if (usedProductSlugs.has(slug)) slug = `${slug}-${item.id}`
      usedProductSlugs.add(slug)

      products.push({
        id: item.id,
        slug,
        ref: `${CATEGORY_REF_PREFIX[cat.id]}${String(n + 1).padStart(3, '0')}`,
        nameFr,
        nameAr,
        price: Number(item.prices?.price || 0),
        categorySlug: catSlug,
        image: local,
      })
    }
    console.log(`${catSlug.padEnd(42)} ${items.length} products`)
  }

  const body = `// AUTO-GENERATED by scripts/generate-catalog.mjs — do not edit by hand.
import type { Category, Product } from './types'

export const categories: Category[] = ${JSON.stringify(categories, null, 2)}

export const products: Product[] = ${JSON.stringify(products, null, 2)}
`

  await writeFile(OUT_TS, body, 'utf8')
  console.log(`\n${categories.length} categories, ${products.length} products -> src/data/catalog.generated.ts`)
}

/**
 * WordPress menu order for the 12 product categories, matching both the site's
 * mega-menu and the home page category grid. IDs come from the Store API.
 */
const CATEGORY_ID_ORDER = [29, 37, 28, 38, 27, 25, 22, 23, 24, 20, 19, 18]

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
