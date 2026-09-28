import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import './Pages.css'

/**
 * "Conseil" / إرشاد وتوجيه.
 *
 * The source page is an unfinished placeholder — it renders the literal word
 * "text" and nothing else. Rather than ship a meaningless stub, this states
 * that the page is still being written.
 */
export function GuidePage() {
  const { t } = useLanguage()

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>{t('guide.title')}</h1>
          <p>{t('guide.subtitle')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container info-page__inner">
          <p className="info-page__body">{t('guide.subtitle')}</p>
          <Link to="/boutique" className="btn btn--outline">
            {t('products.viewAll')}
          </Link>
        </div>
      </section>
    </>
  )
}

export default GuidePage
