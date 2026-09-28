import type { ReactNode } from 'react'
import { ClockIcon, RefundIcon, ShieldIcon, TruckIcon } from './Icons'
import './TrustBadges.css'

export type TrustIcon = 'truck' | 'refund' | 'shield' | 'clock'

const ICONS: Record<TrustIcon, (props: { size?: number }) => ReactNode> = {
  truck: TruckIcon,
  refund: RefundIcon,
  shield: ShieldIcon,
  clock: ClockIcon,
}

export interface TrustItem {
  icon: TrustIcon
  title: string
  body: string
  /** Optional trailing note, e.g. a phone number to call. */
  note?: string
}

/**
 * The reassurance row shown on the home page and beneath the product summary
 * ("free delivery", "satisfied or refunded", "1 year warranty", ...).
 */
export function TrustBadges({ items, variant = 'default' }: { items: TrustItem[]; variant?: 'default' | 'compact' }) {
  return (
    <ul className={variant === 'compact' ? 'trust trust--compact' : 'trust'}>
      {items.map((item) => {
        const Icon = ICONS[item.icon]
        return (
          <li key={item.title} className="trust__item">
            <span className="trust__icon">
              <Icon size={22} />
            </span>
            <div className="trust__text">
              <h3 className="trust__title">{item.title}</h3>
              <p className="trust__body">{item.body}</p>
              {item.note && (
                <p className="trust__note" dir="ltr">
                  {item.note}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default TrustBadges
