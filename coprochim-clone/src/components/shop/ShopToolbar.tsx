import type { Category } from '../../data/types'
import type { TranslationKey } from '../../i18n/translations'
import { SORT_KEYS, type SortKey } from '../../hooks/useCatalogPaging'
import { useLanguage } from '../../hooks/useLanguage'
import { SearchIcon } from '../common/Icons'
import './ShopToolbar.css'

const SORT_LABEL_KEYS: Record<SortKey, TranslationKey> = {
  default: 'shop.sortDefault',
  popularity: 'shop.sortPopularity',
  latest: 'shop.sortLatest',
  'price-asc': 'shop.sortPriceAsc',
  'price-desc': 'shop.sortPriceDesc',
}

interface ShopToolbarProps {
  query: string
  onQueryChange: (value: string) => void
  sort: SortKey
  onSortChange: (value: SortKey) => void
  total: number
  hasFilters: boolean
  onReset: () => void
  /** Enables the category filter; omitted on category pages. */
  categories?: Category[]
  categorySlug?: string
  onCategoryChange?: (slug: string) => void
}

/**
 * Search box, sort selector, optional category filter and result count —
 * the controls WooCommerce renders above a product loop.
 */
export function ShopToolbar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  total,
  hasFilters,
  onReset,
  categories,
  categorySlug = '',
  onCategoryChange,
}: ShopToolbarProps) {
  const { t } = useLanguage()

  return (
    <div className="toolbar">
      <div className="toolbar__search">
        <SearchIcon size={18} className="toolbar__search-icon" />
        <input
          type="search"
          className="input toolbar__input"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t('shop.search')}
          aria-label={t('shop.search')}
        />
      </div>

      {categories && onCategoryChange && (
        <label className="toolbar__field">
          <span className="sr-only">{t('shop.categoryFilter')}</span>
          <select
            className="select"
            value={categorySlug}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="">{t('shop.allCategories')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.nameFr} ({category.count})
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="toolbar__field">
        <span className="sr-only">{t('shop.sortDefault')}</span>
        <select
          className="select"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortKey)}
        >
          {SORT_KEYS.map((key) => (
            <option key={key} value={key}>
              {t(SORT_LABEL_KEYS[key])}
            </option>
          ))}
        </select>
      </label>

      <div className="toolbar__meta">
        <span className="toolbar__count">
          <strong>{total.toLocaleString('en-US')}</strong> {t('shop.results')}
        </span>
        {hasFilters && (
          <button type="button" className="toolbar__reset" onClick={onReset}>
            {t('shop.clear')}
          </button>
        )}
      </div>
    </div>
  )
}

export default ShopToolbar
