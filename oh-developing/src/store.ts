import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./api/productsApi";

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer
  },
  middleware: (getDefault) => getDefault().concat(productsApi.middleware)
})