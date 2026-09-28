/**
 * Top-level control panel application shell.
 *
 * Handles authentication state, bearer token storage, active panel language,
 * navigation sidebar, feedback toasts, and refreshing the storefront catalog
 * whenever admin changes are made.
 */
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BoxIcon,
  ChartIcon,
  CloseIcon,
  ListIcon,
  LockIcon,
  LogoutIcon,
  MenuIcon,
  SettingsIcon,
} from '../../components/common/Icons'
import { loadCatalogFromServer } from '../../data/sync'
import type { Language } from '../../data/types'
import { adminApi } from '../../lib/adminApi'
import { authToken } from '../../lib/api'
import './Admin.css'
import type { AdminShell } from './adminShell'
import { adminText, type AdminTextKey } from './adminText'
import type { AdminOrder } from './types'

export function AdminApp() {
  const navigate = useNavigate()
  const location = useLocation()

  // Authentication
  const [token, setToken] = useState<string | null>(() => authToken.get())
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Admin language (defaults to French, the back-office standard on the source site)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('admin:lang')
    return saved === 'ar' ? 'ar' : 'fr'
  })

  const t = useCallback(
    (key: AdminTextKey): string => adminText[lang]?.[key] ?? adminText.fr[key] ?? key,
    [lang],
  )

  const handleSetLang = useCallback((next: Language) => {
    setLang(next)
    localStorage.setItem('admin:lang', next)
  }, [])

  // Feedback banner
  const [banner, setBanner] = useState<{ message: string; kind: 'ok' | 'error' } | null>(null)
  const notify = useCallback((message: string, kind: 'ok' | 'error' = 'ok') => {
    setBanner({ message, kind })
    setTimeout(() => {
      setBanner((cur) => (cur?.message === message ? null : cur))
    }, 4500)
  }, [])

  // Shared orders state
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  const refreshOrders = useCallback(async () => {
    if (!authToken.get()) return
    setOrdersLoading(true)
    try {
      const list = await adminApi.orders('all')
      setOrders(list)
    } catch {
      // non-fatal on boot
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  const refreshCatalog = useCallback(async () => {
    await loadCatalogFromServer()
  }, [])

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Load orders on authenticated boot.
  // Wrapped in setTimeout(..., 0) so the initial asynchronous load does not synchronously
  // set state inside the effect body (satisfies React 19 / eslint rule).
  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        void refreshOrders()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [token, refreshOrders])

  // Close mobile drawer on route change (asynchronous dispatch)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileMenuOpen(false)
    }, 0)
    return () => clearTimeout(timer)
  }, [location.pathname])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoginLoading(true)
    setLoginError(null)
    try {
      const res = await adminApi.login(password.trim())
      authToken.set(res.token)
      setToken(res.token)
      setPassword('')
      await refreshOrders()
      navigate('/admin')
    } catch (err) {
      setLoginError(
        err instanceof Error && err.message.includes('Failed to fetch')
          ? t('login.unreachable')
          : t('login.error'),
      )
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await adminApi.logout()
    } catch {
      // ignore logout network errors
    }
    authToken.clear()
    setToken(null)
    setOrders([])
  }

  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === 'pending').length,
    [orders],
  )

  const shellContext: AdminShell = useMemo(
    () => ({
      t,
      lang,
      setLang: handleSetLang,
      notify,
      refreshCatalog,
      orders,
      ordersLoading,
      refreshOrders,
    }),
    [t, lang, handleSetLang, notify, refreshCatalog, orders, ordersLoading, refreshOrders],
  )

  // ------------------------------------------------ Login screen
  if (!token) {
    return (
      <div className="admin admin-login" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="admin-login__card">
          <div className="admin-login__mark">
            <LockIcon size={24} />
          </div>
          <div>
            <h1>{t('login.title')}</h1>
            <p>{t('login.subtitle')}</p>
          </div>

          {loginError && <div className="admin-alert admin-alert--error">{loginError}</div>}

          <div className="admin-alert admin-alert--info" style={{ fontSize: '0.8rem' }}>
            {t('login.defaultHint')}
          </div>

          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '14px' }}>
            <div className="field">
              <label htmlFor="admin-pw">{t('login.password')}</label>
              <input
                id="admin-pw"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={loginLoading || !password.trim()}
            >
              {loginLoading ? t('login.submitting') : t('login.submit')}
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <Link to="/" className="text-muted" style={{ fontSize: '0.85rem' }}>
              ← {t('login.back')}
            </Link>
            <button
              type="button"
              onClick={() => handleSetLang(lang === 'fr' ? 'ar' : 'fr')}
              className="admin-btn admin-btn--ghost admin-btn--sm"
            >
              {lang === 'fr' ? 'العربية' : 'Français'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ------------------------------------------------ Authenticated panel
  return (
    <div className="admin" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="admin__shell">
        {/* Sidebar */}
        <aside className={`admin__sidebar ${mobileMenuOpen ? 'is-open' : ''}`}>
          <div className="admin__brand">
            <span className="admin__brand-mark">
              <BoxIcon size={22} />
            </span>
            <div className="admin__brand-text">
              <strong>{t('panel.brand')}</strong>
              <span>{t('panel.brandSub')}</span>
            </div>
          </div>

          <nav className="admin__nav">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `admin__nav-link ${isActive ? 'is-active' : ''}`}
            >
              <ChartIcon size={18} />
              <span>{t('nav.dashboard')}</span>
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) => `admin__nav-link ${isActive ? 'is-active' : ''}`}
            >
              <BoxIcon size={18} />
              <span>{t('nav.products')}</span>
            </NavLink>

            <NavLink
              to="/admin/categories"
              className={({ isActive }) => `admin__nav-link ${isActive ? 'is-active' : ''}`}
            >
              <ListIcon size={18} />
              <span>{t('nav.categories')}</span>
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) => `admin__nav-link ${isActive ? 'is-active' : ''}`}
            >
              <ListIcon size={18} />
              <span>{t('nav.orders')}</span>
              {pendingCount > 0 && <span className="admin__nav-badge">{pendingCount}</span>}
            </NavLink>

            <NavLink
              to="/admin/settings"
              className={({ isActive }) => `admin__nav-link ${isActive ? 'is-active' : ''}`}
            >
              <SettingsIcon size={18} />
              <span>{t('nav.settings')}</span>
            </NavLink>
          </nav>

          <div className="admin__sidebar-foot">
            <Link to="/" target="_blank" rel="noreferrer" className="admin__side-btn">
              <span>🌐</span>
              <span>{t('panel.viewSite')}</span>
            </Link>

            <button
              type="button"
              onClick={() => handleSetLang(lang === 'fr' ? 'ar' : 'fr')}
              className="admin__side-btn"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'start' }}
            >
              <span>🌐</span>
              <span>{lang === 'fr' ? 'العربية' : 'Français'}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="admin__side-btn"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'start' }}
            >
              <LogoutIcon size={16} />
              <span>{t('panel.logout')}</span>
            </button>
          </div>
        </aside>

        {/* Main column */}
        <div className="admin__main">
          <header className="admin__bar">
            <button
              type="button"
              className="admin__burger admin-btn admin-btn--ghost admin-btn--icon"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={t('panel.menu')}
            >
              {mobileMenuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
            </button>

            <div>
              <h1>{t('panel.brand')}</h1>
            </div>

            <div className="admin__bar-actions">
              <Link to="/" target="_blank" rel="noreferrer" className="admin-btn admin-btn--ghost admin-btn--sm">
                {t('panel.viewSite')} ↗
              </Link>
            </div>
          </header>

          <div className="admin__content">
            {banner && (
              <div className={`admin-alert ${banner.kind === 'ok' ? 'admin-alert--ok' : 'admin-alert--error'}`}>
                {banner.message}
              </div>
            )}

            <Outlet context={shellContext} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminApp