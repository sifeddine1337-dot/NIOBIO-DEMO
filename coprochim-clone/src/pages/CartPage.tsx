import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useLanguage } from '../hooks/useLanguage'
import { formatPrice } from '../lib/formatPrice'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { CartIcon, MinusIcon, PlusIcon, TrashIcon } from '../components/common/Icons'
import './Pages.css'

/**
 * Shopping basket: one row per product with a quantity stepper, the running
 * line total and a remove button, next to a sticky order summary.
 *
 * Nothing is reserved until the order is confirmed from the checkout page.
 */
export function CartPage() {
  const { t, language } = useLanguage()
  const { lines, count, subtotal, setQuantity, remove, clear } = useCart()

  const headline = (line: { nameFr: string; nameAr: string }) =>
    language === 'ar' && line.nameAr ? line.nameAr : line.nameFr || line.nameAr
  const altName = (line: { nameFr: string; nameAr: string }) =>
    language === 'ar' ? line.nameFr : line.nameAr

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <Breadcrumb items={[{ label: t('breadcrumb.home'), to: '/' }, { label: t('cart.title') }]} />
          <h1>{t('cart.title')}</h1>
          <p>{t('cart.subtitle')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {lines.length === 0 ? (
            <div className="info-page__inner empty-state">
              <CartIcon size={44} />
              <p>{t('cart.empty')}</p>
              <Link to="/boutique" className="btn btn--primary">
                {t('cart.emptyCta')}
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-lines">
                {lines.map((line) => (
                  <article className="cart-line" key={line.id}>
                    <Link
                      to={`/product/${line.slug}`}
                      className="cart-line__media"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <img src={line.image} alt="" loading="lazy" width={92} height={92} />
                    </Link>

                    <div className="cart-line__info">
                      <h2 className="cart-line__name">
                        <Link to={`/product/${line.slug}`}>{headline(line)}</Link>
                      </h2>
                      {altName(line) && altName(line) !== headline(line) && (
                        <p className="cart-line__name-ar">{altName(line)}</p>
                      )}
                      <p className="cart-line__ref">
                        {t('product.ref')} : <span dir="ltr">{line.ref}</span>
                      </p>
                      <p className="cart-line__unit" dir="ltr">
                        {formatPrice(line.price)}
                      </p>
                    </div>

                    <div className="qty cart-line__qty">
                      <button
                        type="button"
                        className="qty__btn"
                        onClick={() => setQuantity(line.id, line.quantity - 1)}
                        aria-label={t('product.decrease')}
                      >
                        <MinusIcon size={16} />
                      </button>
                      <input
                        className="qty__input"
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(event) => {
                          const next = Number(event.target.value)
                          setQuantity(line.id, Number.isFinite(next) ? Math.floor(next) : 1)
                        }}
                        aria-label={t('cart.quantity')}
                      />
                      <button
                        type="button"
                        className="qty__btn"
                        onClick={() => setQuantity(line.id, line.quantity + 1)}
                        aria-label={t('product.increase')}
                      >
                        <PlusIcon size={16} />
                      </button>
                    </div>

                    <p className="cart-line__total" dir="ltr">
                      {formatPrice(line.price * line.quantity)}
                    </p>

                    <button
                      type="button"
                      className="cart-line__remove"
                      onClick={() => remove(line.id)}
                      aria-label={t('cart.remove')}
                      title={t('cart.remove')}
                    >
                      <TrashIcon size={18} />
                    </button>
                  </article>
                ))}

                <div className="cart-lines__actions">
                  <Link to="/boutique" className="btn btn--ghost btn--sm">
                    {t('cart.continue')}
                  </Link>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={clear}>
                    {t('cart.clear')}
                  </button>
                </div>
              </div>

              <aside className="cart-summary">
                <h2>{t('checkout.summary')}</h2>
                <p className="cart-summary__count">
                  {count} {t('cart.items')}
                </p>

                <dl className="cart-summary__rows">
                  <div className="cart-summary__row">
                    <dt>{t('cart.subtotal')}</dt>
                    <dd dir="ltr">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="cart-summary__row">
                    <dt>{t('checkout.delivery')}</dt>
                    <dd>{t('checkout.deliveryNote')}</dd>
                  </div>
                  <div className="cart-summary__row cart-summary__row--total">
                    <dt>{t('cart.total')}</dt>
                    <dd dir="ltr">{formatPrice(subtotal)}</dd>
                  </div>
                </dl>

                <Link to="/commande" className="btn btn--primary btn--block">
                  {t('cart.checkout')}
                </Link>
                <p className="cart-summary__hint">{t('checkout.paymentBody')}</p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default CartPage