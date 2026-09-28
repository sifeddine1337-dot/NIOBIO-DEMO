/**
 * Site settings & general management.
 *
 * Controls:
 * - Phones (header bar, delivery, availability, contact page lines, fax)
 * - Email and postal address
 * - Social media links
 * - Hero / Why-Us / Logo images (with live file upload)
 * - Downloadable catalogues (PDF + cover image)
 */
import { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon } from '../../components/common/Icons'
import type { CatalogueItem, SiteSettings } from '../../data/siteDefaults'
import { adminApi } from '../../lib/adminApi'
import { useAdminShell } from './adminShell'
import { ImageField } from './ImageField'

export function AdminSettings() {
  const { t, notify, refreshCatalog } = useAdminShell()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [site, setSite] = useState<SiteSettings | null>(null)
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([])

  useEffect(() => {
    adminApi
      .settings()
      .then((data) => {
        setSite(data.site)
        setCatalogues(data.catalogues || [])
      })
      .catch((err) => {
        notify(err instanceof Error ? err.message : t('ui.error'), 'error')
      })
      .finally(() => setLoading(false))
  }, [notify, t])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!site) return
    setSaving(true)
    try {
      await adminApi.saveSettings({ site, catalogues })
      notify(t('set.saved'), 'ok')
      await refreshCatalog()
    } catch (err) {
      notify(err instanceof Error ? err.message : t('ui.error'), 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !site) {
    return (
      <div className="admin-page">
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)' }}>
          {t('ui.loading')}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__text">
          <h2>{t('set.title')}</h2>
          <p>{t('set.subtitle')}</p>
        </div>
        <div className="admin-head__actions">
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? t('ui.saving') : t('ui.save')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="admin-settings-form">
        {/* Site Images */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>{t('set.images')}</h3>
          <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <ImageField
              label={t('set.imageLogo')}
              value={site.images?.logo || '/images/logo-header.svg'}
              onChange={(url) =>
                setSite({ ...site, images: { ...site.images, logo: url } })
              }
            />
            <ImageField
              label={t('set.imageHero')}
              value={site.images?.hero || '/images/hero.png'}
              onChange={(url) =>
                setSite({ ...site, images: { ...site.images, hero: url } })
              }
            />
            <ImageField
              label={t('set.imageWhyUs')}
              value={site.images?.whyUs || '/images/why-us.webp'}
              onChange={(url) =>
                setSite({ ...site, images: { ...site.images, whyUs: url } })
              }
            />
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>{t('set.contact')}</h3>
          <div className="admin-form-grid">
            <div className="field">
              <label>{t('set.deliveryPhone')}</label>
              <input
                type="text"
                className="input"
                dir="ltr"
                value={site.deliveryPhone}
                onChange={(e) => setSite({ ...site, deliveryPhone: e.target.value })}
              />
            </div>
            <div className="field">
              <label>{t('set.availabilityPhone')}</label>
              <input
                type="text"
                className="input"
                dir="ltr"
                value={site.availabilityPhone}
                onChange={(e) => setSite({ ...site, availabilityPhone: e.target.value })}
              />
            </div>
            <div className="field">
              <label>{t('set.email')}</label>
              <input
                type="email"
                className="input"
                dir="ltr"
                value={site.email}
                onChange={(e) => setSite({ ...site, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label>{t('set.fax')}</label>
              <input
                type="text"
                className="input"
                dir="ltr"
                value={site.fax}
                onChange={(e) => setSite({ ...site, fax: e.target.value })}
              />
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>{t('set.orderForm')}</label>
              <input
                type="text"
                className="input"
                dir="ltr"
                value={site.orderForm}
                onChange={(e) => setSite({ ...site, orderForm: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Postal Address */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>{t('set.address')}</h3>
          <div className="admin-form-grid">
            <div className="field">
              <label>{t('set.address1')}</label>
              <input
                type="text"
                className="input"
                value={site.address.line1}
                onChange={(e) =>
                  setSite({ ...site, address: { ...site.address, line1: e.target.value } })
                }
              />
            </div>
            <div className="field">
              <label>{t('set.address2')}</label>
              <input
                type="text"
                className="input"
                value={site.address.line2}
                onChange={(e) =>
                  setSite({ ...site, address: { ...site.address, line2: e.target.value } })
                }
              />
            </div>
            <div className="field">
              <label>{t('set.address3')}</label>
              <input
                type="text"
                className="input"
                value={site.address.line3}
                onChange={(e) =>
                  setSite({ ...site, address: { ...site.address, line3: e.target.value } })
                }
              />
            </div>
          </div>
        </div>

        {/* Top bar phone numbers */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3>{t('set.topPhones')}</h3>
            <button
              type="button"
              className="admin-btn admin-btn--ghost admin-btn--sm"
              onClick={() => setSite({ ...site, topPhones: [...site.topPhones, ''] })}
            >
              <PlusIcon size={14} />
              <span>{t('set.addRow')}</span>
            </button>
          </div>
          <div className="admin-list-rows">
            {site.topPhones.map((ph: string, idx: number) => (
              <div key={idx} className="admin-list-row">
                <input
                  type="text"
                  className="input"
                  dir="ltr"
                  value={ph}
                  onChange={(e) => {
                    const copy = [...site.topPhones]
                    copy[idx] = e.target.value
                    setSite({ ...site, topPhones: copy })
                  }}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn--danger admin-btn--icon"
                  onClick={() => {
                    const copy = site.topPhones.filter((_: string, i: number) => i !== idx)
                    setSite({ ...site, topPhones: copy })
                  }}
                  title={t('set.removeRow')}
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Downloadable Catalogues */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3>{t('set.catalogues')}</h3>
            <button
              type="button"
              className="admin-btn admin-btn--ghost admin-btn--sm"
              onClick={() =>
                setCatalogues([
                  ...catalogues,
                  {
                    titleFr: 'Nouveau catalogue',
                    titleAr: 'كتالوج جديد',
                    file: '/images/bon-de-commande.pdf',
                    cover: '/images/catalogue-2023-2024.png',
                  },
                ])
              }
            >
              <PlusIcon size={14} />
              <span>{t('set.addCatalogue')}</span>
            </button>
          </div>

          <div style={{ display: 'grid', gap: 20 }}>
            {catalogues.map((cat, idx) => (
              <div
                key={idx}
                style={{
                  padding: 18,
                  background: 'var(--color-bg-alt)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <strong>#{idx + 1} — {cat.titleFr}</strong>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger admin-btn--sm"
                    onClick={() => setCatalogues(catalogues.filter((_, i) => i !== idx))}
                  >
                    <TrashIcon size={14} />
                    <span>{t('set.removeCatalogue')}</span>
                  </button>
                </div>

                <div className="admin-form-grid">
                  <div className="field">
                    <label>{t('set.catalogueTitleFr')}</label>
                    <input
                      type="text"
                      className="input"
                      value={cat.titleFr}
                      onChange={(e) => {
                        const copy = [...catalogues]
                        copy[idx] = { ...copy[idx], titleFr: e.target.value }
                        setCatalogues(copy)
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>{t('set.catalogueTitleAr')}</label>
                    <input
                      type="text"
                      className="input"
                      dir="rtl"
                      value={cat.titleAr}
                      onChange={(e) => {
                        const copy = [...catalogues]
                        copy[idx] = { ...copy[idx], titleAr: e.target.value }
                        setCatalogues(copy)
                      }}
                    />
                  </div>
                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <label>{t('set.catalogueFile')} (URL)</label>
                    <input
                      type="text"
                      className="input"
                      dir="ltr"
                      value={cat.file}
                      onChange={(e) => {
                        const copy = [...catalogues]
                        copy[idx] = { ...copy[idx], file: e.target.value }
                        setCatalogues(copy)
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <ImageField
                      label={t('set.catalogueCover')}
                      value={cat.cover}
                      onChange={(url) => {
                        const copy = [...catalogues]
                        copy[idx] = { ...copy[idx], cover: url }
                        setCatalogues(copy)
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div
          style={{
            position: 'sticky',
            bottom: 16,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            padding: '14px 20px',
            background: 'var(--color-white)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={saving}
          >
            {saving ? t('ui.saving') : t('ui.save')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminSettings