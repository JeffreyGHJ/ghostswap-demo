import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  bnbBalance: null,
  littleGhostsOwned: [],
}

export const walletAssets = createSlice({
  name: 'walletAssets',
  initialState,
  reducers: {
    clearWalletAssets: (state, action) => {
      state.bnbBalance = null
      state.littleGhostsOwned = []
    },
    setBnbBalance: (state, action) => {
      state.bnbBalance = action.payload
    },
    setLittleGhostsOwned: (state, action) => {
      state.littleGhostsOwned = action.payload
    },
  },
})

export const { clearWalletAssets, setBnbBalance, setLittleGhostsOwned } = walletAssets.actions

export default walletAssets.reducer
