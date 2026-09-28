import { Link } from 'react-router-dom'
import { readLastOrder } from '../lib/lastOrder'
import { useLanguage } from '../hooks/useLanguage'
import { useCatalog } from '../hooks/useCatalog'
import { formatPrice } from '../lib/formatPrice'
import { site, telHref } from '../data/site'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { CheckIcon, PhoneIcon } from '../components/common/Icons'
import './Pages.css'

/**
 * "Order received" receipt.
 *
 * It repeats the reference number, the callback phone number and the amount to
 * pay on delivery. When the API was unreachable the order only exists locally,
 * so the page says so plainly and points the customer at the shop's phone line.
 */
export function OrderConfirmationPage() {
  const { t, language } = useLanguage()
  // Keep the phone number in the receipt in sync with admin settings.
  useCatalog()
  const order = readLastOrder()

  const headline = (line: { nameFr: string; nameAr: string }) =>
    language === 'ar' && line.nameAr ? line.nameAr : line.nameFr || line.nameAr

  if (!order) {
    return (
      <section className="section">
        <div className="container info-page__inner">
          <h1>{t('order.missingTitle')}</h1>
          <p className="text-muted">{t('order.missingBody')}</p>
          <Link to="/boutique" className="btn btn--primary">
            {t('cart.emptyCta')}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <Breadcrumb items={[{ label: t('breadcrumb.home'), to: '/' }, { label: t('order.title') }]} />
          <h1>{t('order.title')}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="order-done">
            <span className="order-done__badge">
              <CheckIcon size={34} />
            </span>

            <h2>{t('order.thanks')}</h2>
            <p className="text-muted">{t('order.intro')}</p>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>
              {t('order.numberLabel')}
            </p>
            <p className="order-done__number" dir="ltr">
              {order.number}
            </p>

            {order.offline && <p className="order-done__notice">{t('order.offline')}</p>}

            <div className="checkout-lines">
              {order.items.map((line) => (
                <div className="checkout-line" key={`${line.productId}-${line.slug}`}>
                  <img src={line.image} alt="" loading="lazy" width={46} height={46} />
                  <span className="checkout-line__text">
                    <span className="checkout-line__name">{headline(line)}</span>
                    <span className="checkout-line__meta" dir="ltr">
                      {line.quantity} × {formatPrice(line.price)}
                    </span>
                  </span>
                  <span className="checkout-line__price" dir="ltr">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <dl>
              <div>
                <dt>{t('order.customer')}</dt>
                <dd>{order.customer.name}</dd>
              </div>
              <div>
                <dt>{t('checkout.phone')}</dt>
                <dd dir="ltr">{order.customer.phone}</dd>
              </div>
              {order.customer.wilaya && (
                <div>
                  <dt>{t('checkout.wilaya')}</dt>
                  <dd>{order.customer.wilaya}</dd>
                </div>
              )}
              <div className="order-done__total">
                <dt>{t('order.payOnDelivery')}</dt>
                <dd dir="ltr">{formatPrice(order.total)}</dd>
              </div>
            </dl>

            <p className="order-done__notice">{t('order.callNotice')}</p>

            <div className="order-done__actions">
              <a href={telHref(site.deliveryPhone)} className="btn btn--primary">
                <PhoneIcon size={17} />
                <span dir="ltr">{site.deliveryPhone}</span>
              </a>
              <Link to="/boutique" className="btn btn--outline">
                {t('cart.continue')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default OrderConfirmationPage