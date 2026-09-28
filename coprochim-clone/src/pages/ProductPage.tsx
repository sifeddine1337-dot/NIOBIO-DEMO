import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCategory, getProduct, relatedProducts } from '../data/catalog'
import { useCart } from '../hooks/useCart'
import { useCatalog } from '../hooks/useCatalog'
import { useLanguage } from '../hooks/useLanguage'
import { formatPrice } from '../lib/formatPrice'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { CheckIcon, ChevronDownIcon, MinusIcon, PlusIcon, TagIcon } from '../components/common/Icons'
import { TrustBadges } from '../components/common/TrustBadges'
import type { TrustItem } from '../components/common/TrustBadges'
import { ProductSection } from '../components/home/ProductSection'
import { NotFoundPage } from './NotFoundPage'
import './Pages.css'

const RELATED_COUNT = 4

/**
 * Single product view. Mirrors the WooCommerce layout: breadcrumb, gallery,
 * title (FR + AR), price, "Réf", quantity stepper and add-to-cart, the three
 * reassurance badges, then the الوصف tab and related products.
 *
 * Add-to-cart pushes the chosen quantity into the shared cart; the button then
 * offers a direct link to the basket.
 */
export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, isRTL } = useLanguage()
  const { add } = useCart()
  const navigate = useNavigate()
  // Re-render when the admin panel edits the catalog.
  useCatalog()
  const product = getProduct(slug)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) return <NotFoundPage />

  const category = getCategory(product.categorySlug)
  const related = relatedProducts(product, RELATED_COUNT)

  const trustItems: TrustItem[] = [
    {
      icon: 'truck',
      title: t('trust.deliveryTitle'),
      body: t('trust.deliveryBody'),
    },
    {
      icon: 'refund',
      title: t('trust.refundTitle'),
      body: t('trust.refundBody'),
    },
    {
      icon: 'shield',
      title: t('trust.warrantyTitle'),
      body: t('trust.warrantyBody'),
    },
  ]

  const Chevron = isRTL ? ChevronDownIcon : ChevronDownIcon

  return (
    <>
      <section className="section section--tight">
        <div className="container">
          <Breadcrumb
            items={[
              { label: t('breadcrumb.home'), to: '/' },
              { label: t('shop.title'), to: '/boutique' },
              ...(category
                ? [{ label: category.nameAr, to: `/product-category/${category.slug}` }]
                : []),
              { label: product.nameFr || product.nameAr },
            ]}
          />

          <div className="product" style={{ marginBlockStart: 28 }}>
            <div className="product__gallery">
              <img
                src={product.image}
                alt={product.nameFr || product.nameAr}
                width={600}
                height={600}
              />
            </div>

            <div className="product__summary">
              {category && (
                <Link
                  to={`/product-category/${category.slug}`}
                  className="product__category"
                  dir="ltr"
                >
                  {category.nameFr}
                </Link>
              )}

              <h1 className="product__title">{product.nameFr || product.nameAr}</h1>
              {product.nameFr && product.nameAr && product.nameAr !== product.nameFr && (
                <p className="product__title-ar">{product.nameAr}</p>
              )}

              <div className="product__price-row">
                <p className="product__price" dir="ltr">
                  {formatPrice(product.price)}
                </p>
                <p className="product__ref">
                  <TagIcon size={15} />
                  {t('product.ref')} : <strong dir="ltr">{product.ref}</strong>
                </p>
              </div>

              <div className="product__buy">
                <div className="qty">
                  <button
                    type="button"
                    className="qty__btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label={t('product.decrease')}
                  >
                    <MinusIcon size={17} />
                  </button>
                  <input
                    className="qty__input"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) => {
                      const next = Number(event.target.value)
                      setQuantity(Number.isFinite(next) && next > 0 ? Math.floor(next) : 1)
                    }}
                    aria-label={t('product.quantity')}
                  />
                  <button
                    type="button"
                    className="qty__btn"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label={t('product.increase')}
                  >
                    <PlusIcon size={17} />
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn--primary product__add"
                  onClick={() => {
                    add(
                      {
                        id: product.id,
                        slug: product.slug,
                        ref: product.ref,
                        nameFr: product.nameFr,
                        nameAr: product.nameAr,
                        price: product.price,
                        image: product.image,
                      },
                      quantity,
                    )
                    setAdded(true)
                  }}
                  aria-live="polite"
                >
                  {added ? <CheckIcon size={18} /> : null}
                  {added ? t('products.added') : t('products.addToCart')}
                </button>

                {added && (
                  <button
                    type="button"
                    className="btn btn--outline product__add"
                    onClick={() => navigate('/panier')}
                  >
                    {t('cart.checkout')}
                  </button>
                )}
              </div>

              <TrustBadges items={trustItems} variant="compact" />
            </div>
          </div>

          <div className="tabs">
            <div className="tabs__list">
              <button type="button" className="tabs__tab tabs__tab--active" aria-expanded="true">
                {t('product.description')}
                <Chevron size={14} />
              </button>
            </div>
            <p className="tabs__panel">{t('product.noDescription')}</p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <ProductSection title={t('product.related')} products={related} alt />
      )}
    </>
  )
}

export default ProductPage
