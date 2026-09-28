/**
 * Default, editable site content: contact details, social links, downloads and
 * the swap-in image slots used across the storefront.
 *
 * These values seed the catalog store and are what the admin panel edits. The
 * admin backend mirrors these defaults on first boot (`server/seed.js`), so
 * both sides start from the same content.
 */
import type { Language } from './types'

export interface SocialLink {
  /** Icon key rendered by `<SocialIcon />`. */
  icon: 'facebook' | 'instagram' | 'twitter' | 'youtube'
  label: string
  href?: string
}

export interface CatalogueItem {
  titleFr: string
  titleAr: string
  file: string
  cover: string
}

/** Editable contact / branding settings. */
export interface SiteSettings {
  /** Headline phone numbers shown in the top bar. */
  topPhones: string[]
  /** The four main lines listed on the contact page. */
  phoneLines: string[]
  /** Dedicated line repeated in the delivery / availability blocks. */
  deliveryPhone: string
  availabilityPhone: string
  fax: string
  email: string
  address: {
    line1: string
    line2: string
    line3: string
  }
  /** Order form PDF linked from the hero. */
  orderForm: string
  socials: SocialLink[]
  /** Images the admin can replace without a code change. */
  images: {
    hero: string
    whyUs: string
    logo: string
  }
}

export const DEFAULT_SITE: SiteSettings = {
  topPhones: ['045.62.54.54 / 045.62.55.55', '0550.90.17.09', '045 .62 .03 .88'],
  phoneLines: ['045 62 04 15', '045 62 03 97', '045 62 54 54', '045 62 55 55'],
  deliveryPhone: '045 62 04 15',
  availabilityPhone: '045 62 55 55',
  fax: '045 62 03 88',
  email: 'contact@example.dz',
  address: {
    line1: '33, Rue Mustapha Benboulaid',
    line2: 'Siège social Sig',
    line3: '29300 - BP 95',
  },
  orderForm: '/images/bon-de-commande.pdf',
  socials: [
    { icon: 'facebook', label: 'Facebook' },
    { icon: 'instagram', label: 'Instagram' },
    { icon: 'twitter', label: 'Twitter' },
    { icon: 'youtube', label: 'Youtube' },
  ],
  images: {
    hero: '/images/hero.png',
    whyUs: '/images/why-us.webp',
    logo: '/images/logo-header.svg',
  },
}

export const DEFAULT_CATALOGUES: CatalogueItem[] = [
  {
    titleFr: 'Catalogue 2023 - 2024',
    titleAr: 'كتالوج 2023 - 2024',
    file: '/images/bon-de-commande.pdf',
    cover: '/images/catalogue-2023-2024.png',
  },
  {
    titleFr: 'Catalogue COVID 2021 - 2022',
    titleAr: 'كتالوج 2021 - 2022',
    file: '/images/bon-de-commande.pdf',
    cover: '/images/catalogue-covid-2021-2022.png',
  },
]

/** Picks the right address/contact label set for the active language. */
export const contactLabels: Record<Language, Record<string, string>> = {
  ar: {
    phones: 'أرقام الهاتف',
    email: 'البريد الإلكتروني',
    fax: 'فاكس',
    address: 'العنوان',
  },
  fr: {
    phones: 'Téléphones',
    email: 'Email',
    fax: 'Fax',
    address: 'Adresse',
  },
}