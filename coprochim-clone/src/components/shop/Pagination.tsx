import type { PageItem } from '../../hooks/useCatalogPaging'
import { useLanguage } from '../../hooks/useLanguage'
import { ChevronLeftIcon, ChevronRightIcon } from '../common/Icons'
import './Pagination.css'

interface PaginationProps {
  page: number
  totalPages: number
  items: PageItem[]
  onChange: (page: number) => void
}

/** Prev/next pager with a windowed list of page numbers and ellipses. */
export function Pagination({ page, totalPages, items, onChange }: PaginationProps) {
  const { t, isRTL } = useLanguage()
  const PrevChevron = isRTL ? ChevronRightIcon : ChevronLeftIcon
  const NextChevron = isRTL ? ChevronLeftIcon : ChevronRightIcon

  if (totalPages <= 1) return null

  const goTo = (next: number) => {
    onChange(Math.min(Math.max(next, 1), totalPages))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="pager" aria-label={t('pagination.prev')}>
      <button
        type="button"
        className="pager__step"
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
      >
        <PrevChevron size={16} />
        <span>{t('pagination.prev')}</span>
      </button>

      <ul className="pager__list">
        {items.map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} className="pager__gap" aria-hidden="true">
              &hellip;
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={item === page ? 'pager__page pager__page--active' : 'pager__page'}
                onClick={() => goTo(item)}
                aria-current={item === page ? 'page' : undefined}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className="pager__step"
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
      >
        <span>{t('pagination.next')}</span>
        <NextChevron size={16} />
      </button>
    </nav>
  )
}

export default Pagination
