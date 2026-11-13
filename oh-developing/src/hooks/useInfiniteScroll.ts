import { useEffect, useRef } from 'react'

type InfiniteScrollProps = {
  onLoadMore: () => void
  enabled: boolean
  rootMargin?: string
}

export const useInfiniteScroll = ({
  onLoadMore,
  enabled,
  rootMargin = '200px',
}: InfiniteScrollProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = ref.current
    if (!sentinel || !enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [onLoadMore, enabled, rootMargin])

  return ref
}
