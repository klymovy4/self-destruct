import { useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

import classes from './SearchRtk.module.scss'
import ProductCard from '../productCard/ProductCard'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { useGetCategoriesQuery, useSearchProductsInfiniteQuery } from '../../api/productsApi'
import { getErrorMessage } from '../../utils/getErrorMessage'

export const SearchRtk = ({ section }: { section: string }) => {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 300)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const { data: categories = [], error: categoriesErr } = useGetCategoriesQuery(section)
  const categoriesError = getErrorMessage(categoriesErr)
  const { data, isFetching, error, hasNextPage, fetchNextPage } = useSearchProductsInfiniteQuery(
    {
      section,
      query: debouncedValue,
      category: selectedCategory,
    },
    { skip: !debouncedValue && !selectedCategory },
  )
  const errorMessage = getErrorMessage(error)

  const products = data?.pages.flatMap((page) => page.products) ?? []
  const total = data?.pages[0]?.total ?? null

  const sentinelRef = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    enabled: hasNextPage && !isFetching,
  })

  const filteredProducts = products.filter(
    (product) => !selectedCategory || product.category === selectedCategory,
  )

  return (
    <div>
      <h1>Test API</h1>
      <div className={classes.searchBlock}>
        <input
          aria-label='search goods'
          placeholder='Search'
          type='search'
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />

        <span className={classes.loading}>{isFetching && `loading...`}</span>
        <select
          aria-label='Filter by category'
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value=''>Select all</option>
          {categories.map((category) => {
            return (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            )
          })}
        </select>
        {categoriesError && <span>Failed to load categories {categoriesError}</span>}
      </div>
      <div className={classes.searchWrapper}>
        {!!filteredProducts.length && (
          <ul className={classes.items}>
            {filteredProducts.map((product) => {
              return (
                <li key={product.id} className={classes.item}>
                  <ProductCard product={product} />
                </li>
              )
            })}
          </ul>
        )}
        {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}

        {!hasNextPage && total !== null && !isFetching && filteredProducts.length === 0 && (
          <p className={classes.noItems}>No items</p>
        )}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
      {total !== null && (
        <p>
          Show items: {filteredProducts.length} / {total}
        </p>
      )}
    </div>
  )
}
