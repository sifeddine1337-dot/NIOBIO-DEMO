import { AboutStats } from '../components/home/AboutStats'
import { Catalogues } from '../components/home/Catalogues'
import { WhyUs } from '../components/home/WhyUs'
import { useLanguage } from '../hooks/useLanguage'
import './Pages.css'

/** About page: banner, then the same narrative/counters block used on the home page. */
export function AboutPage() {
  const { t } = useLanguage()

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>{t('aboutPage.title')}</h1>
          <p>{t('aboutPage.subtitle')}</p>
        </div>
      </div>

      <AboutStats />
      <WhyUs />
      <Catalogues />
    </>
  )
}

export default AboutPage
