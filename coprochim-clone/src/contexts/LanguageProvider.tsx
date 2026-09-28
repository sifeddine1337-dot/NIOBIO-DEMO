import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Language } from '../data/types'
import { translations } from '../i18n/translations'
import type { TranslationKey } from '../i18n/translations'
import { LanguageContext } from './languageContext'
import type { LanguageContextValue } from './languageContext'

const STORAGE_KEY = 'site:language'

/** Arabic is the primary locale on the source site. */
const DEFAULT_LANGUAGE: Language = 'ar'

/**
 * Resolution order: a `/ar` or `/fr` path prefix (the shape the live site
 * uses), then the visitor's previous choice, then Arabic.
 */
function readInitialLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE

  const prefix = window.location.pathname.split('/')[1]
  if (prefix === 'ar' || prefix === 'fr') return prefix

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'ar' || stored === 'fr') return stored
  } catch {
    /* localStorage can be unavailable in private mode */
  }

  return DEFAULT_LANGUAGE
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readInitialLanguage)

  // Keep <html lang> / <html dir> in sync so RTL layout and font selection
  // follow the active language.
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    try {
      window.localStorage.setItem(STORAGE_KEY, language)
    } catch {
      /* ignore write failures */
    }
  }, [language])

  const t = useCallback(
    (key: TranslationKey): string => translations[language][key] ?? key,
    [language],
  )

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === 'ar' ? 'fr' : 'ar')),
      t,
      isRTL: language === 'ar',
    }),
    [language, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
