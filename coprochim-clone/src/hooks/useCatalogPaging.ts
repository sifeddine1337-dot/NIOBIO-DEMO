import { useMemo, useState } from 'react'
import { searchProducts } from '../data/catalog'
import type { Product } from '../data/types'

/** Sort options exposed by the shop toolbar, mirroring WooCommerce's list. */
export type SortKey = 'default' | 'popularity' | 'latest' | 'price-asc' | 'price-desc'

export const SORT_KEYS: SortKey[] = ['default', 'popularity', 'latest', 'price-asc', 'price-desc']

/** Page number, or a literal gap marker for the ellipsis. */
export type PageItem = number | 'gap'

interface UseCatalogPagingOptions {
  products: Product[]
  perPage?: number
}

/**
 * Client-side search / sort / pagination over a product list. The source site
 * paginates 15 products per page; `popularity` and `latest` are approximated
 * locally because the clone has no sales or date metadata.
 */
export function useCatalogPaging({ products, perPage = 15 }: UseCatalogPagingOptions) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('default')
  const [page, setPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState({ query, sort })

  // A new search or sort restarts from the first page. Adjusting state during
  // render avoids an extra pass through an effect.
  // https://react.dev/learn/you-might-not-need-an-effect
  if (activeFilters.query !== query || activeFilters.sort !== sort) {
    setActiveFilters({ query, sort })
    setPage(1)
  }

  const filtered = useMemo(() => {
    const matched = searchProducts(products, query)
    if (sort === 'default') return matched

    const sorted = [...matched]
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'latest':
        return sorted.sort((a, b) => b.id - a.id)
      case 'popularity':
        // Without ratings or sales data, reference code order is the closest
        // stable proxy for the source site's "most popular" ordering.
        return sorted.sort((a, b) => a.ref.localeCompare(b.ref, 'en'))
      default:
        return sorted
    }
  }, [products, query, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(page, totalPages)

  const items = useMemo(
    () => filtered.slice((currentPage - 1) * perPage, currentPage * perPage),
    [filtered, currentPage, perPage],
  )

  const pageItems = useMemo(() => buildPageItems(currentPage, totalPages), [currentPage, totalPages])

  const reset = () => {
    setQuery('')
    setSort('default')
    setPage(1)
  }

  return {
    query,
    setQuery,
    sort,
    setSort,
    page: currentPage,
    setPage,
    totalPages,
    total: filtered.length,
    items,
    pageItems,
    hasFilters: query.trim() !== '' || sort !== 'default',
    reset,
  }
}

/** `[1, 'gap', 7, 8, 9, 'gap', 121]`-style window around the current page. */
function buildPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const items: PageItem[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) items.push('gap')
  for (let page = start; page <= end; page += 1) items.push(page)
  if (end < total - 1) items.push('gap')
  items.push(total)

  return items
}
