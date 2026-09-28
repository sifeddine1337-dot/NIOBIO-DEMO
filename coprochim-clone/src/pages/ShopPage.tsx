import { useMemo, useState } from 'react'
import { categories, products } from '../data/catalog'
import { useCatalog } from '../hooks/useCatalog'
import { useCatalogPaging } from '../hooks/useCatalogPaging'
import { useLanguage } from '../hooks/useLanguage'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { Pagination } from '../components/shop/Pagination'
import { ProductGrid } from '../components/shop/ProductGrid'
import { ShopToolbar } from '../components/shop/ShopToolbar'
import './Pages.css'

/** Full catalog listing with search, category filter, sort and pagination. */
export function ShopPage() {
  const { t } = useLanguage()
  useCatalog()
  const [categorySlug, setCategorySlug] = useState('')

  // Filtering by category first keeps the pager counts accurate.
  // `version` keeps the list in sync with admin edits.
  const scoped = useMemo(
    () => (categorySlug ? products.filter((p) => p.categorySlug === categorySlug) : products),
    [categorySlug],
  )

  const paging = useCatalogPaging({ products: scoped })

  const resetAll = () => {
    setCategorySlug('')
    paging.reset()
  }

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <Breadcrumb items={[{ label: t('breadcrumb.home'), to: '/' }, { label: t('shop.title') }]} />
          <h1>{t('shop.title')}</h1>
          <p>{t('shop.subtitle')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <ShopToolbar
            query={paging.query}
            onQueryChange={paging.setQuery}
            sort={paging.sort}
            onSortChange={paging.setSort}
            total={paging.total}
            hasFilters={paging.hasFilters || categorySlug !== ''}
            onReset={resetAll}
            categories={categories}
            categorySlug={categorySlug}
            onCategoryChange={(slug) => {
              setCategorySlug(slug)
              paging.setPage(1)
            }}
          />

          {paging.items.length > 0 ? (
            <ProductGrid products={paging.items} />
          ) : (
            <p className="empty-state">{t('shop.noResults')}</p>
          )}

          <Pagination
            page={paging.page}
            totalPages={paging.totalPages}
            items={paging.pageItems}
            onChange={paging.setPage}
          />
        </div>
      </section>
    </>
  )
}

export default ShopPage
