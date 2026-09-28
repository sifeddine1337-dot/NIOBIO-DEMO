import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getCategory, productsInCategory } from '../data/catalog'
import { useCatalog } from '../hooks/useCatalog'
import { useCatalogPaging } from '../hooks/useCatalogPaging'
import { useLanguage } from '../hooks/useLanguage'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { Pagination } from '../components/shop/Pagination'
import { ProductGrid } from '../components/shop/ProductGrid'
import { ShopToolbar } from '../components/shop/ShopToolbar'
import { NotFoundPage } from './NotFoundPage'
import './Pages.css'

/** A single product category listing, e.g. `/product-category/geologie`. */
export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useLanguage()
  useCatalog()
  const category = getCategory(slug)

  // `productsInCategory` builds a new array, so memoise it to keep the paging
  // hook's derived state stable; `version` refreshes it after admin edits.
  const scoped = useMemo(
    () => (category ? productsInCategory(category.slug) : []),
    [category],
  )
  const paging = useCatalogPaging({ products: scoped })

  if (!category) return <NotFoundPage />

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <Breadcrumb
            items={[
              { label: t('breadcrumb.home'), to: '/' },
              { label: t('shop.title'), to: '/boutique' },
              { label: category.nameAr },
            ]}
          />
          <h1 dir="ltr">{category.nameFr}</h1>
          <p>{category.nameAr}</p>
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
            hasFilters={paging.hasFilters}
            onReset={paging.reset}
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

export default CategoryPage
