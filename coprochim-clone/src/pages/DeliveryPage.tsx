import { site } from '../data/site'
import { useLanguage } from '../hooks/useLanguage'
import { CheckIcon, PhoneIcon } from '../components/common/Icons'
import './Pages.css'

/** Delivery / warranty terms page, reproducing the source page's four statements. */
export function DeliveryPage() {
  const { t } = useLanguage()

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>{t('delivery.title')}</h1>
          <p>{t('delivery.subtitle')}</p>
        </div>
      </div>

      <section className="section info-page">
        <div className="container info-page__inner">
          <ul className="info-page__list">
            <li>
              <CheckIcon size={18} />
              <span>{t('delivery.p1')}</span>
            </li>
            <li>
              <CheckIcon size={18} />
              <span>{t('delivery.p2')}</span>
            </li>
            <li>
              <CheckIcon size={18} />
              <span>{t('delivery.p3')}</span>
            </li>
          </ul>

          <a className="info-page__phone" href={`tel:${site.deliveryPhone.replace(/[^\d+]/g, '')}`}>
            <PhoneIcon size={20} />
            <span dir="ltr">{site.deliveryPhone}</span>
          </a>
        </div>
      </section>
    </>
  )
}

export default DeliveryPage
