import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Newsletter } from './components/common/Newsletter'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { useScrollToTop } from './hooks/useScrollToTop'
import { AboutPage } from './pages/AboutPage'
import { CartPage } from './pages/CartPage'
import { CategoryPage } from './pages/CategoryPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ContactPage } from './pages/ContactPage'
import { DeliveryPage } from './pages/DeliveryPage'
import { GuidePage } from './pages/GuidePage'
import { HomePage } from './pages/HomePage'
import { LanguageAlias } from './pages/LanguageAlias'
import { NotFoundPage } from './pages/NotFoundPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { ProductPage } from './pages/ProductPage'
import { ShopPage } from './pages/ShopPage'
import { AdminApp } from './pages/admin/AdminApp'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminProducts } from './pages/admin/AdminProducts'
import { AdminCategories } from './pages/admin/AdminCategories'
import { AdminOrders } from './pages/admin/AdminOrders'
import { AdminSettings } from './pages/admin/AdminSettings'

/** Panel address people type by hand — the most common mistyped casing. */
const ADMIN_PATH = '/admin'

/** Static storefront routes, used to recognise a mistyped address. */
const STATIC_ROUTES = [
  '/boutique',
  '/panier',
  '/commande',
  '/commande/confirmation',
  '/livraison',
  '/conseil',
  '/a-propos',
  '/contact',
  ADMIN_PATH,
]

/**
 * Addresses are typed by hand and the casing slips ("/ADMIN", "/Boutique",
 * "/panier/"). React Router matches paths case-sensitively, so without this a
 * mistyped-but-recognisable address lands on the "page not found" screen.
 * Returns the canonical path when the address is a known route in another
 * case, `null` when it should simply be rendered (or 404) as typed.
 */
function canonicalise(pathname: string): string | null {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (trimmed === '') return '/'
  const lower = trimmed.toLowerCase()
  if (lower === trimmed) return null

  const known =
    STATIC_ROUTES.includes(lower) ||
    lower.startsWith(`${ADMIN_PATH}/`) || // every panel screen, e.g. /ADMIN/ORDERS
    /^\/product\/[^/]+$/.test(lower) ||
    /^\/product-category\/[^/]+$/.test(lower) ||
    /^\/(ar|fr)(\/.*)?$/.test(lower)
  return known ? lower : null
}

/**
 * Application shell: sticky header, routed page content, the newsletter strip
 * and the footer. The newsletter sits above the footer on every page, matching
 * the source layout.
 *
 * Routes are flat (`/boutique`, `/product-category/:slug`, `/product/:slug`,
 * `/livraison`, `/conseil`, `/a-propos`, `/contact`) with no language prefix;
 * the prefixed `/ar/...` and `/fr/...` shapes are handled by `LanguageAlias`
 * and redirect to the flat equivalents.
 */
export default function App() {
  useScrollToTop()
  const { pathname } = useLocation()

  // Send "/ADMIN", "/Boutique", "/panier/"… to the canonical address.
  const canonical = canonicalise(pathname)
  if (canonical) return <Navigate to={canonical} replace />

  const isAdmin = pathname === ADMIN_PATH || pathname.startsWith(`${ADMIN_PATH}/`)

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminApp />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<AdminDashboard />} />
        </Route>
      </Routes>
    )
  }

  return (
    <>
      <Header />

      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/boutique" element={<ShopPage />} />
          <Route path="/product-category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/livraison" element={<DeliveryPage />} />
          <Route path="/conseil" element={<GuidePage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/commande" element={<CheckoutPage />} />
          <Route path="/commande/confirmation" element={<OrderConfirmationPage />} />
          <Route path="/ar/*" element={<LanguageAlias lang="ar" />} />
          <Route path="/fr/*" element={<LanguageAlias lang="fr" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Newsletter />
      <Footer />
    </>
  )
}
