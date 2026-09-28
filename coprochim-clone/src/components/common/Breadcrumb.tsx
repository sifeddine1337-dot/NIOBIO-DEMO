import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { ChevronLeftIcon, ChevronRightIcon } from './Icons'
import './Breadcrumb.css'

export interface Crumb {
  label: string
  /** Omit `to` for the trailing, non-clickable crumb. */
  to?: string
}

/** Trail of links shown above page content, e.g. Accueil / Geologie / Product. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const { isRTL } = useLanguage()
  const Chevron = isRTL ? ChevronLeftIcon : ChevronRightIcon

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="breadcrumb__item">
            {index > 0 && <Chevron size={14} className="breadcrumb__sep" />}
            {item.to ? (
              <Link to={item.to} className="breadcrumb__link">
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumb__current" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
