import { useLanguage } from '../../hooks/useLanguage'
import { GridIcon, ShieldIcon, SparkIcon } from '../common/Icons'
import './Home.css'

/** "Pourquoi nous choisir ?" — three reasons with icon, title and blurb. */
export function WhyUs() {
  const { t } = useLanguage()

  const reasons = [
    { icon: ShieldIcon, title: t('why.item1Title'), body: t('why.item1Body') },
    { icon: GridIcon, title: t('why.item2Title'), body: t('why.item2Body') },
    { icon: SparkIcon, title: t('why.item3Title'), body: t('why.item3Body') },
  ]

  return (
    <section className="section">
      <div className="container">
        <header className="section-head">
          <h2 className="section-title">{t('why.title')}</h2>
          <p className="section-subtitle">{t('why.subtitle')}</p>
        </header>

        <ul className="reasons">
          {reasons.map(({ icon: Icon, title, body }) => (
            <li key={title} className="reason">
              <span className="reason__icon">
                <Icon size={24} />
              </span>
              <h3 className="reason__title">{title}</h3>
              <p className="reason__body">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default WhyUs
