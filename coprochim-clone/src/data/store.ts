/**
 * Mutable catalog store.
 *
 * The storefront's data API (`catalog.ts`, `site.ts`) is synchronous, so the
 * live data is held in module scope here. It starts from the generated catalog,
 * and `replaceCatalog()` swaps in whatever the admin API returns — mutating the
 * arrays in place so the long-lived `categories` / `products` bindings every
 * component already imports stay valid.
 *
 * A monotonically increasing version number lets React components re-render
 * when the admin panel saves something; subscribe via `useCatalog()`.
 */
import { categories as seedCategories, products as seedProducts } from './catalog.generated'
import type { Category, Product } from './types'
import { DEFAULT_CATALOGUES, DEFAULT_SITE } from './siteDefaults'
import type { CatalogueItem, SiteSettings } from './siteDefaults'

export const categories: Category[] = [...seedCategories]
export const products: Product[] = [...seedProducts]

/** Editable site content (contact details, images) and catalogue downloads. */
export const storeSettings: { site: SiteSettings; catalogues: CatalogueItem[] } = {
  site: { ...DEFAULT_SITE },
  catalogues: [...DEFAULT_CATALOGUES],
}

let version = 0
const listeners = new Set<() => void>()

/** Current store version; changes every time data is replaced. */
export const getVersion = (): number => version

/** Registers a listener. Returns an unsubscribe function. */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Notifies every subscriber that the store changed. */
export function notify(): void {
  version += 1
  for (const listener of listeners) listener()
}

/** Replaces an array's contents while keeping its identity stable. */
function replaceContents<T>(target: T[], next: T[]): void {
  target.splice(0, target.length, ...next)
}

export interface CatalogPayload {
  categories?: Category[]
  products?: Product[]
  settings?: { site?: SiteSettings; catalogues?: CatalogueItem[] }
}

/**
 * Installs data coming from the API. Missing sections are left untouched, so a
 * partial response can never wipe the storefront.
 */
export function replaceCatalog(payload: CatalogPayload): void {
  if (Array.isArray(payload.categories)) replaceContents(categories, payload.categories)
  if (Array.isArray(payload.products)) replaceContents(products, payload.products)

  // Merged in place so the `site` binding exported by `site.ts` stays valid.
  if (payload.settings?.site) Object.assign(storeSettings.site, payload.settings.site)
  if (Array.isArray(payload.settings?.catalogues)) {
    replaceContents(storeSettings.catalogues, payload.settings.catalogues)
  }

  notify()
}