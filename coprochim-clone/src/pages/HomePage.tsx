import { featuredProducts } from '../data/catalog'
import { useCatalog } from '../hooks/useCatalog'
import { useLanguage } from '../hooks/useLanguage'
import { AboutStats } from '../components/home/AboutStats'
import { Catalogues } from '../components/home/Catalogues'
import { CategoryGrid } from '../components/home/CategoryGrid'
import { FeatureStrip } from '../components/home/FeatureStrip'
import { Hero } from '../components/home/Hero'
import { ProductSection } from '../components/home/ProductSection'
import { WhyUs } from '../components/home/WhyUs'

/**
 * Home page. Section order follows the live site exactly:
 * hero → about + counters → categories → latest products → reassurance strip
 * → catalogues → more products → why us. The newsletter and footer live in the
 * shared layout, as they do on the original.
 */
const FIRST_ROW = 8
const SECOND_ROW_END = 18

export function HomePage() {
  const { t } = useLanguage()
  // Re-render when the admin panel edits the catalog.
  useCatalog()
  const firstRow = featuredProducts(FIRST_ROW)
  const secondRow = featuredProducts(SECOND_ROW_END).slice(FIRST_ROW)

  return (
    <>
      <Hero />
      <AboutStats />
      <CategoryGrid />

      <ProductSection
        title={t('products.latest')}
        products={firstRow}
        moreHref="/boutique"
        moreLabel={t('products.viewAll')}
      />

      <FeatureStrip />
      <Catalogues />

      <ProductSection
        title={t('categories.title')}
        subtitle={t('categories.subtitle')}
        products={secondRow}
        moreHref="/boutique"
        moreLabel={t('products.viewAll')}
        alt
      />

      <WhyUs />
    </>
  )
}

export default HomePage
