import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

import classes from './Search.module.scss'
import ProductCard from '../productCard/ProductCard'
import { useCategories } from '../../hooks/useCategories'
import { useProductSearch } from '../../hooks/useProductSearch'

export const Search = ({ section }: { section: string }) => {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 300)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const sentinelRef = useRef<HTMLDivElement>(null)

  const { categories, categoriesError } = useCategories(section)
  const { products, total, isLoading, error, hasMore, loadMore } = useProductSearch({
    section,
    query: debouncedValue,
    category: selectedCategory,
  })

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoading, loadMore])

  const filteredProducts = products.filter(
    (product) => !selectedCategory || product.category === selectedCategory,
  )

  return (
    <div>
      <div className={classes.searchBlock}>
        <input
          aria-label='search goods'
          placeholder='Search'
          type='search'
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />

        <span className={classes.loading}>{isLoading && `loading...`}</span>
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
        {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}

        {!hasMore && total !== null && !isLoading && filteredProducts.length === 0 && (
          <p className={classes.noItems}>No items</p>
        )}
        {error && <p>{error}</p>}
      </div>
      {total !== null && (
        <p>
          Show items: {filteredProducts.length} / {total}
        </p>
      )}
    </div>
  )
}
