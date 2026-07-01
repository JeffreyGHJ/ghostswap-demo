import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { getSpotPricesSell } from '../../PoolBuilder/functions'

function setPricesForItemsInSamePool(poolItems) {
  const bondingCurve = poolItems[0].bondingCurve
  let delta = new BigNumber(+poolItems[0].delta)
  let price = new BigNumber(+poolItems[0].price)
  let updatedItems = []

  if (bondingCurve !== 'XYK' && delta.isEqualTo(0)) return poolItems
  if (bondingCurve === 'XYK') {
    let item = poolItems[0]
    let newPrices
    if (item.poolType === 'BUY_AND_SELL') {
      newPrices = getSpotPricesSell(item.price, 0, poolItems.length, 'xyk', Math.max(item.nftBalance, item.balanceNBT))
    } else {
      newPrices = getSpotPricesSell(item.price, 0, poolItems.length, 'xyk')
    }
    for (let i of poolItems) {
      let item = { ...i }
      item.price = newPrices.shift().toFixed(5)
      updatedItems.push(item)
    }
  }
  if (bondingCurve === 'LINEAR') {
    for (let i of poolItems) {
      let item = { ...i }
      item.price = price.toFixed(5)
      price = price.plus(delta)
      updatedItems.push(item)
    }
  }
  if (bondingCurve === 'EXPONENTIAL') {
    delta = new BigNumber(Web3.utils.fromWei(poolItems[0].delta))
    for (let i of poolItems) {
      let item = { ...i }
      item.price = price.toFixed(5)
      price = price.times(delta)
      updatedItems.push(item)
    }
  }
  console.log('updated pool items: ', updatedItems)
  return updatedItems
}

export function processCartItems(cartItems) {
  let itemsToProcess = [...cartItems]
  let processedItems = []

  while (itemsToProcess.length) {
    let poolItems = []
    let currentItem = itemsToProcess.shift()
    poolItems = itemsToProcess.filter(
      (item) => item.poolAddress.toLowerCase() === currentItem.poolAddress.toLowerCase()
    )
    for (let item of poolItems) {
      itemsToProcess.splice(itemsToProcess.indexOf(item), 1)
    }
    poolItems.push(currentItem)
    console.log('items in the same pool:', poolItems)
    let updatedItems = setPricesForItemsInSamePool(poolItems)
    processedItems = processedItems.concat(updatedItems)
  }

  return processedItems
}
