import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Language } from '../data/types'
import { useLanguage } from '../hooks/useLanguage'

/**
 * Supports the source site's `/ar/...` and `/fr/...` URL shapes.
 *
 * The clone itself uses flat routes, so this switches the language and then
 * replaces the prefixed URL with its flat equivalent — e.g. `/ar/boutique`
 * becomes `/boutique` with Arabic active.
 */
export function LanguageAlias({ lang }: { lang: Language }) {
  const { setLanguage } = useLanguage()
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setLanguage(lang)

    const withoutPrefix = pathname.replace(/^\/(?:ar|fr)(?=\/|$)/, '')
    navigate(`${withoutPrefix}${search}${hash}` || '/', { replace: true })
  }, [lang, pathname, search, hash, navigate, setLanguage])

  return null
}

export default LanguageAlias
