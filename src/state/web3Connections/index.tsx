import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  connectionsVisible: false,
}

export const web3Connections = createSlice({
  name: 'web3Connections',
  initialState,
  reducers: {
    showConnections: (state) => {
      state.connectionsVisible = true
    },
    hideConnections: (state) => {
      state.connectionsVisible = false
    },
  },
})

export const { showConnections, hideConnections } = web3Connections.actions

export default web3Connections.reducer
