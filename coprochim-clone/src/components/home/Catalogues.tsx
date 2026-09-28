import { catalogues } from '../../data/site'
import { useCatalog } from '../../hooks/useCatalog'
import { useLanguage } from '../../hooks/useLanguage'
import { DownloadIcon } from '../common/Icons'
import './Home.css'

/** "Téléchargement des catalogues" — two downloadable catalogue covers. */
export function Catalogues() {
  const { t, language } = useLanguage()
  // Re-render when the admin panel edits the catalogue list.
  useCatalog()

  return (
    <section className="section section--muted">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow">{t('catalogs.eyebrow')}</span>
          <h2 className="section-title">{t('catalogs.title')}</h2>
          <p className="section-subtitle">{t('catalogs.subtitle')}</p>
        </header>

        <ul className="catalogs">
          {catalogues.map((catalogue) => (
            <li key={catalogue.cover} className="catalog">
              <img
                className="catalog__cover"
                src={catalogue.cover}
                alt={language === 'ar' ? catalogue.titleAr : catalogue.titleFr}
                loading="lazy"
              />
              <div className="catalog__body">
                <h3 className="catalog__title">
                  {language === 'ar' ? catalogue.titleAr : catalogue.titleFr}
                </h3>
                <a
                  className="btn btn--primary btn--sm"
                  href={catalogue.file}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <DownloadIcon size={16} />
                  {t('catalogs.download')}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Catalogues
