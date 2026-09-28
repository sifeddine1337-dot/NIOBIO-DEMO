import { createContext } from 'react'
import type { Language } from '../data/types'
import type { TranslationKey } from '../i18n/translations'

export interface LanguageContextValue {
  /** Currently active UI language. */
  language: Language
  setLanguage: (language: Language) => void
  /** Flips between Arabic (RTL) and French (LTR). */
  toggleLanguage: () => void
  /** Looks up a UI string for the active language. */
  t: (key: TranslationKey) => string
  /** True while Arabic is active, i.e. the document is in RTL. */
  isRTL: boolean
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)
