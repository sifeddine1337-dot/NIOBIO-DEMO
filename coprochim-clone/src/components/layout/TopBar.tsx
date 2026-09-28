import { site, telHref } from '../../data/site'
import { useLanguage } from '../../hooks/useLanguage'
import { PhoneIcon } from '../common/Icons'
import { SocialIcon } from '../common/SocialIcon'

/** Thin utility bar above the main header: phone numbers and social links. */
export function TopBar() {
  const { t } = useLanguage()

  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <ul className="topbar__phones">
          {site.topPhones.map((phone) => (
            <li key={phone}>
              <a href={telHref(phone)}>
                <PhoneIcon size={14} />
                <span dir="ltr">{phone}</span>
                <span className="sr-only">{t('nav.callUs')}</span>
              </a>
            </li>
          ))}
        </ul>

        <ul className="topbar__socials">
          {site.socials.map((social) => (
            <li key={social.label}>
              <SocialIcon social={social} size={16} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TopBar
