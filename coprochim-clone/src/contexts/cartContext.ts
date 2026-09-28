import { createContext } from 'react'
import type { Language } from '../data/types'

/** A single line in the cart. Product fields are snapshotted at add time. */
export interface CartLine {
  /** Product id, used as the line key. */
  id: number
  slug: string
  ref: string
  nameFr: string
  nameAr: string
  /** Unit price in Algerian dinars at the moment it was added. */
  price: number
  image: string
  quantity: number
}

/** Order payload posted to `/api/orders` at checkout. */
export interface OrderDraft {
  language: Language
  customer: {
    name: string
    phone: string
    wilaya: string
    commune: string
    address: string
    notes: string
  }
  items: Array<{
    productId: number
    slug: string
    ref: string
    nameFr: string
    nameAr: string
    price: number
    quantity: number
    image: string
  }>
  subtotal: number
  total: number
}

export interface CartContextValue {
  lines: CartLine[]
  /** Total number of units across all lines (drives the header badge). */
  count: number
  /** Sum of `price * quantity` in dinars. */
  subtotal: number
  /** Adds a product, or bumps its quantity when it is already in the cart. */
  add: (product: Omit<CartLine, 'quantity'>, quantity?: number) => void
  /** Sets an absolute quantity; `0` or less removes the line. */
  setQuantity: (id: number, quantity: number) => void
  remove: (id: number) => void
  clear: () => void
  /** Builds the payload for `POST /api/orders`. */
  toOrderDraft: (
    customer: OrderDraft['customer'],
    language: Language,
  ) => OrderDraft
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)