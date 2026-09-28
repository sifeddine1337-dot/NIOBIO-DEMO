import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { categories } from '../../data/catalog'
import { site, telHref } from '../../data/site'
import { useCart } from '../../hooks/useCart'
import { useCatalog } from '../../hooks/useCatalog'
import { useLanguage } from '../../hooks/useLanguage'
import { CloseIcon, LanguageIcon, PhoneIcon } from '../common/Icons'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

/**
 * Off-canvas navigation for small screens. Locks background scrolling and
 * closes on Escape while it is open.
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const { t, language, toggleLanguage } = useLanguage()
  const { count } = useCart()
  // Re-render when the admin panel edits the catalog or site settings.
  useCatalog()

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
      <button
        type="button"
        className="drawer__overlay"
        onClick={onClose}
        aria-label={t('nav.close')}
        tabIndex={-1}
      />

      <div className="drawer__panel">
        <div className="drawer__head">
          <img src={site.images.logo} alt="" width={132} height={42} />
          <button
            type="button"
            className="drawer__close"
            onClick={onClose}
            aria-label={t('nav.close')}
          >
            <CloseIcon size={22} />
          </button>
        </div>

        <nav className="drawer__nav" aria-label={t('nav.menu')}>
          <NavLink to="/" end className="drawer__link">
            {t('nav.home')}
          </NavLink>
          <NavLink to="/boutique" className="drawer__link">
            {t('nav.shop')}
          </NavLink>
          <NavLink to="/livraison" className="drawer__link">
            {t('nav.delivery')}
          </NavLink>
          <NavLink to="/conseil" className="drawer__link">
            {t('nav.guide')}
          </NavLink>
          <NavLink to="/a-propos" className="drawer__link">
            {t('nav.about')}
          </NavLink>
          <NavLink to="/contact" className="drawer__link">
            {t('nav.contact')}
          </NavLink>
          <NavLink to="/panier" className="drawer__link">
            {t('nav.cart')} ({count})
          </NavLink>
        </nav>

        <p className="drawer__section">{t('nav.categories')}</p>
        <ul className="drawer__categories">
          {categories.map((category) => (
            <li key={category.id}>
              <NavLink to={`/product-category/${category.slug}`} className="drawer__category">
                <img src={category.image} alt="" loading="lazy" width={44} height={44} />
                <span className="drawer__category-text">
                  <span className="drawer__category-fr" dir="ltr">
                    {category.nameFr}
                  </span>
                  <span className="drawer__category-ar">{category.nameAr}</span>
                </span>
                <span className="drawer__category-count">{category.count}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <a className="drawer__phone" href={telHref(site.deliveryPhone)}>
          <PhoneIcon size={16} />
          <span dir="ltr">{site.deliveryPhone}</span>
        </a>

        <button type="button" className="btn btn--outline btn--block" onClick={toggleLanguage}>
          <LanguageIcon size={16} />
          {language === 'ar' ? 'Français' : 'العربية'}
        </button>
      </div>
    </div>
  )
}

export default MobileNav
