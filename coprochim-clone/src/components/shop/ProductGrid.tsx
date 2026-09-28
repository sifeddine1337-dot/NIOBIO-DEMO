import type { Product } from '../../data/types'
import { ProductCard } from './ProductCard'
import './ProductGrid.css'

/** Responsive grid of product tiles. */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="pgrid">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

export default ProductGrid
