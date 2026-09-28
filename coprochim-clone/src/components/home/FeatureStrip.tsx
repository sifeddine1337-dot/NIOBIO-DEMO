import { site } from '../../data/site'
import { useCatalog } from '../../hooks/useCatalog'
import { useLanguage } from '../../hooks/useLanguage'
import { TrustBadges } from '../common/TrustBadges'
import type { TrustItem } from '../common/TrustBadges'

/**
 * The four-up reassurance row sitting between the two product grids: free
 * delivery, satisfied-or-refunded, warranty, and the availability phone line.
 * All copy is taken verbatim from the source site.
 */
export function FeatureStrip() {
  const { t } = useLanguage()
  // Re-render when the admin panel edits the availability phone line.
  useCatalog()

  const items: TrustItem[] = [
    { icon: 'truck', title: t('features.deliveryTitle'), body: t('features.deliveryBody') },
    {
      icon: 'refund',
      title: t('features.satisfactionTitle'),
      body: t('features.satisfactionBody'),
    },
    { icon: 'shield', title: t('features.warrantyTitle'), body: t('features.warrantyBody') },
    {
      icon: 'clock',
      title: t('features.availabilityTitle'),
      body: t('features.availabilityBody'),
      note: site.availabilityPhone,
    },
  ]

  return (
    <section className="section section--alt">
      <div className="container">
        <TrustBadges items={items} />
      </div>
    </section>
  )
}

export default FeatureStrip
