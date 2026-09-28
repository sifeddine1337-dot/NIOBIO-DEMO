import { Link } from 'react-router-dom'
import type { Product } from '../../data/types'
import { ProductGrid } from '../shop/ProductGrid'
import { ChevronLeftIcon, ChevronRightIcon } from '../common/Icons'
import { useLanguage } from '../../hooks/useLanguage'
import './Home.css'

interface ProductSectionProps {
  title: string
  subtitle?: string
  products: Product[]
  /** Optional link to the full listing. */
  moreHref?: string
  moreLabel?: string
  alt?: boolean
}

/** Titled product grid used for the two "latest products" rows on the home page. */
export function ProductSection({
  title,
  subtitle,
  products,
  moreHref,
  moreLabel,
  alt = false,
}: ProductSectionProps) {
  const { isRTL } = useLanguage()
  const Arrow = isRTL ? ChevronLeftIcon : ChevronRightIcon

  return (
    <section className={alt ? 'section section--alt' : 'section'}>
      <div className="container">
        <header className="section-head">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </header>

        <ProductGrid products={products} />

        {moreHref && moreLabel && (
          <div className="section-cta">
            <Link to={moreHref} className="btn btn--outline">
              {moreLabel}
              <Arrow size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductSection
