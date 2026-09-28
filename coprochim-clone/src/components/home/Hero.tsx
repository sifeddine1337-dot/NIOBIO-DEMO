import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { useCatalog } from '../../hooks/useCatalog'
import { useLanguage } from '../../hooks/useLanguage'
import { CheckIcon, DownloadIcon, SparkIcon } from '../common/Icons'
import './Home.css'

/** Above-the-fold pitch, mirroring the source hero: badge, heading, blurb, 2 CTAs. */
export function Hero() {
  const { t } = useLanguage()
  // Re-render when the admin panel replaces the hero image or order form.
  useCatalog()

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="hero__badge">
            <SparkIcon size={15} />
            {t('hero.eyebrow')}
          </span>

          <h1 className="hero__title">{t('hero.title')}</h1>
          <p className="hero__body">{t('hero.body')}</p>

          <div className="hero__actions">
            <Link to="/boutique" className="btn btn--primary">
              {t('hero.ctaProducts')}
            </Link>
            <a
              className="btn btn--outline"
              href={site.orderForm}
              target="_blank"
              rel="noreferrer noopener"
            >
              <DownloadIcon size={17} />
              {t('hero.ctaOrder')}
            </a>
          </div>

          <ul className="hero__points">
            <li>
              <CheckIcon size={16} />
              {t('features.deliveryBody')}
            </li>
            <li>
              <CheckIcon size={16} />
              {t('features.warrantyBody')}
            </li>
          </ul>
        </div>

        <div className="hero__media">
          <span className="hero__blob" aria-hidden="true" />
          <img src={site.images.hero} alt={t('hero.imageAlt')} width={600} height={732} />
        </div>
      </div>
    </section>
  )
}

export default Hero
