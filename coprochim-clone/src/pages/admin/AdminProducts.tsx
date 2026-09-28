/**
 * Product catalog management.
 *
 * Features:
 * - Live search and category filtering
 * - Paginated table view
 * - Add product modal with image upload / URL picker
 * - Edit product modal
 * - Automatic refresh of storefront catalog via loadCatalogFromServer
 * - Automatic refresh of storefront catalog via refreshCatalogStore
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CloseIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon } from '../../components/common/Icons'
import { categories, products } from '../../data/catalog'
import type { Product } from '../../data/types'
import { adminApi } from '../../lib/adminApi'
import { formatPrice } from '../../lib/formatPrice'
import { useAdminShell } from './adminShell'
import { ImageField } from './ImageField'
import type { ProductInput } from './types'

const ITEMS_PER_PAGE = 25

export function AdminProducts() {
  const { t, notify, refreshCatalog } = useAdminShell()
  const [searchParams, setSearchParams] = useSearchParams()

  // Filters & pagination
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)

  // Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState<ProductInput>({
    nameFr: '',
    nameAr: '',
    ref: '',
    price: 0,
    categorySlug: '',
    image: '',
    slug: '',
  })
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Filter products locally from the in-memory store
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (categoryFilter && p.categorySlug !== categoryFilter) return false
      if (!q) return true
      return (
        p.nameFr.toLowerCase().includes(q) ||
        p.nameAr.includes(q) ||
        p.ref.toLowerCase().includes(q)
      )
    })
  }, [query, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, page])

  const openCreateModal = useCallback(() => {
    setForm({
      nameFr: '',
      nameAr: '',
      ref: '',
      price: 0,
      categorySlug: categories[0]?.slug ?? '',
      image: '',
      slug: '',
    })
    setIsCreating(true)
    setEditingProduct(null)
  }, [])

  // Open new product modal if query string has ?new=1
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      const timer = setTimeout(() => {
        openCreateModal()
        setSearchParams({}, { replace: true })
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [searchParams, setSearchParams, openCreateModal])

  const openEditModal = (product: Product) => {
    setForm({
      id: product.id,
      nameFr: product.nameFr,
      nameAr: product.nameAr,
      ref: product.ref,
      price: product.price,
      categorySlug: product.categorySlug,
      image: product.image,
      slug: product.slug,
    })
    setEditingProduct(product)
    setIsCreating(false)
  }

  const closeModal = () => {
    setIsCreating(false)
    setEditingProduct(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nameFr.trim()) return
    setSaving(true)
    try {
      if (isCreating) {
        await adminApi.createProduct(form)
        notify(t('products.savedNew'), 'ok')
      } else if (editingProduct?.id) {
        await adminApi.updateProduct(editingProduct.id, form)
        notify(t('products.savedEdit'), 'ok')
      }
      await refreshCatalog()
      closeModal()
    } catch (err) {
      notify(err instanceof Error ? err.message : t('ui.error'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('products.deleteConfirm'))) return
    setDeletingId(id)
    try {
      await adminApi.deleteProduct(id)
      await refreshCatalog()
      notify(t('products.deleted'), 'ok')
    } catch (err) {
      notify(err instanceof Error ? err.message : t('ui.error'), 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="admin-page" style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-ink)' }}>{t('products.title')}</h2>
          <p className="text-muted" style={{ fontSize: '0.88rem' }}>
            {t('products.subtitle')}
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" onClick={openCreateModal}>
          <PlusIcon size={16} />
          {t('products.new')}
        </button>
      </div>

      {/* Toolbar (search + category filter) */}
      <div className="admin-card">
        <div className="admin-card__body">
          <div className="admin-toolbar">
            <div className="admin-toolbar__search">
              <SearchIcon size={16} />
              <input
                type="text"
                className="input"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                placeholder={t('products.search')}
              />
            </div>

            <select
              className="select"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setPage(1)
              }}
              style={{ width: 'auto', minWidth: 200 }}
            >
              <option value="">{t('products.allCategories')}</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.nameFr}
                </option>
              ))}
            </select>

            <span className="text-muted" style={{ marginInlineStart: 'auto', fontSize: '0.86rem' }}>
              {filteredProducts.length} {t('products.count')}
            </span>
          </div>
        </div>

        {/* Products Table */}
        <div className="admin-table-wrap">
          {paginatedProducts.length === 0 ? (
            <div className="admin-empty">{t('products.empty')}</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 64 }}>{t('products.thumb')}</th>
                  <th>{t('products.ref')}</th>
                  <th>{t('products.nameFr')}</th>
                  <th>{t('products.nameAr')}</th>
                  <th>{t('products.category')}</th>
                  <th>{t('products.price')}</th>
                  <th style={{ textAlign: 'end' }}></th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => {
                  const cat = categories.find((c) => c.slug === product.categorySlug)
                  return (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.image || '/images/hero.png'}
                          alt=""
                          className="admin-table__thumb"
                          loading="lazy"
                        />
                      </td>
                      <td>
                        <span className="text-muted" dir="ltr" style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                          {product.ref || '—'}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--color-ink)' }}>
                          {product.nameFr || product.nameAr}
                        </strong>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{product.nameAr}</span>
                      </td>
                      <td>
                        <span className="admin-pill admin-pill--confirmed" style={{ fontSize: '0.74rem' }}>
                          {cat ? cat.nameFr : product.categorySlug}
                        </span>
                      </td>
                      <td className="admin-table__price" dir="ltr">
                        {formatPrice(product.price)}
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button
                            type="button"
                            className="admin-btn admin-btn--ghost admin-btn--icon"
                            onClick={() => openEditModal(product)}
                            title={t('ui.edit')}
                          >
                            <PencilIcon size={14} />
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--danger admin-btn--icon"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            title={t('ui.delete')}
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="admin-pager">
            <span>
              {t('ui.page')} {page} {t('ui.of')} {totalPages}
            </span>
            <div className="admin-pager__buttons">
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                {t('ui.previous')}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {t('ui.next')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Edit / Create Modal */}
      {(isCreating || editingProduct) && (
        <div className="admin-modal">
          <div className="admin-modal__overlay" onClick={closeModal} />
          <div className="admin-modal__panel">
            <div className="admin-modal__head">
              <h2>{isCreating ? t('products.new') : t('products.edit')}</h2>
              <button type="button" className="admin-modal__close" onClick={closeModal}>
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal__body">
                <div className="admin-form-grid">
                  <div className="field">
                    <label>{t('products.nameFr')} *</label>
                    <input
                      type="text"
                      className="input"
                      required
                      value={form.nameFr}
                      onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
                      placeholder="Ex : Microscope binoculaire"
                    />
                  </div>

                  <div className="field">
                    <label>{t('products.nameAr')}</label>
                    <input
                      type="text"
                      className="input"
                      dir="rtl"
                      value={form.nameAr}
                      onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                      placeholder="مثال: مجهر ضوئي"
                    />
                  </div>

                  <div className="field">
                    <label>{t('products.ref')}</label>
                    <input
                      type="text"
                      className="input"
                      value={form.ref}
                      onChange={(e) => setForm({ ...form, ref: e.target.value })}
                      placeholder={t('products.refPlaceholder')}
                    />
                  </div>

                  <div className="field">
                    <label>{t('products.price')}</label>
                    <input
                      type="number"
                      className="input"
                      min={0}
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <label>{t('products.category')} *</label>
                    <select
                      className="select"
                      required
                      value={form.categorySlug}
                      onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                    >
                      <option value="">-- {t('products.selectCategory')} --</option>
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.nameFr} — {c.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <label>{t('products.slug')} ({t('ui.optional')})</label>
                    <input
                      type="text"
                      className="input"
                      value={form.slug || ''}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder={t('products.slugHint')}
                    />
                  </div>
                </div>

                <ImageField
                  label={t('products.thumb')}
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                />
              </div>

              <div className="admin-modal__foot">
                <button type="button" className="admin-btn admin-btn--ghost" onClick={closeModal}>
                  {t('ui.cancel')}
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                  disabled={saving || !form.nameFr.trim()}
                >
                  {saving ? t('ui.saving') : t('ui.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts