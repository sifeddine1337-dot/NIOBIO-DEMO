/**
 * Non-catalog content: contact details, social links and catalogue downloads.
 *
 * The values now live in the catalog store so the admin panel can edit them
 * live. Defaults are defined in `siteDefaults.ts`.
 */
import { storeSettings } from './store'
import type { CatalogueItem, SiteSettings, SocialLink } from './siteDefaults'
export type { CatalogueItem, SiteSettings, SocialLink }

export { contactLabels } from './siteDefaults'

/** Live contact / branding settings, edited from the admin panel. */
export const site: SiteSettings = storeSettings.site

/** Live catalogue downloads. */
export const catalogues: CatalogueItem[] = storeSettings.catalogues

/** Icon name for a social platform, keyed for `<SocialIcon />`. */
export const socialIconName = (icon: SocialLink['icon']): string => icon

/** Formats a phone number for a `tel:` link. */
export const telHref = (phone: string): string => `tel:${phone.replace(/[^\d+]/g, '')}`
