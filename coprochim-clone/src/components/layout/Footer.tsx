import { Link } from 'react-router-dom'
import { contactLabels, site, telHref } from '../../data/site'
import { useCatalog } from '../../hooks/useCatalog'
import { useLanguage } from '../../hooks/useLanguage'
import { MailIcon, PhoneIcon, PinIcon, PrinterIcon } from '../common/Icons'
import { SocialIcon } from '../common/SocialIcon'
import './Footer.css'

/** Site footer: about blurb, quick links, product range, contact and legal bar. */
export function Footer() {
  const { t, language, toggleLanguage } = useLanguage()
  // Re-render when the admin panel edits site settings.
  useCatalog()
  const labels = contactLabels[language]

  // The "Gamme complète" list is presentational on the source site; each entry
  // simply points at the shop.
  const rangeItems = [
    t('footer.range1'),
    t('footer.range2'),
    t('footer.range3'),
    t('footer.range4'),
  ]

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__col footer__col--brand">
          <img
            className="footer__logo"
            src="/images/logo-footer.svg"
            alt=""
            width={132}
            height={42}
          />
          <p className="footer__about">{t('footer.about')}</p>
          <p className="footer__follow">{t('footer.followUs')}</p>
          <ul className="footer__socials">
            {site.socials.map((social) => (
              <li key={social.label}>
                <SocialIcon social={social} size={18} />
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__title">{t('footer.quickLinks')}</h2>
          <ul className="footer__links">
            <li>
              <Link to="/">{t('nav.home')}</Link>
            </li>
            <li>
              <Link to="/boutique">{t('nav.shop')}</Link>
            </li>
            <li>
              <Link to="/contact">{t('nav.contact')}</Link>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__title">{t('footer.range')}</h2>
          <ul className="footer__links">
            {rangeItems.map((item) => (
              <li key={item}>
                <Link to="/boutique">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__title">{t('footer.contact')}</h2>
          <ul className="footer__contact">
            <li>
              <PinIcon size={17} />
              <span>
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                {site.address.line3}
              </span>
            </li>
            <li>
              <MailIcon size={17} />
              <a href={`mailto:${site.email}`} dir="ltr">
                {site.email}
              </a>
            </li>
            <li>
              <PhoneIcon size={17} />
              <a href={telHref(site.deliveryPhone)} dir="ltr">
                {site.deliveryPhone}
              </a>
            </li>
            <li>
              <PrinterIcon size={17} />
              <span>
                <span className="footer__muted">{labels.fax}: </span>
                <span dir="ltr">{site.fax}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bar">
        <div className="container footer__bar-inner">
          <p>{t('footer.rights')}</p>
          <p className="footer__powered">{t('footer.poweredBy')}</p>
          <button type="button" className="footer__lang" onClick={toggleLanguage}>
            {language === 'ar' ? 'Français' : 'العربية'}
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
