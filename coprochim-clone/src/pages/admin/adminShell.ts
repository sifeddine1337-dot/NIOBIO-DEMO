/**
 * Context handed from the panel shell (`AdminApp`) to each screen through
 * the router outlet, so screens can translate copy, report feedback and
 * refresh shared data without prop drilling.
 */
import { useOutletContext } from 'react-router-dom'
import type { Language } from '../../data/types'
import type { AdminTextKey } from './adminText'
import type { AdminOrder } from './types'

export interface AdminShell {
  /** Translate a panel string. */
  t: (key: AdminTextKey) => string
  /** Active panel language (independent of the storefront language). */
  lang: Language
  setLang: (lang: Language) => void
  /** Shows a success or error banner at the top of the panel. */
  notify: (message: string, kind?: 'ok' | 'error') => void
  /** Re-reads products/categories/settings so the storefront picks changes up. */
  refreshCatalog: () => Promise<void>
  /** Orders currently known to the panel (shared by the dashboard and list). */
  orders: AdminOrder[]
  ordersLoading: boolean
  refreshOrders: () => Promise<void>
}

/** Reads the panel shell context. Must be called inside an `/admin` route. */
export function useAdminShell(): AdminShell {
  return useOutletContext<AdminShell>()
}