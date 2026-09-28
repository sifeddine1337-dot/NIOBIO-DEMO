/**
 * Category management tab.
 *
 * Lists all 12+ categories with live product count, image preview, FR/AR names,
 * and allows editing or adding categories. Changes automatically refresh the
 * storefront catalog store.
 */
import { useState } from 'react'
import { CloseIcon, PencilIcon, PlusIcon, TrashIcon } from '../../components/common/Icons'
import { categories, products } from '../../data/catalog'
import type { Category } from '../../data/types'
import { adminApi } from '../../lib/adminApi'
import { useAdminShell } from './adminShell'
import { ImageField } from './ImageField'
import type { CategoryInput } from './types'

export function AdminCategories() {
  const { t, notify, refreshCatalog } = useAdminShell()

  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState<CategoryInput>({
    nameFr: '',
    nameAr: '',
    image: '',
    slug: '',
    count: 0,
  })
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const openCreateModal = () => {
    setForm({
      nameFr: '',
      nameAr: '',
      image: '',
      slug: '',
      count: 0,
    })
    setIsCreating(true)
    setEditingCategory(null)
  }

  const openEditModal = (cat: Category) => {
    // Compute real product count
    const realCount = products.filter((p) => p.categorySlug === cat.slug).length
    setForm({
      id: cat.id,
      nameFr: cat.nameFr,
      nameAr: cat.nameAr,
      image: cat.image,
      slug: cat.slug,
      count: realCount || cat.count,
    })
    setEditingCategory(cat)
    setIsCreating(false)
  }

  const closeModal = () => {
    setIsCreating(false)
    setEditingCategory(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nameFr.trim()) return
    setSaving(true)
    try {
      if (isCreating) {
        await adminApi.createCategory(form)
        notify(t('cats.savedNew'), 'ok')
      } else if (editingCategory?.id) {
        await adminApi.updateCategory(editingCategory.id, form)
        notify(t('cats.savedEdit'), 'ok')
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
    if (!window.confirm(t('cats.deleteConfirm'))) return
    setDeletingId(id)
    try {
      await adminApi.deleteCategory(id)
      notify(t('cats.deleted'), 'ok')
      await refreshCatalog()
    } catch (err) {
      notify(err instanceof Error ? err.message : t('ui.error'), 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__text">
          <h2>{t('cats.title')}</h2>
          <p>{t('cats.subtitle')}</p>
        </div>
        <div className="admin-head__actions">
          <button type="button" className="admin-btn admin-btn--primary" onClick={openCreateModal}>
            <PlusIcon size={16} />
            <span>{t('cats.new')}</span>
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 72 }}>{t('cats.image')}</th>
                <th>{t('products.nameFr')}</th>
                <th>{t('products.nameAr')}</th>
                <th style={{ width: 140 }}>{t('cats.count')}</th>
                <th style={{ width: 100, textAlign: 'end' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categorySlug === cat.slug).length
                return (
                  <tr key={cat.id}>
                    <td>
                      <img
                        src={cat.image || '/images/cat-01.jpg'}
                        alt=""
                        className="admin-product-thumb"
                        width={48}
                        height={48}
                      />
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-ink)' }}>{cat.nameFr}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        slug: <code>{cat.slug}</code>
                      </div>
                    </td>
                    <td dir="rtl">{cat.nameAr}</td>
                    <td>
                      <span className="admin-badge admin-badge--neutral">
                        {count} {t('cats.products')}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost admin-btn--icon"
                          onClick={() => openEditModal(cat)}
                          title={t('ui.edit')}
                        >
                          <PencilIcon size={16} />
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger admin-btn--icon"
                          onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id}
                          title={t('ui.delete')}
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {(isCreating || editingCategory) && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal__head">
              <h3>{isCreating ? t('cats.new') : t('cats.edit')}</h3>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--icon"
                onClick={closeModal}
                aria-label={t('ui.close')}
              >
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
                      placeholder="Ex : GÉOLOGIE"
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
                      placeholder="مثال: علم الجيولوجيا"
                    />
                  </div>

                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <label>
                      {t('products.slug')} ({t('ui.optional')})
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={form.slug || ''}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="geologie"
                    />
                  </div>
                </div>

                <ImageField
                  label={t('cats.image')}
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

export default AdminCategories