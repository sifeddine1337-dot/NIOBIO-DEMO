/**
 * Order processing and status tracking.
 *
 * Displays incoming customer orders (newest first) with:
 * - Status filtering (pending, confirmed, delivered, cancelled)
 * - Customer phone number with tel: link and 1-click copy
 * - Order lines breakdown
 * - Payment on delivery note
 * - Fast status changer dropdown
 */
import { useMemo, useState } from 'react'
import { CheckIcon, CopyIcon, PhoneIcon, TrashIcon } from '../../components/common/Icons'
import { adminApi } from '../../lib/adminApi'
import { formatPrice } from '../../lib/formatPrice'
import { telHref } from '../../data/site'
import { useAdminShell } from './adminShell'
import type { AdminOrder, OrderStatus } from './types'

export function AdminOrders() {
  const { t, orders, ordersLoading, refreshOrders, notify } = useAdminShell()

  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders
    return orders.filter((o) => o.status === statusFilter)
  }, [orders, statusFilter])

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard?.writeText(phone)
    setCopiedPhone(phone)
    setTimeout(() => {
      setCopiedPhone((cur) => (cur === phone ? null : cur))
    }, 2000)
  }

  const handleStatusChange = async (orderId: number, nextStatus: OrderStatus) => {
    setUpdatingId(orderId)
    try {
      const updated = await adminApi.updateOrder(orderId, { status: nextStatus })
      notify(t('orders.statusUpdated'), 'ok')
      await refreshOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated)
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : t('ui.error'), 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm(t('orders.deleteConfirm'))) return
    setDeletingId(orderId)
    try {
      await adminApi.deleteOrder(orderId)
      notify(t('orders.deleted'), 'ok')
      await refreshOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null)
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : t('ui.error'), 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const statusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'admin-badge--pending'
      case 'confirmed':
        return 'admin-badge--confirmed'
      case 'delivered':
        return 'admin-badge--delivered'
      case 'cancelled':
        return 'admin-badge--cancelled'
      default:
        return 'admin-badge--neutral'
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__text">
          <h2>{t('orders.title')}</h2>
          <p>{t('orders.subtitle')}</p>
        </div>
        <div className="admin-head__actions">
          <button
            type="button"
            className="admin-btn admin-btn--ghost admin-btn--sm"
            onClick={refreshOrders}
            disabled={ordersLoading}
          >
            {ordersLoading ? t('ui.loading') : t('ui.refresh')}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-tabs">
        {(['all', 'pending', 'confirmed', 'delivered', 'cancelled'] as const).map((st) => {
          const label = st === 'all' ? t('orders.filter.all') : t(`orders.status.${st}`)
          const count = st === 'all' ? orders.length : orders.filter((o) => o.status === st).length
          return (
            <button
              key={st}
              type="button"
              className={`admin-tab ${statusFilter === st ? 'is-active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              <span>{label}</span>
              <span className="admin-tab__count">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Orders Grid / Master-Detail */}
      <div className="admin-orders-grid">
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 110 }}>{t('orders.number')}</th>
                  <th>{t('orders.customer')}</th>
                  <th style={{ width: 150 }}>{t('orders.phone')}</th>
                  <th style={{ width: 90 }}>{t('orders.items')}</th>
                  <th style={{ width: 120 }}>{t('orders.total')}</th>
                  <th style={{ width: 140 }}>{t('orders.status')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--color-text-muted)' }}>
                      {t('orders.empty')}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const isSelected = selectedOrder?.id === ord.id
                    return (
                      <tr
                        key={ord.id}
                        onClick={() => setSelectedOrder(ord)}
                        style={{
                          cursor: 'pointer',
                          background: isSelected ? 'var(--color-primary-soft)' : undefined,
                        }}
                      >
                        <td>
                          <strong style={{ color: 'var(--color-primary)' }}>{ord.number}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {ord.createdAt?.slice(0, 10)}
                          </div>
                        </td>
                        <td>
                          <strong>{ord.customer?.name || '—'}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {ord.customer?.wilaya ? `${ord.customer.wilaya}` : ''}
                            {ord.customer?.commune ? ` - ${ord.customer.commune}` : ''}
                          </div>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          {ord.customer?.phone ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              <a
                                href={telHref(ord.customer.phone)}
                                className="admin-link"
                                dir="ltr"
                                style={{ fontWeight: 600 }}
                              >
                                {ord.customer.phone}
                              </a>
                              <button
                                type="button"
                                className="admin-btn admin-btn--ghost admin-btn--icon"
                                style={{ width: 26, height: 26, padding: 0 }}
                                onClick={() => handleCopyPhone(ord.customer.phone)}
                                title={t('orders.copyPhone')}
                              >
                                {copiedPhone === ord.customer.phone ? (
                                  <CheckIcon size={14} />
                                ) : (
                                  <CopyIcon size={14} />
                                )}
                              </button>
                            </div>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>
                          {ord.items?.reduce((s, it) => s + (it.quantity || 1), 0) ?? 0}
                        </td>
                        <td>
                          <strong dir="ltr">{formatPrice(ord.total ?? ord.subtotal ?? 0)}</strong>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <select
                            className={`admin-status-select ${statusBadgeClass(ord.status)}`}
                            value={ord.status}
                            disabled={updatingId === ord.id}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                          >
                            <option value="pending">{t('orders.status.pending')}</option>
                            <option value="confirmed">{t('orders.status.confirmed')}</option>
                            <option value="delivered">{t('orders.status.delivered')}</option>
                            <option value="cancelled">{t('orders.status.cancelled')}</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Drawer / Column */}
        {selectedOrder && (
          <div className="admin-card admin-order-detail">
            <div className="admin-order-detail__head">
              <div>
                <h3>{selectedOrder.number}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ''}
                </span>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="admin-order-detail__actions">
              {selectedOrder.customer?.phone && (
                <a
                  href={telHref(selectedOrder.customer.phone)}
                  className="admin-btn admin-btn--primary admin-btn--sm"
                >
                  <PhoneIcon size={14} />
                  <span>{t('orders.callCustomer')}</span>
                </a>
              )}
              <button
                type="button"
                className="admin-btn admin-btn--danger admin-btn--sm"
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                disabled={deletingId === selectedOrder.id}
              >
                <TrashIcon size={14} />
                <span>{t('ui.delete')}</span>
              </button>
            </div>

            {/* Customer Details */}
            <div className="admin-order-detail__section">
              <h4>{t('orders.customer')}</h4>
              <dl className="admin-order-dl">
                <div>
                  <dt>{t('orders.customer')}</dt>
                  <dd>{selectedOrder.customer?.name || '—'}</dd>
                </div>
                <div>
                  <dt>{t('orders.phone')}</dt>
                  <dd dir="ltr">
                    <a href={telHref(selectedOrder.customer?.phone || '')}>
                      {selectedOrder.customer?.phone || '—'}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>{t('orders.wilaya')}</dt>
                  <dd>{selectedOrder.customer?.wilaya || '—'}</dd>
                </div>
                <div>
                  <dt>{t('orders.commune')}</dt>
                  <dd>{selectedOrder.customer?.commune || '—'}</dd>
                </div>
                <div>
                  <dt>{t('orders.address')}</dt>
                  <dd>{selectedOrder.customer?.address || '—'}</dd>
                </div>
                <div>
                  <dt>{t('orders.notes')}</dt>
                  <dd>{selectedOrder.customer?.notes || <em>{t('orders.noNotes')}</em>}</dd>
                </div>
              </dl>
            </div>

            {/* Ordered Items */}
            <div className="admin-order-detail__section">
              <h4>{t('orders.items')}</h4>
              <div className="admin-order-items">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="admin-order-item">
                    {it.image && (
                      <img src={it.image} alt="" className="admin-order-item__thumb" />
                    )}
                    <div className="admin-order-item__info">
                      <strong>{it.nameFr || it.nameAr}</strong>
                      {it.nameAr && it.nameFr && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }} dir="rtl">
                          {it.nameAr}
                        </div>
                      )}
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {it.ref ? `Réf: ${it.ref} — ` : ''}
                        {it.quantity} × {formatPrice(it.price)}
                      </span>
                    </div>
                    <div className="admin-order-item__total" dir="ltr">
                      {formatPrice(it.price * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-order-total-bar">
                <span>{t('orders.total')}</span>
                <strong dir="ltr">{formatPrice(selectedOrder.total ?? selectedOrder.subtotal ?? 0)}</strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
                💵 {t('orders.payOnDelivery')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders