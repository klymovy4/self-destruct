import { configureStore } from '@reduxjs/toolkit'
import { productsApi } from './api/productsApi'
import ratingsReducer from './feature/rating/RatingSlice'

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    ratings: ratingsReducer,
  },
  middleware: (getDefault) => getDefault().concat(productsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
