import BigNumber from 'bignumber.js'
import Web3 from 'web3'

const MIN_TRADE_PRICE = 0.001

export const countValidTrades = (price, dec, nftAmt, decreaseMode) => {
  let numTrades = 0
  const numTradesDesired = nftAmt
  const startingPrice = new BigNumber(price)
  const decrease = new BigNumber(dec)
  const ratio = new BigNumber(1).minus(decrease.dividedBy(100))

  const isValid = (trades) => {
    return decreaseMode === 'linear'
      ? startingPrice.minus(decrease.times(trades - 1)).isGreaterThanOrEqualTo(MIN_TRADE_PRICE)
      : startingPrice.times(ratio.pow(trades - 1)).isGreaterThanOrEqualTo(MIN_TRADE_PRICE)
  }

  if (decrease.isEqualTo(0) || isValid(numTradesDesired)) return numTradesDesired

  // https://en.wikipedia.org/wiki/Binary_search_algorithm#Procedure
  let maxTrades = 0
  let lo = 0
  let hi = numTradesDesired
  numTrades = lo + Math.trunc((hi - lo) / 2) // used as binary search midpoint

  while (lo <= hi) {
    // console.log('testing value: ' + numTrades)
    if (isValid(numTrades)) {
      maxTrades = Math.max(maxTrades, numTrades)
      lo = numTrades + 1
    } else {
      hi = numTrades - 1
    }
    numTrades = lo + Math.trunc((hi - lo) / 2)
  }

  return maxTrades
}

export const calculatePurchases = (price, del, purchases, bondingCurve, poolType) => {
  if (!purchases || !price) return 0
  if (!+del) return new BigNumber(price).times(purchases)

  let totalCost = new BigNumber(0)
  let startPrice = new BigNumber(price)

  // https://en.wikipedia.org/wiki/Triangular_number#Formula
  const n = +purchases - 1
  const numDeltas = (n * (n + 1)) / 2

  const delta = new BigNumber(del)
  const ratio = new BigNumber(1).minus(delta.dividedBy(100))

  if (bondingCurve === 'linear') {
    if (startPrice.minus(delta.times(n)).isLessThan(MIN_TRADE_PRICE)) return 0
    if (poolType === 'BUY_AND_SELL') startPrice = startPrice.minus(delta) // discard first trade
    totalCost = startPrice.times(+purchases).minus(delta.times(numDeltas))
  } else {
    if (startPrice.times(ratio.pow(n)).isLessThan(MIN_TRADE_PRICE)) return 0
    if (poolType === 'BUY_AND_SELL') startPrice = startPrice.times(ratio) // discard first trade
    // https://en.wikipedia.org/wiki/Geometric_series#Finite_series
    let dividend = new BigNumber(1).minus(ratio.pow(+purchases))
    let divisor = new BigNumber(1).minus(ratio)
    totalCost = startPrice.times(dividend.dividedBy(divisor))
  }

  return totalCost.toFixed(3)
}

export const calculateSales = (price, del, sales, bondingCurve) => {
  if (!sales || !price) return 0
  if (!+del) return new BigNumber(price).times(sales)

  // https://en.wikipedia.org/wiki/Triangular_number#Formula
  let n = +sales - 1
  let numDeltas = (n * (n + 1)) / 2
  let totalSales = new BigNumber(0)
  const delta = new BigNumber(del)
  const startPrice = new BigNumber(price)
  const ratio = new BigNumber(1).plus(delta.dividedBy(100))

  if (bondingCurve === 'linear') {
    totalSales = startPrice.times(+sales).plus(delta.times(numDeltas))
  } else {
    // https://en.wikipedia.org/wiki/Geometric_series#Finite_series
    let dividend = new BigNumber(1).minus(ratio.pow(+sales))
    let divisor = new BigNumber(1).minus(ratio)
    totalSales = startPrice.times(dividend.dividedBy(divisor))
  }

  return totalSales.toFixed(3)
}

export const calculateNthTrade = (price, decrease, currentTrade, decreaseMode) => {
  const n = currentTrade - 1
  const startPrice = new BigNumber(price)
  const decreaseFactor = new BigNumber(decrease)
  const ratio = new BigNumber(1).minus(decreaseFactor.dividedBy(100))

  if (decreaseMode === 'linear') {
    return startPrice.minus(decreaseFactor.times(n))
  } else {
    return startPrice.times(ratio.pow(n))
  }
}

export const getMaxBought = (balanceNBT, offerNBT, delta, bondingCurveType) => {
  balanceNBT = Web3.utils.fromWei(balanceNBT)
  offerNBT = Web3.utils.fromWei(offerNBT)

  let maxBought

  if (bondingCurveType === 'EXPONENTIAL') {
    delta = (+Web3.utils.fromWei(delta, 'ether') - 1) * 100
    maxBought = balanceNBT / (Math.pow(1 + delta / 100, 0.5) * offerNBT)
  }
  if (bondingCurveType === 'LINEAR') {
    delta = Web3.utils.fromWei(delta, 'ether')
    maxBought = balanceNBT / (offerNBT - offerNBT * delta)
  }
  return ~~maxBought
}

