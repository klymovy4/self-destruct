const KEY = 'ratings'

export const loadRatings = () => {
  try {
    const saved = localStorage.getItem(KEY)
    console.log(saved)

    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

export const saveRatings = (ratings: Record<number, number>) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(ratings))
  } catch {}
}
