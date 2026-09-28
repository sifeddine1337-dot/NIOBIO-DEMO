import type { AdminTextKey } from './adminText'
/**
 * Control panel dashboard.
 *
 * Shows top-level KPIs (total products, categories, total orders, pending orders,
 * sales realised on shipped orders, catalog inventory value), quick shortcuts,
 * and the most recent orders with quick actions.
 */
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BoxIcon, ChartIcon, CheckIcon, ListIcon, PhoneIcon, TruckIcon } from '../../components/common/Icons'
import { categories, products } from '../../data/catalog'
import { formatPrice } from '../../lib/formatPrice'
import { useAdminShell } from './adminShell'

export function AdminDashboard() {
  const { t, orders, ordersLoading } = useAdminShell()

  const totalProducts = products.length
  const totalCategories = categories.length
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'pending'), [orders])

  // Sales figures count a sale only once the order has shipped (delivered):
  // pending, confirmed and cancelled orders are not revenue yet.
  const shippedOrders = useMemo(() => orders.filter((o) => o.status === 'delivered'), [orders])
  const shippedSales = useMemo(
    () => shippedOrders.reduce((sum, o) => sum + (o.total || 0), 0),
    [shippedOrders],
  )

  const catalogValue = useMemo(
    () => products.reduce((sum, p) => sum + (p.price || 0), 0),
    [],
  )

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders])

  return (
    <div className="admin-page" style={{ display: 'grid', gap: '22px' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--color-ink)' }}>{t('dash.title')}</h2>
        <p className="text-muted" style={{ fontSize: '0.88rem' }}>
          {t('dash.subtitle')}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat__icon">
            <BoxIcon size={20} />
          </span>
          <div className="admin-stat__value">{totalProducts}</div>
          <div className="admin-stat__label">{t('dash.products')}</div>
        </div>

        <div className="admin-stat">
          <span className="admin-stat__icon">
            <ListIcon size={20} />
          </span>
          <div className="admin-stat__value">{totalCategories}</div>
          <div className="admin-stat__label">{t('dash.categories')}</div>
        </div>

        <div className={`admin-stat ${pendingOrders.length > 0 ? 'admin-stat--alert' : ''}`}>
          <span className="admin-stat__icon">
            <PhoneIcon size={20} />
          </span>
          <div className="admin-stat__value">{pendingOrders.length}</div>
          <div className="admin-stat__label">{t('dash.pending')}</div>
        </div>

        <div className="admin-stat">
          <span className="admin-stat__icon">
            <ChartIcon size={20} />
          </span>
          <div className="admin-stat__value" style={{ fontSize: '1.35rem' }}>
            {formatPrice(catalogValue)}
          </div>
          <div className="admin-stat__label">{t('dash.value')}</div>
        </div>

        {/* Sales: revenue of orders that actually shipped (status = delivered). */}
        <div className="admin-stat">
          <span className="admin-stat__icon">
            <TruckIcon size={20} />
          </span>
          <div className="admin-stat__value" style={{ fontSize: '1.35rem' }}>
            {formatPrice(shippedSales)}
          </div>
          <div className="admin-stat__label">{t('dash.sales')}</div>
          <div className="admin-stat__label" style={{ fontSize: '0.74rem' }}>
            {shippedOrders.length} {t('dash.salesCount')}
          </div>
        </div>
      </div>

      {/* Quick shortcuts */}
      <div className="admin-card">
        <div className="admin-card__head">
          <h2>{t('dash.shortcuts')}</h2>
        </div>
        <div className="admin-card__body" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Link to="/admin/products?new=1" className="admin-btn admin-btn--primary admin-btn--sm">
            + {t('dash.addProduct')}
          </Link>
          <Link to="/admin/orders" className="admin-btn admin-btn--ghost admin-btn--sm">
            {t('dash.manageOrders')} ({pendingOrders.length})
          </Link>
          <Link to="/admin/settings" className="admin-btn admin-btn--ghost admin-btn--sm">
            {t('dash.editSite')}
          </Link>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="admin-card">
        <div className="admin-card__head">
          <h2>{t('dash.recent')}</h2>
          <div className="admin-card__head-actions">
            <Link to="/admin/orders" className="admin-btn admin-btn--ghost admin-btn--sm">
              {t('ui.checkAll')} ({orders.length}) →
            </Link>
          </div>
        </div>

        <div className="admin-table-wrap">
          {ordersLoading ? (
            <div className="admin-empty">{t('ui.loading')}</div>
          ) : recentOrders.length === 0 ? (
            <div className="admin-empty">{t('dash.noOrders')}</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('orders.number')}</th>
                  <th>{t('orders.date')}</th>
                  <th>{t('orders.customer')}</th>
                  <th>{t('orders.phone')}</th>
                  <th>{t('orders.total')}</th>
                  <th>{t('orders.status')}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link
                        to={`/admin/orders?view=${order.id}`}
                        style={{ fontWeight: 700, color: 'var(--color-primary)' }}
                      >
                        {order.number}
                      </Link>
                    </td>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}</td>
                    <td>
                      <strong>{order.customer.name}</strong>
                      {order.customer.wilaya && (
                        <span className="text-muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                          {order.customer.wilaya}
                        </span>
                      )}
                    </td>
                    <td>
                      <a href={`tel:${order.customer.phone}`} className="admin-phone-link" dir="ltr">
                        {order.customer.phone}
                      </a>
                    </td>
                    <td className="admin-table__price" dir="ltr">
                      {formatPrice(order.total)}
                    </td>
                    <td>
                      <span className={`admin-pill admin-pill--${order.status}`}>
                        {order.status === 'confirmed' && <CheckIcon size={12} />}
                        {t(`orders.status.${order.status}` as AdminTextKey)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard