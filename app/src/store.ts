import {configureStore} from '@reduxjs/toolkit'
import {quotesSlice} from './features/quotes/quotesSlice.ts'
import {selectedQuoteSlice} from './features/quotes/selectedQuoteSlice.ts'
import {valueSlice} from "./features/price/priceSlice.ts";

export const store = configureStore({
  reducer: {
    quotes: quotesSlice.reducer,
    selectedQuote: selectedQuoteSlice.reducer,
    value: valueSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store