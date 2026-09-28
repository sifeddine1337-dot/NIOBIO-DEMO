/**
 * Remembers the most recently placed order so the confirmation page can show
 * it after the client-side redirect from checkout.
 *
 * `sessionStorage` is the right scope here: the receipt is per-visit, and the
 * authoritative copy lives in the admin panel's order list.
 */
import type { OrderDraft } from '../contexts/cartContext'

export interface PlacedOrder extends OrderDraft {
  id?: number
  /** Human-readable reference, e.g. `CMD-0007`. */
  number: string
  status?: string
  createdAt?: string
  /**
   * True when the API was unreachable and the order was only recorded locally.
   * The confirmation page then asks the customer to call instead of waiting.
   */
  offline?: boolean
}

const STORAGE_KEY = 'site:lastOrder'

export function saveLastOrder(order: PlacedOrder): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order))
  } catch {
    /* ignore write failures — the confirmation page falls back to a notice */
  }
}

export function readLastOrder(): PlacedOrder | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !('number' in parsed)) return null
    return parsed as PlacedOrder
  } catch {
    return null
  }
}

/** Builds a local reference for an order that could not reach the API. */
export function localOrderNumber(): string {
  return `LOCAL-${Date.now().toString().slice(-6)}`
}

/**
 * Accepts Algerian numbers in the usual shapes: `0550 12 34 56`,
 * `+213 550 12 34 56`, `0550123456`, landlines included.
 */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s.\-()]/g, '')
  const national = digits.startsWith('+213')
    ? `0${digits.slice(4)}`
    : digits.startsWith('00213')
      ? `0${digits.slice(5)}`
      : digits
  return /^0[2-9]\d{7,8}$/.test(national)
}