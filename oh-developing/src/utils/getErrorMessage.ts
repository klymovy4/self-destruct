import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
): string | null => {
  if (!error) return null

  if ('status' in error) {
    if (typeof error.status === 'number') {
      const data = error.data as { message?: string } | undefined
      return data?.message ?? `HTTP ${error.status}`
    }
    return 'error' in error ? error.error : 'Request failed'
  }

  return error.message ?? 'Unknown error'
}
