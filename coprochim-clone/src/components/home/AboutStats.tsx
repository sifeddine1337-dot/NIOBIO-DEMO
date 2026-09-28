import { site } from '../../data/site'
import { useCatalog } from '../../hooks/useCatalog'
import { useLanguage } from '../../hooks/useLanguage'
import { useCountUp } from '../../hooks/useCountUp'
import './Home.css'

/** Animated statistic. The value counts up the first time it scrolls into view. */
function Stat({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { ref, value } = useCountUp(end)

  return (
    <li className="stat">
      <p className="stat__value">
        <span ref={ref}>{value}</span>
        <span className="stat__suffix">{suffix}</span>
      </p>
      <p className="stat__label">{label}</p>
    </li>
  )
}

/**
 * "Qui sommes-nous ?" block: narrative copy followed by the animated counters.
 *
 * NOTE ON THE FIGURES: the source site animates these from 0 via Elementor's
 * counter widget, so the real totals never appear in the served HTML (one
 * widget is configured with `data-to-value="14"`, which is where "14+ years"
 * comes from). The other two are clearly-marked placeholders — edit them here
 * once the real numbers are known.
 */
export function AboutStats() {
  const { t } = useLanguage()
  // Re-render when the admin panel replaces the about image.
  useCatalog()

  return (
    <section className="section about">
      <div className="container about__grid">
        <div className="about__media">
          <img
            src={site.images.whyUs}
            alt={t('about.imageAlt')}
            width={1024}
            height={682}
            loading="lazy"
          />
        </div>

        <div className="about__copy">
          <span className="eyebrow">{t('about.eyebrow')}</span>
          <h2 className="section-title">{t('about.title')}</h2>
          <p className="about__body">{t('about.body')}</p>
        </div>
      </div>

      <div className="container">
        <ul className="stats">
          <Stat end={1200} suffix="+" label={t('stats.customers')} />
          <Stat end={85} suffix="K+" label={t('stats.sold')} />
          <Stat end={14} suffix="+" label={t('stats.years')} />
        </ul>
      </div>
    </section>
  )
}

export default AboutStats
