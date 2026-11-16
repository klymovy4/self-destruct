import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Category, ProductsResponse } from '../types/product'

type SearchArgs = {
  section: string
  query: string
  category: string
}

const LIMIT = 20

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  endpoints: (build) => ({
    searchProducts: build.infiniteQuery<ProductsResponse, SearchArgs, number>({
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
          const loaded = allPages.reduce((sum, page) => sum + page.products.length, 0)
          return loaded < lastPage.total ? loaded : undefined
        },
      },

      query: ({ queryArg, pageParam }) => {
        const { section, query, category } = queryArg
        return query
          ? { url: `${section}/search`, params: { q: query, limit: LIMIT, skip: pageParam } }
          : {
              url: `${section}/category/${category}`,
              params: { limit: LIMIT, skip: pageParam },
            }
      },
    }),
    getCategories: build.query<Category[], string>({
      query: (section) => `${section}/categories`,
    }),
  }),
})

export const { useSearchProductsInfiniteQuery, useGetCategoriesQuery } = productsApi
