import { configureStore } from '@reduxjs/toolkit'
import { productsApi } from './api/productsApi'
import ratingsReducer from './feature/rating/RatingSlice'
import { saveRatings } from './feature/rating/RatingStorage'

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    ratings: ratingsReducer,
  },
  middleware: (getDefault) => getDefault().concat(productsApi.middleware),
})

store.subscribe(() => {
  saveRatings(store.getState().ratings)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
