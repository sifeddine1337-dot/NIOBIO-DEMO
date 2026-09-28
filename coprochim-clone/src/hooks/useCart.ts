import { useContext } from 'react'
import { CartContext } from '../contexts/cartContext'

/**
 * Access the shopping cart (lines, totals and mutators).
 * Must be called below `<CartProvider />`.
 */
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default useCart