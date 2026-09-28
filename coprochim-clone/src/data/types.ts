/**
 * Shared domain types for the product catalog.
 * The data itself is produced by `scripts/generate-catalog.mjs`.
 */

/** A WooCommerce product category as shown in the nav mega-menu and grid. */
export interface Category {
  id: number
  /** URL slug as returned by the Store API (some contain percent-encoding). */
  slug: string
  /** French label, e.g. "GEOLOGIE". */
  nameFr: string
  /** Arabic label, e.g. "مجموعة لدراسة الجيولوجيا". */
  nameAr: string
  /** Total number of products in the category on the live site. */
  count: number
  /** Local category card image, e.g. "/images/cat-01.jpg". */
  image: string
}

/** A single catalog product. */
export interface Product {
  id: number
  slug: string
  /**
   * Displayed as "Réf : X" on the product page. Synthesised by the generator
   * because the Store API exposes an empty `sku` for every product.
   */
  ref: string
  nameFr: string
  nameAr: string
  /** Unit price in Algerian dinars (integer, minor unit 0). */
  price: number
  /** Slug of the owning category. */
  categorySlug: string
  /** Local product image path, e.g. "/images/products/LOG-05-1.jpg". */
  image: string
}

/** Supported UI languages. Arabic is the default and drives RTL. */
export type Language = 'ar' | 'fr'
