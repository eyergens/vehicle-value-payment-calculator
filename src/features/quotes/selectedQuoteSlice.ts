import {createSelector, createSlice} from '@reduxjs/toolkit'
import type {RootState} from "../../store.ts";
import {selectQuotes} from "./quotesSlice.ts";

const initialState = 1

export const selectedQuoteSlice = createSlice({
  name: 'selectedQuote',
  initialState,
  reducers: {
    select: (_state, action) => action.payload
  }
})

export const {select} = selectedQuoteSlice.actions

export const selectSelectedQuoteId = (state: RootState) =>
  state.selectedQuote

export const selectSelectedQuote = createSelector(
  [selectQuotes, selectSelectedQuoteId],
  (quotes, selectedId) => quotes.find(q => q.id === selectedId)
)

export default selectedQuoteSlice.reducer