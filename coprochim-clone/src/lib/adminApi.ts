/**
 * Typed wrapper around the admin endpoints.
 *
 * Every screen in the control panel goes through this module so the URL shapes,
 * payload types and (for orders) the status values stay in one place. Auth is
 * handled by `api.ts`, which attaches the stored bearer token.
 */
import type { CatalogueItem, SiteSettings } from '../data/siteDefaults'
import type { Category, Product } from '../data/types'
import { api } from './api'
import type {
  AdminOrder,
  CategoryInput,
  OrderStatus,
  ProductInput,
  ProductPage,
  SettingsPayload,
} from '../pages/admin/types'

/** Payload of `GET /api/catalog`. */
export interface CatalogResponse {
  categories: Category[]
  products: Product[]
  settings: SettingsPayload
  updatedAt: string | null
}

export const adminApi = {
  login: (password: string) =>
    api.post<{ token: string; expiresAt: number }>('/login', { password }),

  logout: () => api.post<{ ok: boolean }>('/logout'),

  /** Full catalog + settings, used to sync the storefront after a save. */
  catalog: () => api.get<CatalogResponse>('/catalog'),

  /* ---- products ---- */

  products: (params: {
    q?: string
    categorySlug?: string
    page?: number
    perPage?: number
  }) => {
    const search = new URLSearchParams()
    if (params.q) search.set('q', params.q)
    if (params.categorySlug) search.set('categorySlug', params.categorySlug)
    search.set('page', String(params.page ?? 1))
    search.set('perPage', String(params.perPage ?? 25))
    return api.get<ProductPage>(`/products?${search.toString()}`)
  },

  createProduct: (input: ProductInput) => api.post<Product>('/products', input),

  updateProduct: (id: number, input: ProductInput) => api.put<Product>(`/products/${id}`, input),

  deleteProduct: (id: number) => api.del<{ ok: boolean }>(`/products/${id}`),

  /* ---- categories ---- */

  categories: () => api.get<Category[]>('/categories'),

  createCategory: (input: CategoryInput) => api.post<Category>('/categories', input),

  updateCategory: (id: number, input: CategoryInput) => api.put<Category>(`/categories/${id}`, input),

  deleteCategory: (id: number) => api.del<{ ok: boolean }>(`/categories/${id}`),

  /* ---- settings ---- */

  settings: () => api.get<SettingsPayload>('/settings'),

  saveSettings: (payload: SettingsPayload) => api.put<SettingsPayload>('/settings', payload),

  /* ---- orders ---- */

  orders: (status?: OrderStatus | 'all') => {
    const query = status && status !== 'all' ? `?status=${status}` : ''
    return api.get<AdminOrder[]>(`/orders${query}`)
  },

  updateOrder: (id: number, body: { status?: OrderStatus; customer?: AdminOrder['customer'] }) =>
    api.put<AdminOrder>(`/orders/${id}`, body),

  deleteOrder: (id: number) => api.del<{ ok: boolean }>(`/orders/${id}`),
}

/** Settings payload defaults, used before the API answers. */
export const EMPTY_SETTINGS: SettingsPayload = {
  site: {} as SiteSettings,
  catalogues: [] as CatalogueItem[],
}