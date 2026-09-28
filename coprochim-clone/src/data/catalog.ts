/**
 * Read access layer over the catalog store. Components import from here rather
 * than touching the store directly, so lookups and ordering rules live in one
 * place. The underlying arrays are mutated in place when the admin panel saves
 * (see `store.ts`), so these bindings always reflect the current data.
 */
import { categories, getVersion, products } from './store'
import type { Category, Product } from './types'

export { categories, products }

/** Number of products currently in the catalog. */
export const totalProducts = (): number => products.length

/** Bilingual labels are always shown together, matching the source site. */
export const categoryLabel = (category: Category): string =>
  `${category.nameFr} — ${category.nameAr}`

/**
 * Slug lookups are rebuilt lazily whenever the store version changes, so a
 * freshly added or renamed item is immediately resolvable.
 */
let lookupVersion = -1
let categoryBySlug = new Map<string, Category>()
let productBySlug = new Map<string, Product>()

function ensureLookups(): void {
  const current = getVersion()
  if (current === lookupVersion) return
  categoryBySlug = new Map(categories.map((category) => [category.slug, category]))
  productBySlug = new Map(products.map((product) => [product.slug, product]))
  lookupVersion = current
}

export const getCategory = (slug: string | undefined): Category | undefined => {
  if (!slug) return undefined
  ensureLookups()
  return categoryBySlug.get(slug)
}

export const getProduct = (slug: string | undefined): Product | undefined => {
  if (!slug) return undefined
  ensureLookups()
  return productBySlug.get(slug)
}

export const productsInCategory = (categorySlug: string): Product[] =>
  products.filter((product) => product.categorySlug === categorySlug)

/**
 * Round-robins through the categories so a grid of a given length still shows
 * a wide spread of subjects instead of 8 items from one category.
 */
export function featuredProducts(limit: number): Product[] {
  const buckets = categories.map((category) => productsInCategory(category.slug))
  const picked: Product[] = []

  for (let depth = 0; picked.length < limit; depth += 1) {
    let addedSomething = false
    for (const bucket of buckets) {
      const product = bucket[depth]
      if (!product) continue
      picked.push(product)
      addedSomething = true
      if (picked.length >= limit) break
    }
    if (!addedSomething) break
  }

  return picked
}

/** Up to `limit` other products from the same category, topped up if needed. */
export function relatedProducts(product: Product, limit = 4): Product[] {
  const siblings = productsInCategory(product.categorySlug).filter(
    (candidate) => candidate.id !== product.id,
  )
  if (siblings.length >= limit) return siblings.slice(0, limit)
  const filler = featuredProducts(limit * 2).filter(
    (candidate) => candidate.id !== product.id && !siblings.includes(candidate),
  )
  return [...siblings, ...filler].slice(0, limit)
}

/** Case- and diacritic-insensitive match over French and Arabic names and refs. */
export function searchProducts(source: Product[], query: string): Product[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return source
  const normalize = (value: string) => value.toLowerCase()
  return source.filter((product) =>
    [product.nameFr, product.nameAr, product.ref].some((field) =>
      normalize(field).includes(needle),
    ),
  )
}

export type { Category, Product }
