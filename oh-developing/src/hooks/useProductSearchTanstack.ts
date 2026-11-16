import { useInfiniteQuery } from '@tanstack/react-query'
import type { ProductsResponse } from '../types/product'

const LIMIT = 20

type Params = {
  section: string
  query: string
  category: string
}

export const useProductSearchTanstack = ({ section, query, category }: Params) => {
  const result = useInfiniteQuery({
    queryKey: ['products', section, query, category],
    queryFn: async ({ pageParam, signal }): Promise<ProductsResponse> => {
      const baseUrl = query
        ? `https://dummyjson.com/${section}/search?q=${encodeURIComponent(query)}`
        : `https://dummyjson.com/${section}/category/${encodeURIComponent(category)}`

      const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}limit=${LIMIT}&skip=${pageParam}`

      const res = await fetch(url, { signal })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message ?? `HTTP ${res.status}`)
      }
      return res.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.products.length, 0)
      return loaded < lastPage.total ? loaded : undefined
    },
    enabled: Boolean(query || category),
  })

  const products = result.data?.pages.flatMap((page) => page.products) ?? []
  const total = result.data?.pages[0]?.total ?? null

  return {
    products,
    total,
    isLoading: result.isFetching,
    error: result.error?.message ?? null,
    hasMore: result.hasNextPage,
    loadMore: result.fetchNextPage,
  }
}
