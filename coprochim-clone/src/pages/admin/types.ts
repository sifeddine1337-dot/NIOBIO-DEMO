/**
 * Types shared by the control panel screens.
 *
 * Catalog shapes are reused from the storefront (`Product`, `Category`,
 * `OrderDraft`) so the panel and the public site can never drift apart.
 */
import type { OrderDraft } from '../../contexts/cartContext'
import type { CatalogueItem, SiteSettings } from '../../data/siteDefaults'
import type { Category, Product } from '../../data/types'

/** Lifecycle of a cash-on-delivery order. */
export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled'

/** Every status, in the order the panel presents them. */
export const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'delivered', 'cancelled']

/** An order as stored by the backend. */
export interface AdminOrder extends OrderDraft {
  id: number
  /** Human-readable reference, e.g. `CMD-0007`. */
  number: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

/** Editable product fields sent to `POST/PUT /api/products`. */
export type ProductInput = Omit<Product, 'id'> & { id?: number }

/** Editable category fields sent to `POST/PUT /api/categories`. */
export type CategoryInput = Omit<Category, 'id'> & { id?: number }

/** Body of `PUT /api/settings`. */
export interface SettingsPayload {
  site: SiteSettings
  catalogues: CatalogueItem[]
}

/** Shape returned by `GET /api/products`. */
export interface ProductPage {
  items: Product[]
  total: number
  page: number
  perPage: number
}