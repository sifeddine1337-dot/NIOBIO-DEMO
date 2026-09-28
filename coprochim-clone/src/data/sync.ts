/**
 * Bridge between the storefront's synchronous data API and the backend.
 *
 * On boot the static catalog is already in the store, so the site renders
 * instantly and still works when the API is unavailable (static hosting, plain
 * `vite build`). When the API answers, its catalog replaces the static one so
 * admin edits show up everywhere.
 */
import { api } from '../lib/api'
import { replaceCatalog } from './store'
import type { CatalogPayload } from './store'

/** Pulls the catalog from the API and installs it. Returns false on failure. */
export async function loadCatalogFromServer(): Promise<boolean> {
  try {
    const payload = await api.get<CatalogPayload>('/catalog')
    replaceCatalog(payload)
    return true
  } catch {
    // No backend (static hosting) or a transient error — keep the static data.
    return false
  }
}