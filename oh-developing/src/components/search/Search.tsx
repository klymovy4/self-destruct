import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

import classes from './Search.module.scss'
import ProductCard from '../productCard/ProductCard'
import type { Product, ProductsResponse } from '../../types/product'
import { useCategories } from '../../hooks/useCategories'

const LIMIT = 20

export const Search = ({ section }: { section: string }) => {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 300)
  const [isLoading, setIsLoading] = useState(false)
  const [errorState, setErrorState] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [skip, setSkip] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [prevBaseUrl, setPrevBaseUrl] = useState<string | null>(null)

  const sentinelRef = useRef<HTMLDivElement>(null)

  const { categories, categoriesError } = useCategories(section)

  const baseUrl = debouncedValue
    ? `https://dummyjson.com/${section}/search?q=${encodeURIComponent(debouncedValue)}`
    : selectedCategory
      ? `https://dummyjson.com/${section}/category/${encodeURIComponent(selectedCategory)}`
      : null

  if (baseUrl !== prevBaseUrl) {
    setPrevBaseUrl(baseUrl)
    setSkip(0)
  }

  const url = baseUrl
    ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}limit=${LIMIT}&skip=${skip}`
    : null

  const hasMore = total !== null && products.length < total

  useEffect(() => {
    if (!url) {
      setProducts([])
      setTotal(null)
      setIsLoading(false)
      setErrorState(null)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)
    setErrorState(null)

    fetch(url, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.message ?? `HTTP ${res.status}`)
        }
        return res.json()
      })
      .then((data: ProductsResponse) => {
        setProducts((prev) => (data.skip === 0 ? data.products : [...prev, ...data.products]))
        setTotal(data.total)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setErrorState(`Error: ${err.message}`)
          setTotal(null)
          setProducts([])
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [url])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSkip((prev) => prev + LIMIT)
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoading])

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
        {errorState && <p>{errorState}</p>}
      </div>
      {total !== null && (
        <p>
          Show items: {filteredProducts.length} / {total}
        </p>
      )}
    </div>
  )
}
