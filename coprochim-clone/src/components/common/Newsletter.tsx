import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { CheckIcon } from './Icons'
import './Newsletter.css'

/**
 * Newsletter sign-up strip. There is no backend in this clone, so submitting
 * simply swaps in a confirmation message.
 */
export function Newsletter() {
  const { t } = useLanguage()
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubscribed(true)
  }

  return (
    <section className="newsletter">
      <div className="container">
        <p className="newsletter__text">{t('newsletter.body')}</p>

        {subscribed ? (
          <p className="newsletter__success" role="status">
            <CheckIcon size={18} />
            {t('newsletter.success')}
          </p>
        ) : (
          <form className="newsletter__form" onSubmit={handleSubmit}>
            <label className="newsletter__field">
              <span className="sr-only">{t('newsletter.name')}</span>
              <input
                type="text"
                className="input"
                name="name"
                placeholder={t('newsletter.name')}
                required
              />
            </label>
            <label className="newsletter__field">
              <span className="sr-only">{t('newsletter.email')}</span>
              <input
                type="email"
                className="input"
                name="email"
                placeholder={t('newsletter.email')}
                required
              />
            </label>
            <button type="submit" className="btn btn--primary">
              {t('newsletter.submit')}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Newsletter
