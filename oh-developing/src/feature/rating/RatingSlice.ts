import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type RatingState = Record<number, number>
const initialState: RatingState = {}

const ratingsSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    rated: (state, action: PayloadAction<{ productId: number; rating: number }>) => {
      const { productId, rating } = action.payload
      state[productId] = rating
    },
  },
})

export const { rated } = ratingsSlice.actions
export default ratingsSlice.reducer
