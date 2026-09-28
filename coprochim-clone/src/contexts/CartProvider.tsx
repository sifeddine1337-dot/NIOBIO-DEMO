import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Language } from '../data/types'
import { CartContext } from './cartContext'
import type { CartContextValue, CartLine, OrderDraft } from './cartContext'

const STORAGE_KEY = 'site:cart'

/** Reads the persisted cart, tolerating corrupt or unavailable storage. */
function readStoredCart(): CartLine[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Drop anything that does not look like a cart line.
    return parsed.filter(
      (line): line is CartLine =>
        !!line &&
        typeof line === 'object' &&
        typeof (line as CartLine).id === 'number' &&
        typeof (line as CartLine).slug === 'string' &&
        typeof (line as CartLine).price === 'number' &&
        typeof (line as CartLine).quantity === 'number' &&
        (line as CartLine).quantity > 0,
    )
  } catch {
    return []
  }
}

/**
 * Holds the shopping cart and mirrors it to `localStorage`, so the basket
 * survives a reload and a return visit. Prices are snapshotted when a product
 * is added; the server re-reads the catalog on checkout day only through the
 * submitted lines, which keeps the cart fully client-side.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredCart)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* ignore write failures */
    }
  }, [lines])

  const add = useCallback((product: Omit<CartLine, 'quantity'>, quantity = 1) => {
    const amount = Math.max(1, Math.round(quantity))
    setLines((current) => {
      const index = current.findIndex((line) => line.id === product.id)
      if (index === -1) return [...current, { ...product, quantity: amount }]
      const next = [...current]
      next[index] = { ...next[index], quantity: next[index].quantity + amount, price: product.price }
      return next
    })
  }, [])

  const setQuantity = useCallback((id: number, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.id !== id)
        : current.map((line) => (line.id === id ? { ...line, quantity: Math.round(quantity) } : line)),
    )
  }, [])

  const remove = useCallback((id: number) => {
    setLines((current) => current.filter((line) => line.id !== id))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0)
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)

    return {
      lines,
      count,
      subtotal,
      add,
      setQuantity,
      remove,
      clear,
      toOrderDraft: (customer, language: Language): OrderDraft => ({
        language,
        customer,
        subtotal,
        total: subtotal,
        items: lines.map((line) => ({
          productId: line.id,
          slug: line.slug,
          ref: line.ref,
          nameFr: line.nameFr,
          nameAr: line.nameAr,
          price: line.price,
          quantity: line.quantity,
          image: line.image,
        })),
      }),
    }
  }, [lines, add, setQuantity, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider