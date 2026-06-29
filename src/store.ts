import {configureStore} from '@reduxjs/toolkit'
import quotesReducer from './features/quotes/quotesSlice.ts'
import selectedQuoteReducer from './features/quotes/selectedQuoteSlice.ts'
import valueReducer from "./features/price/priceSlice.ts";

export const store = configureStore({
  reducer: {
    quotes: quotesReducer,
    selectedQuote: selectedQuoteReducer,
    value: valueReducer
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store