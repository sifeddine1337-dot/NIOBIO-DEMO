import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/types'
import { useCart } from '../../hooks/useCart'
import { useCatalog } from '../../hooks/useCatalog'
import { useLanguage } from '../../hooks/useLanguage'
import { formatPrice } from '../../lib/formatPrice'
import { CheckIcon } from '../common/Icons'
import './ProductCard.css'

/**
 * Catalog tile. Both the French and Arabic names are always shown together,
 * matching the source site.
 *
 * "Add to cart" pushes the product into the shared cart (persisted to
 * localStorage) and briefly flips the button into a confirmation state.
 */
export function ProductCard({ product }: { product: Product }) {
  const { t } = useLanguage()
  const { add } = useCart()
  // Re-render when the admin panel edits the catalog.
  useCatalog()
  const [added, setAdded] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const handleAdd = () => {
    add({
      id: product.id,
      slug: product.slug,
      ref: product.ref,
      nameFr: product.nameFr,
      nameAr: product.nameAr,
      price: product.price,
      image: product.image,
    })
    setAdded(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <article className="pcard">
      <Link to={`/product/${product.slug}`} className="pcard__media" tabIndex={-1}>
        <img
          src={product.image}
          alt={product.nameFr || product.nameAr}
          loading="lazy"
          width={300}
          height={300}
        />
      </Link>

      <div className="pcard__body">
        <h3 className="pcard__name">
          <Link to={`/product/${product.slug}`}>{product.nameFr || product.nameAr}</Link>
        </h3>

        {product.nameFr && product.nameAr && product.nameAr !== product.nameFr && (
          <p className="pcard__name-ar">{product.nameAr}</p>
        )}

        <p className="pcard__price" dir="ltr">
          {formatPrice(product.price)}
        </p>

        <button
          type="button"
          className={added ? 'btn btn--sm btn--light pcard__add is-added' : 'btn btn--sm btn--primary pcard__add'}
          onClick={handleAdd}
          aria-live="polite"
        >
          {added && <CheckIcon size={15} />}
          {added ? t('products.added') : t('products.addToCart')}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
