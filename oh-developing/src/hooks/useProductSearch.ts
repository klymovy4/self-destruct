import { useCallback, useEffect, useState } from 'react'
import type { Product, ProductsResponse } from '../types/product'

const LIMIT = 20

type UseProductSearchParams = {
  section: string
  query: string
  category: string
}

export const useProductSearch = ({ section, query, category }: UseProductSearchParams) => {
  const [prevBaseUrl, setPrevBaseUrl] = useState<string | null>(null)
  const [skip, setSkip] = useState(0)
  const [total, setTotal] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)

  const baseUrl = query
    ? `https://dummyjson.com/${section}/search?q=${encodeURIComponent(query)}`
    : category
      ? `https://dummyjson.com/${section}/category/${encodeURIComponent(category)}`
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
      setError(null)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
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
          setError(`Error: ${err.message}`)
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

  const loadMore = useCallback(() => setSkip((prev) => prev + LIMIT), [])

  return { products, total, isLoading, error, hasMore, loadMore }
}
