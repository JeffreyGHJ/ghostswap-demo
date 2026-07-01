import BigNumber from 'bignumber.js'
import Web3 from 'web3'

export const calculateNthTrade = (price, del, count, bondingCurve) => {
  const n = count
  const startPrice = new BigNumber(price)
  const delta = new BigNumber(Web3.utils.fromWei(del))

  if (bondingCurve === 'LINEAR') {
    return startPrice.plus(delta.times(n)).toFixed(7)
  } else {
    return startPrice.times(delta.pow(n))
  }
}

export function buildOptimalSweepSequence(nfts, addressesToExclude, poolsWithItemsInCart, collectionIdsInCart) {
  let optimalSequence = []
  let listings = [...nfts]
  let pools = new Map(poolsWithItemsInCart)
  //   console.log(pools)
  //   console.log(collectionIdsInCart)
  listings = listings.filter(
    (listing) =>
      !collectionIdsInCart?.includes(listing.id) && !addressesToExclude.has(listing.poolAddress.toLowerCase())
  )
  while (listings.length) {
    // take greedy result - nfts coming in are already sorted by ascending price
    let optimalChoice = listings.shift()
    // console.log(optimalChoice)
    let poolAddress = optimalChoice.poolAddress
    optimalSequence.push(optimalChoice)

    // update pool map and store updated value to use in next step
    pools.set(poolAddress, +pools.get(poolAddress) + 1 || 1)

    // update listings in-place that have that pool using count to quickly re-price
    let count = pools.get(poolAddress)
    // console.log('repricing items in pool: ' + poolAddress + ' -- with ' + count + ' items in cart')
    listings = listings.map((li) => {
      let listing = { ...li }
      if (listing.poolAddress === poolAddress) {
        // console.log(listing)
        // console.log(listing.price)
        // console.log(listing.id, count)
        listing.price = calculateNthTrade(listing.poolStartPrice, listing.delta, count, listing.bondingCurve)
        // console.log(listing.id + ': ' + (+listing.price).toFixed(7))
      }
      return listing
    })

    // console.log(listings)

    // sort listings array
    listings.sort((a, b) => a.price - b.price)
  }

  // console.log(optimalSequence)
  return optimalSequence
}
