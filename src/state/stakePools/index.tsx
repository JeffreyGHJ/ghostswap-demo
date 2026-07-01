import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  pools: [],
}

export const stakePools = createSlice({
  name: 'stakePools',
  initialState,
  reducers: {
    setStakePools: (state, action) => {
      state.pools = action.payload
    },
  },
})

export const { setStakePools } = stakePools.actions

export default stakePools.reducer
