import {createSlice} from '@reduxjs/toolkit'
import type {QuoteOption} from "../../types/QuoteOption.ts";
import type {RootState} from "../../store.ts";

const initialState: QuoteOption[] = [
  {
    id: 1,
    downPayment: 3000,
    term: 60,
    interestRate: 5.8,
  },
  {
    id: 2,
    downPayment: 10000,
    term: 60,
    interestRate: 5.4,
  },
  {
    id: 3,
    downPayment: 8000,
    term: 40,
    interestRate: 5.5,
  },
]

export const quotesSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    add: (state, action) => {
      state.push(action.payload)
    },
    remove: (state, action) => {
      return state.filter(option => option.id !== action.payload)
    }
  }
})

export const {add, remove} = quotesSlice.actions

export const selectQuotes = (state: RootState) => state.quotes

export default quotesSlice.reducer