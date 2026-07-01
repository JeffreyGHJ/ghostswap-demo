import BigNumber from 'bignumber.js'

const MIN_TRADE_PRICE = 0.001

export const countValidTrades = (price, dec, nftAmt, decreaseMode) => {
  let numTrades = 0
  const numTradesDesired = nftAmt
  const startingPrice = new BigNumber(price)
  const decrease = new BigNumber(dec)
  const ratio = new BigNumber(1).minus(decrease.dividedBy(100))

  const isValid = (trades) => {
    return decreaseMode === 'bnb'
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

  /* uncomment to print all trade prices to console (greatly reduces performance) */
  // numTrades = 0
  //
  // if (decreaseMode === 'bnb') {
  //   while (numTrades < numTradesDesired) {
  //     if (startingPrice.minus(decrease.times(numTrades)).isGreaterThanOrEqualTo(MIN_TRADE_PRICE)) {
  //       console.log('trade: ' + (numTrades + 1) + ' - price: ' + startingPrice.minus(decrease.times(numTrades)))
  //       numTrades++
  //     } else {
  //       break
  //     }
  //   }
  // } else {
  //   while (numTrades < numTradesDesired) {
  //     if (startingPrice.times(ratio.pow(numTrades)).isGreaterThanOrEqualTo(MIN_TRADE_PRICE)) {
  //       console.log('trade: ' + (numTrades + 1) + ' - price: ' + startingPrice.times(ratio.pow(numTrades)))
  //       numTrades++
  //     } else {
  //       break
  //     }
  //   }
  // }

  return maxTrades
}

export const calculateTotalCost = (price, decrease, numTradesDesired, decreaseMode) => {
  if (!numTradesDesired || !price) return 0
  if (!decrease) return new BigNumber(price).times(numTradesDesired)

  let n = numTradesDesired - 1
  // https://en.wikipedia.org/wiki/Triangular_number#Formula
  let numDecreases = (n * (n + 1)) / 2
  let totalCost = new BigNumber(0)
  const startPrice = new BigNumber(price)
  const decreaseFactor = new BigNumber(decrease)
  const ratio = new BigNumber(1).minus(decreaseFactor.dividedBy(100))

  if (decreaseMode === 'bnb') {
    if (startPrice.minus(decreaseFactor.times(n)).isLessThan(MIN_TRADE_PRICE)) return -1
  } else {
    if (startPrice.times(ratio.pow(n)).isLessThan(MIN_TRADE_PRICE)) return -1
  }

  if (decreaseMode === 'bnb') {
    totalCost = startPrice.times(numTradesDesired).minus(decreaseFactor.times(numDecreases))
  } else {
    // https://en.wikipedia.org/wiki/Geometric_series#Finite_series
    let dividend = new BigNumber(1).minus(ratio.pow(numTradesDesired))
    let divisor = new BigNumber(1).minus(ratio)
    totalCost = startPrice.times(dividend.dividedBy(divisor))
  }

  return totalCost.toFixed(3)
}
