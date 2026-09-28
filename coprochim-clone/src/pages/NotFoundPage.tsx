import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import './Pages.css'

/** Fallback route. */
export function NotFoundPage() {
  const { t } = useLanguage()

  return (
    <section className="section info-page">
      <div className="container info-page__inner">
        <p className="info-page__code">404</p>
        <h1>{t('notFound.title')}</h1>
        <p className="text-muted">{t('notFound.body')}</p>
        <Link to="/" className="btn btn--primary">
          {t('notFound.back')}
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
