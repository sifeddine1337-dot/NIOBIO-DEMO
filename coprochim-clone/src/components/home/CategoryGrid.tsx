import { Link } from 'react-router-dom'
import { categories } from '../../data/catalog'
import { useCatalog } from '../../hooks/useCatalog'
import { useLanguage } from '../../hooks/useLanguage'
import { ChevronLeftIcon, ChevronRightIcon, GridIcon } from '../common/Icons'
import './Home.css'

/**
 * The 12 category cards. Each shows the scan image plus both the French and
 * Arabic labels and the live product count, exactly as the source grid does.
 */
export function CategoryGrid() {
  const { t, isRTL } = useLanguage()
  // Re-render when the admin panel edits the categories.
  useCatalog()
  const Arrow = isRTL ? ChevronLeftIcon : ChevronRightIcon

  return (
    <section className="section section--alt" id="categories">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow">
            <GridIcon size={14} />
            {t('nav.categories')}
          </span>
          <h2 className="section-title">{t('categories.title')}</h2>
          <p className="section-subtitle">{t('categories.subtitle')}</p>
        </header>

        <ul className="cats">
          {categories.map((category) => (
            <li key={category.id}>
              <Link to={`/product-category/${category.slug}`} className="cat">
                <span className="cat__media">
                  <img
                    src={category.image}
                    alt=""
                    loading="lazy"
                    width={320}
                    height={320}
                  />
                  <span className="cat__count">{category.count}</span>
                </span>
                <span className="cat__body">
                  <span className="cat__name" dir="ltr">
                    {category.nameFr}
                  </span>
                  <span className="cat__name-ar">{category.nameAr}</span>
                  <span className="cat__more">
                    {t('shop.categoryFilter')}
                    <Arrow size={15} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default CategoryGrid
