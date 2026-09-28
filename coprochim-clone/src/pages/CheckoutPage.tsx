import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { wilayas } from '../data/wilayas'
import { useCart } from '../hooks/useCart'
import { useLanguage } from '../hooks/useLanguage'
import { api } from '../lib/api'
import { formatPrice } from '../lib/formatPrice'
import { isValidPhone, localOrderNumber, saveLastOrder } from '../lib/lastOrder'
import type { PlacedOrder } from '../lib/lastOrder'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { TruckIcon } from '../components/common/Icons'
import './Pages.css'

interface FormState {
  name: string
  phone: string
  wilaya: string
  commune: string
  address: string
  notes: string
}

const EMPTY_FORM: FormState = {
  name: '',
  phone: '',
  wilaya: '',
  commune: '',
  address: '',
  notes: '',
}

/**
 * Cash-on-delivery checkout.
 *
 * There is no online payment: the customer leaves their name and phone number,
 * the order is recorded (server-side when the API is reachable), and the shop
 * calls back to confirm before delivering. Only name and phone are mandatory.
 */
export function CheckoutPage() {
  const { t, language } = useLanguage()
  const { lines, count, subtotal, clear, toOrderDraft } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [touched, setTouched] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  // Set once the order is recorded: the basket is emptied right before the
  // redirect to the receipt, so the empty-basket guard below must not fire and
  // send the customer to `/panier` instead of the confirmation screen.
  const [placed, setPlaced] = useState(false)

  // An empty basket has nothing to order — send the visitor back to the shop.
  if (lines.length === 0 && !sending && !placed) return <Navigate to="/panier" replace />

  const phoneValid = isValidPhone(form.phone)
  const nameValid = form.name.trim().length >= 3
  const canSubmit = phoneValid && nameValid

  const update = (field: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [field]: value }))

  const headline = (line: { nameFr: string; nameAr: string }) =>
    language === 'ar' && line.nameAr ? line.nameAr : line.nameFr || line.nameAr

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched(true)
    if (!canSubmit || sending) return

    setSending(true)
    setError('')

    const selected = wilayas.find((item) => item.code === form.wilaya)
    const draft = toOrderDraft(
      {
        name: form.name.trim(),
        phone: form.phone.trim(),
        wilaya: selected ? `${selected.code} — ${selected.nameFr}` : form.wilaya.trim(),
        commune: form.commune.trim(),
        address: form.address.trim(),
        notes: form.notes.trim(),
      },
      language,
    )

    try {
      const order = await api.post<PlacedOrder>('/orders', draft)
      saveLastOrder({ ...order, offline: false })
      setPlaced(true)
      clear()
      navigate('/commande/confirmation', { replace: true })
    } catch {
      // The API is not running (static build / offline dev). Record the order
      // locally so the customer still gets a usable confirmation screen.
      const offline: PlacedOrder = {
        ...draft,
        number: localOrderNumber(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        offline: true,
      }
      saveLastOrder(offline)
      setPlaced(true)
      clear()
      navigate('/commande/confirmation', { replace: true })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <Breadcrumb
            items={[
              { label: t('breadcrumb.home'), to: '/' },
              { label: t('cart.title'), to: '/panier' },
              { label: t('checkout.title') },
            ]}
          />
          <h1>{t('checkout.title')}</h1>
          <p>{t('checkout.subtitle')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container checkout-layout">
          <form className="checkout-form" onSubmit={submit} noValidate>
            <h2>{t('checkout.customer')}</h2>

            <div className="checkout-form__row">
              <div className={`field${touched && !nameValid ? ' field--invalid' : ''}`}>
                <label htmlFor="checkout-name">{t('checkout.name')} *</label>
                <input
                  id="checkout-name"
                  className="input"
                  type="text"
                  autoComplete="name"
                  placeholder={t('checkout.namePlaceholder')}
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  required
                />
                {touched && !nameValid && (
                  <span className="field__hint" style={{ color: 'var(--color-danger)' }}>
                    {t('checkout.nameHint')}
                  </span>
                )}
              </div>

              <div className={`field${touched && !phoneValid ? ' field--invalid' : ''}`}>
                <label htmlFor="checkout-phone">{t('checkout.phone')} *</label>
                <input
                  id="checkout-phone"
                  className="input"
                  type="tel"
                  dir="ltr"
                  autoComplete="tel"
                  placeholder="0550 12 34 56"
                  value={form.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  required
                />
                <span className="field__hint">
                  {touched && !phoneValid ? t('checkout.phoneHint') : t('checkout.phoneUsage')}
                </span>
              </div>
            </div>

            <div className="checkout-form__row">
              <div className="field">
                <label htmlFor="checkout-wilaya">{t('checkout.wilaya')}</label>
                <select
                  id="checkout-wilaya"
                  className="select"
                  value={form.wilaya}
                  onChange={(event) => update('wilaya', event.target.value)}
                >
                  <option value="">{t('checkout.wilayaPlaceholder')}</option>
                  {wilayas.map((wilaya) => (
                    <option key={wilaya.code} value={wilaya.code}>
                      {wilaya.code} — {language === 'ar' ? wilaya.nameAr : wilaya.nameFr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="checkout-commune">{t('checkout.commune')}</label>
                <input
                  id="checkout-commune"
                  className="input"
                  type="text"
                  autoComplete="address-level2"
                  value={form.commune}
                  onChange={(event) => update('commune', event.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="checkout-address">{t('checkout.address')}</label>
              <input
                id="checkout-address"
                className="input"
                type="text"
                autoComplete="street-address"
                placeholder={t('checkout.addressPlaceholder')}
                value={form.address}
                onChange={(event) => update('address', event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="checkout-notes">{t('checkout.notes')}</label>
              <textarea
                id="checkout-notes"
                className="textarea"
                rows={3}
                style={{ minHeight: 96 }}
                placeholder={t('checkout.notesPlaceholder')}
                value={form.notes}
                onChange={(event) => update('notes', event.target.value)}
              />
            </div>

            <div className="checkout-note">
              <TruckIcon size={22} />
              <div>
                <h3>{t('checkout.paymentTitle')}</h3>
                <p>{t('checkout.paymentBody')}</p>
              </div>
            </div>

            {error && <p className="checkout-error">{error}</p>}

            <button type="submit" className="btn btn--primary btn--block" disabled={sending}>
              {sending ? t('checkout.sending') : t('checkout.submit')}
            </button>

            <Link to="/panier" className="btn btn--ghost btn--block">
              {t('checkout.backToCart')}
            </Link>
          </form>

          <aside className="cart-summary">
            <h2>{t('checkout.summary')}</h2>

            <div className="checkout-lines">
              {lines.map((line) => (
                <div className="checkout-line" key={line.id}>
                  <img src={line.image} alt="" loading="lazy" width={46} height={46} />
                  <span className="checkout-line__text">
                    <span className="checkout-line__name">{headline(line)}</span>
                    <span className="checkout-line__meta" dir="ltr">
                      {line.quantity} × {formatPrice(line.price)}
                    </span>
                  </span>
                  <span className="checkout-line__price" dir="ltr">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <dl className="cart-summary__rows">
              <div className="cart-summary__row">
                <dt>{t('cart.items')}</dt>
                <dd>{count}</dd>
              </div>
              <div className="cart-summary__row cart-summary__row--total">
                <dt>{t('cart.total')}</dt>
                <dd dir="ltr">{formatPrice(subtotal)}</dd>
              </div>
            </dl>

            <p className="cart-summary__hint">{t('checkout.paymentBody')}</p>
          </aside>
        </div>
      </section>
    </>
  )
}

export default CheckoutPage