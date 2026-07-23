import {createSlice} from '@reduxjs/toolkit'
import type {RootState} from "../../store.ts";
import dayjs from "dayjs";

const initialState = {
  make: '',
  model: '',
  year: dayjs().year(),
  price: 0
}

export const valueSlice = createSlice({
  name: 'value',
  initialState,
  reducers: {
    favorite: (_state, action) => action.payload,
    unfavorite: () => initialState
  }
})

export const {favorite, unfavorite} = valueSlice.actions

export const selectValue = (state: RootState) => state.value

export default valueSlice.reducer