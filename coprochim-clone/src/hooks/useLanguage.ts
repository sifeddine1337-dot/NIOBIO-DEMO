import { useContext } from 'react'
import { LanguageContext } from '../contexts/languageContext'

/**
 * Access the active language, the `t()` translator and the RTL flag.
 * Must be called below `<LanguageProvider />`.
 */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
