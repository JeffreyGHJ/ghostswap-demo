import application from './application/reducer'
import burn from './burn/reducer'
import { combineReducers } from '@reduxjs/toolkit'
import create from './create/reducer'
import lists from './lists/reducer'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import user from './user/reducer'
import cart from './cart'
import nftMarket from './nftMarket'
import stakePools from './stakePools'
import walletAssets from './walletAssets'
import web3Connections from './web3Connections'

const reducer = combineReducers({
  application,
  user,
  mint,
  burn,
  multicall,
  lists,
  create,
  cart,
  nftMarket,
  stakePools,
  walletAssets,
  web3Connections,
})

export default reducer