export const getHighestOffersInOrder = (pools) => {
  let list = []

  for (const pool of pools) {
    const amountToBuy = getMaxBought(pool.balanceNBT, pool.offerNBT, pool.delta, pool.bondingCurveType)
    const spotPrices = getSpotPricesBuy(pool.offerNBT, pool.delta, amountToBuy, pool.bondingCurveType.toLowerCase())
    //make sure not to attempt to push empty spot prices
    if (spotPrices.length > 0) {
      for (let k = 0; k < amountToBuy; k++) {
        list.push({ poolAddress: pool.poolAddress, spotPrice: spotPrices[k] })
      }
    }
  }

  const sortedList = list.sort((a, b) => (a.spotPrice < b.spotPrice ? 1 : -1))

  return sortedList
}

export const getSpotPricesBuy = (price, del, amountToBuy, bondingCurve, max = 0) => {
  if (!amountToBuy || !price) return []

  if (bondingCurve === 'xyk') {
    // if max is truthy -> this is a trading pool
    if (max) return getXykBuyPointsTrade(price, amountToBuy, max)
    else return getXykBuyPoints(price, amountToBuy)
  }

  let points = []
  let currentPurchase = new BigNumber(price)
  const startPrice = new BigNumber(price)
  const delta = new BigNumber(del)
  const ratio = max ? new BigNumber(delta.dividedBy(100)).plus(1) : new BigNumber(1).minus(delta.dividedBy(100))

  if (bondingCurve === 'linear') {
    for (let i = 0; i < amountToBuy; i++) {
      if (max) currentPurchase = startPrice.minus(delta.times(i + 1))
      else currentPurchase = startPrice.minus(delta.times(i))
      points.push(currentPurchase.toString())
    }
  } else {
    for (let i = 0; i < amountToBuy; i++) {
      if (max) {
        currentPurchase = currentPurchase.div(ratio)
      } else {
        if (i === 0) currentPurchase = startPrice
        else currentPurchase = currentPurchase.times(ratio)
      }
      points.push(currentPurchase.toString())
    }
  }

  return points
}

// This process isn't the same as the one described in the docs
// but this is the way to generate the same values as sudoswap
// https://docs.sudoswap.xyz/reference/pricing/
export const getXykBuyPoints = (startPrice, amountToBuy) => {
  let nftBalance = amountToBuy + 2
  let tokenBalance = nftBalance * startPrice
  let points = []

  for (let i = 0; i < amountToBuy; i++) {
    let spotPrice = tokenBalance / nftBalance
    // console.log('Buy SpotPrice[' + i + ']: ' + spotPrice)
    tokenBalance -= spotPrice
    nftBalance++
    points.push(spotPrice)
  }

  // console.log(points)
  return points
}

// Another strange process by sudoswap
export const getXykBuyPointsTrade = (startPrice, amountToBuy, max) => {
  let nftBalance = max + 1
  let tokenBalance = nftBalance * startPrice
  let points = []

  for (let i = 0; i < amountToBuy + 1; i++) {
    let spotPrice = tokenBalance / nftBalance
    console.log('Buy SpotPrice[' + i + ']: ' + spotPrice)
    tokenBalance -= spotPrice
    nftBalance++
    points.push(spotPrice)
  }

  console.log(points)
  return points.slice(1)
}

export const getSpotPricesSell = (price, increase, amountToSell, bondingCurve, max = 0) => {
  if (!amountToSell || !price) return []

  if (bondingCurve === 'xyk') return getXykSellPoints(price, amountToSell, max)

  let points = []
  let currentSale = new BigNumber(0)
  const startPrice = new BigNumber(price)
  const increaseFactor = new BigNumber(increase)
  const ratio = new BigNumber(increaseFactor.dividedBy(100))

  if (bondingCurve === 'linear') {
    for (let i = 0; i < amountToSell; i++) {
      if (i === 0) currentSale = startPrice
      else currentSale = startPrice.plus(increaseFactor.times(i))
      // console.log('currentSale: ' + currentSale.toString())
      points.push(currentSale.toString())
    }
  } else {
    for (let i = 0; i < amountToSell; i++) {
      if (i === 0) currentSale = startPrice
      else currentSale = currentSale.plus(ratio.times(currentSale))
      // console.log('currentSale: ' + currentSale.toString())
      points.push(currentSale.toString())
    }
  }

  return points
}

export const getXykSellPoints = (startPrice, amountToSell, max) => {
  let tokenBalance = max ? startPrice * max : startPrice * amountToSell
  let nftBalance = max ? max + 1 : amountToSell + 1
  let points = []

  for (let i = 0; i < amountToSell; i++) {
    let spotPrice = tokenBalance / (nftBalance - 1)
    console.log('Sell SpotPrice[' + i + ']: ' + spotPrice)
    tokenBalance += spotPrice
    nftBalance--
    points.push(spotPrice)
  }

  console.log(points)
  return points
}
