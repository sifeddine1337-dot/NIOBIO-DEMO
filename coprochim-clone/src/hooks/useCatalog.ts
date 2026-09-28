import { useSyncExternalStore } from 'react'
import { getVersion, subscribe } from '../data/store'

/**
 * Re-renders the calling component whenever the catalog store changes.
 *
 * Components read `categories` / `products` / `site` straight from the data
 * modules; this hook only needs to trigger the re-render after the admin panel
 * (or the boot-time API sync) has replaced that data.
 */
export function useCatalog(): number {
  return useSyncExternalStore(subscribe, getVersion, getVersion)
}

export default useCatalog