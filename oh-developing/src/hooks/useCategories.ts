import { useState, useEffect } from 'react'
import type { Category } from '../types/product'

export const useCategories = (section: string) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setCategoriesError(null)
    const fetchCategory = () => {
      fetch(`https://dummyjson.com/${section}/categories`, {
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.ok) {
            const body = await res.json().catch(() => null)
            throw new Error(body?.message ?? `HTTP ${res.status}`)
          }

          return res.json()
        })
        .then((data) => setCategories(data))
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setCategoriesError(err.message)
          }
        })
    }
    fetchCategory()

    return () => controller.abort()
  }, [section])

  return { categories, categoriesError }
}
