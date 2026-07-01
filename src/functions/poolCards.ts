import Web3 from 'web3'

export const sortPools = (a: any, b: any) => {
  if (a.poolType === 'BUY' && b.poolType === 'BUY') return +a.floorNBT - +b.floorNBT
  if (a.poolType === 'BUY' && b.poolType === 'SELL') return +a.floorNBT - +b.offerNBT
  if (a.poolType === 'BUY' && b.poolType === 'BUY_AND_SELL') return +a.floorNBT - +b.floorNBT

  if (a.poolType === 'SELL' && b.poolType === 'SELL') return +a.offerNBT - +b.offerNBT
  if (a.poolType === 'SELL' && b.poolType === 'BUY') return +a.offerNBT - +b.floorNBT
  if (a.poolType === 'SELL' && b.poolType === 'BUY_AND_SELL') return +a.offerNBT - +b.floorNBT

  if (a.poolType === 'BUY_AND_SELL' && b.poolType === 'BUY_AND_SELL') return +a.floorNBT - +b.floorNBT
  if (a.poolType === 'BUY_AND_SELL' && b.poolType === 'BUY') return +a.floorNBT - +b.floorNBT
  if (a.poolType === 'BUY_AND_SELL' && b.poolType === 'SELL') return +a.floorNBT - +b.offerNBT

  return +a.sellPrice - +b.sellPrice
}

export const filterPools = (pool, filters, minPrice, maxPrice, hideEmpty) => {
  if (!filters.length && !minPrice && !maxPrice && !hideEmpty) return true

  if (hideEmpty) {
    if (pool.poolType == 'BUY' && pool.nftBalance === 0) return false
    if (pool.poolType === 'SELL' && (+pool.balanceNBT === 0 || +pool.balanceNBT < +pool.offerNBT)) return false
    if (pool.poolType === 'BUY_AND_SELL') {
      if (+pool.nftBalance === 0 && (+pool.balanceNBT === 0 || +pool.balanceNBT < +pool.offerNBT)) return false
    }
  }

  if (minPrice) {
    if (pool.poolType.includes('BUY')) {
      if (Web3.utils.fromWei(pool.floorNBT) < minPrice) return false
    } else {
      if (Web3.utils.fromWei(pool.offerNBT) < minPrice) return false
    }
  }

  if (maxPrice) {
    if (pool.poolType.includes('BUY')) {
      if (Web3.utils.fromWei(pool.floorNBT) > maxPrice) return false
    } else {
      if (Web3.utils.fromWei(pool.offerNBT) > maxPrice) return false
    }
  }

  if (filters.includes('LINEAR') || filters.includes('EXPONENTIAL') || filters.includes('XYK')) {
    if (pool.bondingCurveType === 'EXPONENTIAL' && !filters.includes('EXPONENTIAL')) return false
    if (pool.bondingCurveType === 'LINEAR' && !filters.includes('LINEAR')) return false
    if (pool.bondingCurveType === 'XYK' && !filters.includes('XYK')) return false
  }
  if (filters.includes('token') || filters.includes('nft') || filters.includes('BUY_AND_SELL')) {
    if (pool.poolType === 'SELL' && !filters.includes('token')) return false
    if (pool.poolType === 'BUY' && !filters.includes('nft')) return false
    if (pool.poolType === 'BUY_AND_SELL' && !filters.includes('BUY_AND_SELL')) return false
  }
  return true
}

export const countEmptyPools = (pools) => {
  let count = 0
  for (let pool of pools) {
    if (pool.poolType == 'BUY' && pool.nftBalance === 0) count++
    else if (pool.poolType === 'SELL' && (+pool.balanceNBT === 0 || +pool.balanceNBT < +pool.offerNBT)) count++
    else if (pool.poolType === 'BUY_AND_SELL') {
      if (+pool.nftBalance === 0 && (+pool.balanceNBT === 0 || +pool.balanceNBT < +pool.offerNBT)) count++
    }
  }
  return count
}
