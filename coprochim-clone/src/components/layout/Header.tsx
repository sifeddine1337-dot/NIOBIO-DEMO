import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { categories } from '../../data/catalog'
import { site } from '../../data/site'
import { useCart } from '../../hooks/useCart'
import { useCatalog } from '../../hooks/useCatalog'
import { useLanguage } from '../../hooks/useLanguage'
import { formatPrice } from '../../lib/formatPrice'
import { CartIcon, ChevronDownIcon, GridIcon, LanguageIcon, MenuIcon } from '../common/Icons'
import { MobileNav } from './MobileNav'
import { TopBar } from './TopBar'
import './Header.css'

type Panel = 'shop' | 'categories' | null

export function Header() {
  const { t, language, toggleLanguage } = useLanguage()
  const { count, subtotal } = useCart()
  // Re-render when the admin panel edits categories or site settings.
  useCatalog()
  const { pathname } = useLocation()
  const [openPanel, setOpenPanel] = useState<Panel>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)
  const closeTimer = useRef<number | undefined>(undefined)

  // Adjust state during render rather than in an effect: any navigation
  // dismisses the open menus. https://react.dev/learn/you-might-not-need-an-effect
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpenPanel(null)
    setDrawerOpen(false)
  }

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const openOnHover = (panel: Exclude<Panel, null>) => {
    window.clearTimeout(closeTimer.current)
    setOpenPanel(panel)
  }

  const closeOnLeave = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpenPanel(null), 150)
  }

  const toggle = (panel: Exclude<Panel, null>) =>
    setOpenPanel((current) => (current === panel ? null : panel))

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav__link nav__link--active' : 'nav__link'

  return (
    <header className="header">
      <TopBar />

      <div className="header__main">
        <div className="container header__inner">
          <Link to="/" className="header__logo" aria-label={t('nav.home')}>
            <img src={site.images.logo} alt="" width={132} height={42} />
          </Link>

          <nav className="nav" aria-label={t('nav.menu')}>
            <NavLink to="/" end className={navLinkClass}>
              {t('nav.home')}
            </NavLink>

            <div
              className="nav__item"
              onMouseEnter={() => openOnHover('shop')}
              onMouseLeave={closeOnLeave}
            >
              <button
                type="button"
                className="nav__link nav__link--button"
                aria-expanded={openPanel === 'shop'}
                aria-haspopup="true"
                onClick={() => toggle('shop')}
              >
                {t('nav.shop')}
                <ChevronDownIcon size={16} />
              </button>

              {openPanel === 'shop' && (
                <ul className="dropdown">
                  <li>
                    <NavLink to="/boutique" className="dropdown__link">
                      {t('nav.shop')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/livraison" className="dropdown__link">
                      {t('nav.delivery')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/conseil" className="dropdown__link">
                      {t('nav.guide')}
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>

            <div
              className="nav__item"
              onMouseEnter={() => openOnHover('categories')}
              onMouseLeave={closeOnLeave}
            >
              <button
                type="button"
                className="nav__link nav__link--button"
                aria-expanded={openPanel === 'categories'}
                aria-haspopup="true"
                onClick={() => toggle('categories')}
              >
                {t('nav.categories')}
                <ChevronDownIcon size={16} />
              </button>

              {openPanel === 'categories' && (
                <div className="megamenu" role="group" aria-label={t('nav.categories')}>
                  <ul className="megamenu__grid">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <NavLink
                          to={`/product-category/${category.slug}`}
                          className="megamenu__card"
                        >
                          <img
                            className="megamenu__thumb"
                            src={category.image}
                            alt=""
                            loading="lazy"
                            width={72}
                            height={72}
                          />
                          <span className="megamenu__text">
                            <span className="megamenu__name" dir="ltr">
                              {category.nameFr}
                            </span>
                            <span className="megamenu__name-ar">{category.nameAr}</span>
                            <span className="megamenu__count">({category.count})</span>
                          </span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                  <NavLink to="/boutique" className="megamenu__all">
                    <GridIcon size={16} />
                    {t('products.viewAll')}
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink to="/a-propos" className={navLinkClass}>
              {t('nav.about')}
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              {t('nav.contact')}
            </NavLink>
          </nav>

          <div className="header__actions">
            <button
              type="button"
              className="header__lang"
              onClick={toggleLanguage}
              aria-label={t('nav.language')}
              title={t('nav.language')}
            >
              <LanguageIcon size={17} />
              <span>{language === 'ar' ? 'Français' : 'العربية'}</span>
            </button>

            {/* Live cart pill: item count and running subtotal, linking to the basket. */}
            <Link
              to="/panier"
              className="header__cart"
              aria-label={`${count} ${t('nav.cart')}`}
            >
              <CartIcon size={19} />
              <span className="header__cart-text">
                <span className="header__cart-total" dir="ltr">
                  {formatPrice(subtotal)}
                </span>
                <span className="header__cart-label">
                  {count} {t('nav.cart')}
                </span>
              </span>
            </Link>

            <button
              type="button"
              className="header__burger"
              onClick={() => setDrawerOpen(true)}
              aria-label={t('nav.menu')}
              aria-expanded={drawerOpen}
            >
              <MenuIcon size={22} />
            </button>
          </div>
        </div>
      </div>

      <MobileNav open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  )
}

export default Header
