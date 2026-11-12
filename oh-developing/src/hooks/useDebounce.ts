import { useEffect, useState } from 'react'

export const useDebounce = <T>(search: T, delay: number): T => {
  const [value, setValue] = useState<T>(search)

  useEffect(() => {
    const timeoutId = setTimeout(() => setValue(search), delay)
    return () => clearTimeout(timeoutId)
  }, [search, delay])

  return value
}
