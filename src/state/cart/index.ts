import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cartIsOpen: false,
  cartItems: [],
  itemsToSell: [],
}

export const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload
    },
    setItemsToSell: (state, action) => {
      state.itemsToSell = action.payload
    },
    setCartIsOpen: (state, action) => {
      state.cartIsOpen = action.payload
    },
    toggleCartIsOpen: (state) => {
      state.cartIsOpen = !state.cartIsOpen
    },
    toggleCartItem: (state, action) => {
      for (let item of state.cartItems) {
        if (item.id === action.payload.id && item.collectionAddress === action.payload.collectionAddress) {
          state.cartItems.splice(state.cartItems.indexOf(item), 1)
          return
        }
      }
      state.cartItems.push(action.payload)
    },
    toggleItemToSell: (state, action) => {
      for (let item of state.itemsToSell) {
        if (item.id == action.payload.id) {
          state.itemsToSell.splice(state.itemsToSell.indexOf(item), 1)
          return
        }
      }
      state.itemsToSell.push(action.payload)
    },
    replaceCartItem: (state, action) => {
      for (let item of state.cartItems) {
        if (item.id === action.payload.id) {
          state.cartItems[state.cartItems.indexOf(item)] = action.payload
        }
      }
    },
    clearCartItems: (state) => {
      state.cartItems = []
    },
    clearItemsToSell: (state) => {
      state.itemsToSell = []
    },
  },
})

export const {
  setCartItems,
  setItemsToSell,
  setCartIsOpen,
  toggleCartIsOpen,
  toggleCartItem,
  toggleItemToSell,
  replaceCartItem,
  clearCartItems,
  clearItemsToSell,
} = cart.actions

export default cart.reducer
