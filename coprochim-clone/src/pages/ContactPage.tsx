import { useState } from 'react'
import type { FormEvent } from 'react'
import { contactLabels, site, telHref } from '../data/site'
import { useLanguage } from '../hooks/useLanguage'
import { CheckIcon, MailIcon, PhoneIcon, PinIcon, PrinterIcon } from '../components/common/Icons'
import './Pages.css'

/** Contact page: details panel plus the enquiry form (no backend, local confirmation). */
export function ContactPage() {
  const { t, language } = useLanguage()
  const labels = contactLabels[language]
  const [sent, setSent] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.subtitle')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container contact">
          <div className="contact__card">
            <h2>{t('contact.info')}</h2>

            <div className="contact__group">
              <p className="contact__label">{labels.phones}</p>
              <ul className="contact__list">
                {site.phoneLines.map((phone) => (
                  <li key={phone}>
                    <PhoneIcon size={16} />
                    <a href={telHref(phone)} dir="ltr">
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="contact__group">
              <p className="contact__label">{labels.email}</p>
              <ul className="contact__list">
                <li>
                  <MailIcon size={16} />
                  <a href={`mailto:${site.email}`} dir="ltr">
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>

            <div className="contact__group">
              <p className="contact__label">{labels.fax}</p>
              <ul className="contact__list">
                <li>
                  <PrinterIcon size={16} />
                  <span dir="ltr">{site.fax}</span>
                </li>
              </ul>
            </div>

            <div className="contact__group">
              <p className="contact__label">{labels.address}</p>
              <ul className="contact__list">
                <li>
                  <PinIcon size={16} />
                  <span>
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                    <br />
                    {site.address.line3}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit}>
            <h2>{t('contact.writeUs')}</h2>

            {sent && (
              <p className="contact__sent" role="status">
                <CheckIcon size={17} />
                {t('contact.sent')}
              </p>
            )}

            <div className="contact__row">
              <label className="field">
                <span>{t('contact.name')}</span>
                <input className="input" name="name" type="text" required />
              </label>

              <label className="field">
                <span>{t('contact.phone')}</span>
                <input className="input" name="phone" type="tel" required dir="ltr" />
              </label>
            </div>

            <div className="contact__row">
              <label className="field">
                <span>{t('contact.subject')}</span>
                <input className="input" name="subject" type="text" required />
              </label>

              <label className="field">
                <span>{t('contact.email')}</span>
                <input className="input" name="email" type="email" required dir="ltr" />
              </label>
            </div>

            <label className="field">
              <span>{t('contact.message')}</span>
              <textarea className="textarea" name="message" required />
            </label>

            <button type="submit" className="btn btn--primary">
              {t('contact.send')}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

export default ContactPage
