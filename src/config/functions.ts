import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import littleGhostRanks from '../constants/little-ghosts-ranks/little-ghosts-ranks.json'
import ectoSkeletonsMeta from '../constants/ecto-skeletons-ranks-and-buffs/ecto-skeletons-ranks-and-buffs.json'

const littleGhostsCollectionAddress = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48'
const ectoSkeletonsCollectionAddress = '0x0fa48f20dddcf6ed724a36381f66c3e905fe7988'

const buffs = ['+8 Every Bonus', '+6 Every Bonus', '+5 Every Bonus', '+4 Every Bonus']

export function getGhostBuffs(rank) {
  if (rank <= 100) {
    return buffs[0]
  } else if (rank <= 1000) {
    return buffs[1]
  } else if (rank <= 3000) {
    return buffs[2]
  }
  return buffs[3]
}

const isIterable = (value) => {
  return Symbol.iterator in Object(value)
}

// In this function we pull metadatas from moralis.io and add to nftData
// Optionally we can use the metadata given by defined api response
export const processNftMetadatas = (address, purchasableNftMap, fetchNftMetadata, setTraitsMap, setPurchasableNfts) => {
  let canIterate = true
  let traitsMap = new Map()
  let metadatas = []
  let purchasableNftsUpdate = new Map()

  // fetch nft data and wait for promises to resolve
  console.log('fetching metadatas')
  for (let nftData of purchasableNftMap.values()) {
    metadatas.push(fetchNftMetadata(address, nftData.id))
  }
  console.log('fetching done... awaiting promises to resolve')

  // once we have resolved metadata, map it and attach to nftDatas
  Promise.all(metadatas).then((results) => {
    console.log('promises resolved')
    // console.log(results)
    for (let item of results) {
      if (item.metadata === null) {
        setTraitsMap(traitsMap)
        setPurchasableNfts(Array.from(purchasableNftMap.values()))
        return
      }

      let metadata = item.metadata

      let nftData = purchasableNftMap.get(item.nftId)

      // ------------ MERGE METADATA---------------------------------------
      nftData.metadata = [nftData.metadata, ...metadata]
      // nftData.metadata = metadata
      // console.log(nftData)
      purchasableNftsUpdate.set(item.nftId, nftData)
      // console.log(purchasableNftsUpdate)

      // ------------ BUILD TRAIT FILTERS FROM METADATA ---------------------

      // CUSTOM BUFFS
      // if littleghosts address add ghost buff to traits map
      if (address.toLowerCase() === littleGhostsCollectionAddress) {
        // get buffs for this ghost
        let buffs = getGhostBuffs(littleGhostRanks[item.nftId].rank)

        nftData.metadata = [...nftData.metadata, { value: buffs, trait_type: 'Buffs' }]

        // if there is no "buffs" map in the traits map, add one
        if (!traitsMap.get('Buffs')) traitsMap.set('Buffs', new Map())

        // get the mapped buffs values we have seen for "Buffs" so far
        let mappedBuffValues = traitsMap.get('Buffs')

        // get the entry for the specific buff this nfts recieves
        let buffsData = mappedBuffValues.get(buffs)

        // If no entry, create a new one with a count of 1, otherwise update the entry count by 1
        if (!buffsData) mappedBuffValues.set(buffs, { count: 1, isFiltered: false })
        else mappedBuffValues.set(buffs, { count: buffsData.count + 1, isFiltered: false })

        // apply the udpated buffs mapping
        traitsMap.set('Buffs', mappedBuffValues)
      }

      // if ectoskeletons address add skeleton buffs to traits map
      if (address.toLowerCase() === ectoSkeletonsCollectionAddress) {
        let buffArray = Array.from(Object.values(nftData.buffs))

        for (let buff of buffArray) {
          if (buff === 'None') continue
          //   console.log(buff)

          // if there is no "buffs" map in the traits map, add one
          if (!traitsMap.get('Buffs')) traitsMap.set('Buffs', new Map())

          // get the mapped buffs values we have seen for "Buffs" so far
          let mappedBuffValues = traitsMap.get('Buffs')

          // get the entry for the specific buff this nfts recieves
          let buffData = mappedBuffValues.get(buff)

          // If no entry, create a new one with a count of 1, otherwise update the entry count by 1
          if (!buffData) mappedBuffValues.set(buff, { count: 1, isFiltered: false })
          else mappedBuffValues.set(buff, { count: buffData.count + 1, isFiltered: false })

          // apply the udpated buffs mapping
          traitsMap.set('Buffs', mappedBuffValues)
        }
      }

      // ADD STANDARD METADATAS
      if (!isIterable(metadata)) {
        canIterate = false
        break
      }

      for (let entry of metadata) {
        // console.log('handling trait: ', entry)
        let traitType = entry.trait_type
        let trait = entry.value
        if (!traitsMap.get(traitType)) traitsMap.set(traitType, new Map())
        let mappedTraitValues = traitsMap.get(traitType)
        let traitData = mappedTraitValues.get(trait)
        if (!traitData) mappedTraitValues.set(trait, { count: 1, isFiltered: false })
        else mappedTraitValues.set(trait, { count: traitData.count + 1, isFiltered: false })
        traitsMap.set(traitType, mappedTraitValues)
      }
    }
    // console.log(traitsMap)
    // set the map of traits so that we can render filters to toggle

    setTraitsMap(traitsMap)
    // set the new nft data containing metadata so they can be filtered
    if (canIterate) {
      setPurchasableNfts(Array.from(purchasableNftsUpdate.values()))
      console.log('finished setting metadatas on purchasableNfts')
    } else {
      console.log('no metadata for this collection')
    }
  })

  // let purchasableNfts = Array.from(purchasableNfts.values())
  // console.log(purchasableNfts)
  // let result = { purchasableNfts: purchasableNfts, traitsMap: traitsMap }
  // return result
}

export const getNftsToBuyFromPools = (pools) => {
  let nfts = new Map()

  for (const pool of pools) {
    if (pool.poolType == 'BUY' || pool.poolType == 'BUY_AND_SELL') {
      if (pool.collectionAddress.toLowerCase() === littleGhostsCollectionAddress) {
        for (const nft of pool.nftAssets) {
          let nftData = {
            id: nft.tokenId,
            price: Web3.utils.fromWei(pool.floorNBT, 'ether'),
            poolStartPrice: Web3.utils.fromWei(pool.floorNBT, 'ether'),
            poolAddress: pool.poolAddress,
            bondingCurve: pool.bondingCurveType,
            delta: pool.delta,
            metadata: {},
            rank: littleGhostRanks[nft.tokenId].rank,
            rarity_score: littleGhostRanks[nft.tokenId].rarity_score,
            trait_count: littleGhostRanks[nft.tokenId].trait_count,
            // buffs: getGhostBuffs(littleGhostRanks[nft.tokenId].rank),
            // balanceNBT: pool.balanceNBT,
            // fee: pool.fee,
            // floorNBT: pool.floorNBT,
            // nftBalance: pool.nftBalance,
            // offerNBT: pool.offerNBT,
            // spotPriceNBT: pool.spotPriceNBT,
          }
          nfts.set(nft.tokenId, nftData)
        }
      } else if (pool.collectionAddress.toLowerCase() === ectoSkeletonsCollectionAddress) {
        for (const nft of pool.nftAssets) {
          let nftData = {
            id: nft.tokenId,
            price: Web3.utils.fromWei(pool.floorNBT, 'ether'),
            poolStartPrice: Web3.utils.fromWei(pool.floorNBT, 'ether'),
            poolAddress: pool.poolAddress,
            bondingCurve: pool.bondingCurveType,
            delta: pool.delta,
            metadata: {},
            rank: ectoSkeletonsMeta[nft.tokenId].rank,
            buffs: ectoSkeletonsMeta[nft.tokenId].buffs,
          }
          nfts.set(nft.tokenId, nftData)
        }
      } else {
        for (const nft of pool.nftAssets) {
          let nftData = {
            id: nft.tokenId,
            price: Web3.utils.fromWei(pool.floorNBT, 'ether'),
            poolStartPrice: Web3.utils.fromWei(pool.floorNBT, 'ether'),
            poolAddress: pool.poolAddress,
            bondingCurve: pool.bondingCurveType,
            delta: pool.delta,
            metadata: {},
          }
          nfts.set(nft.tokenId, nftData)
        }
      }
    }
  }
  // setPurchasableNfts(Array.from(nfts.values()))
  let result = {
    purchasableNfts: Array.from(nfts.values()),
    purchasableNftMap: nfts,
  }
  return result
}

export const getSpotPrices = (pools, highestOffer) => {
  let spotPrices = []
  for (let pool of pools) {
    let balanceNBT = new BigNumber(Web3.utils.fromWei(pool.balanceNBT))
    let price = new BigNumber(Web3.utils.fromWei(pool.offerNBT))
    let priceSum = price
    let delta

    if (pool.bondingCurveType === 'LINEAR') {
      delta = new BigNumber(Web3.utils.fromWei(pool.delta, 'ether'))
    }
    if (pool.bondingCurveType === 'EXPONENTIAL') {
      delta = +Web3.utils.fromWei(pool.delta, 'ether') - 1
    }

    if (+balanceNBT > 0) {
      while (
        (priceSum.isLessThanOrEqualTo(balanceNBT) && pool.bondingCurveType === 'EXPONENTIAL') ||
        (priceSum.isLessThanOrEqualTo(balanceNBT) && pool.bondingCurveType === 'LINEAR' && +price - delta > 0)
      ) {
        // console.log(`balanceNBT: ${balanceNBT}, price: ${price}, delta: ${delta}, priceSum: ${priceSum} bondingCurve ${pool.bondingCurveType} poolAddress ${pool.poolAddress}`)
        spotPrices.unshift({ price: +price.toFixed(), poolAddress: pool.poolAddress, owner: pool.owner })
        if (pool.bondingCurveType === 'LINEAR') {
          price = price.minus(delta)
        }
        if (pool.bondingCurveType === 'EXPONENTIAL') {
          price = price.times(100 - delta)
        }
        priceSum = priceSum.plus(price)
      }
    }
  }
  spotPrices.sort((a, b) => b.price - a.price)

  if (spotPrices && spotPrices.length > 0 && spotPrices[0].price > +highestOffer) {
    spotPrices.shift()
  }

  return spotPrices
}

export const setSpotPricesOnNfts = (assets, cartItemsToSell, spotPrices, account, collectionAddress) => {
  let ownedNfts = [...assets]
  let updatedCartItems = []
  let listings = []

  if (account) spotPrices = spotPrices.filter((spotPrice) => spotPrice.owner.toLowerCase() !== account.toLowerCase())

  for (let i of cartItemsToSell) {
    let spotPrice = spotPrices.shift()
    let updatedItem = { ...i }

    // remove this nft from ownedNfts if it belongs on collection listing page
    let listing = ownedNfts.find((nft) => nft.id === updatedItem.id)
    if (listing) {
      ownedNfts.splice(ownedNfts.indexOf(listing), 1)
      listing.price = spotPrice.price
      listings.push(listing)
    }

    //dont update item in cart if collection address doesn't match.
    if (collectionAddress === updatedItem.collectionAddress) {
      updatedItem.price = spotPrice.price
      updatedItem.offerAddress = spotPrice.poolAddress
    }

    updatedCartItems.push(updatedItem)
  }

  // map best price on to remaining nfts
  let spotPrice = spotPrices.shift()
  for (let card of ownedNfts) {
    spotPrice ? (card.price = spotPrice.price) : (card.price = 'No Offers')
    listings.push(card)
  }

  return { updatedCartItems, listings }
}

export function setPricesForItemsInSamePool(poolItems) {
  const bondingCurve = poolItems[0].bondingCurve
  let delta = new BigNumber(Web3.utils.fromWei(poolItems[0].delta))
  let price = new BigNumber(+poolItems[0].poolStartPrice)
  let updatedItems = []

  if (delta.isEqualTo(0)) return { updatedItems: poolItems, price: price }

  // PRESERVED IN CASE WE USE XYK
  // if (bondingCurve !== 'XYK' && delta.isEqualTo(0)) return { updatedItems: poolItems, price: price }
  // if (bondingCurve === 'XYK') {
  //   let item = poolItems[0]
  //   let newPrices
  //   if (item.poolType === 'BUY_AND_SELL') {
  //     newPrices = getSpotPricesSell(item.price, 0, poolItems.length, 'xyk', Math.max(item.nftBalance, item.balanceNBT))
  //   } else {
  //     newPrices = getSpotPricesSell(item.price, 0, poolItems.length, 'xyk')
  //   }
  //   for (let i of poolItems) {
  //     let item = { ...i }
  //     item.price = newPrices.shift().toFixed(5)
  //     updatedItems.push(item)
  //   }
  // }
  if (bondingCurve === 'LINEAR') {
    for (let i of poolItems) {
      let item = { ...i }
      item.price = price.toFixed(10)
      price = price.plus(delta)
      updatedItems.push(item)
    }
  }
  if (bondingCurve === 'EXPONENTIAL') {
    for (let i of poolItems) {
      let item = { ...i }
      item.price = price.toFixed(10)
      price = price.times(delta)
      updatedItems.push(item)
    }
  }
  // console.log('updated pool items: ', updatedItems)
  // console.log('nextPrice: ' + price)
  return { updatedItems, price }
}

export const calculateNthTrade = (price, del, count, bondingCurve) => {
  const n = count
  const startPrice = new BigNumber(price)
  const delta = new BigNumber(Web3.utils.fromWei(del))

  if (bondingCurve === 'LINEAR') {
    return startPrice.plus(delta.times(n)).toFixed(10)
  } else {
    return startPrice.times(delta.pow(n)).toFixed(10)
  }
}

function compare(a, b) {
  return +a.price - +b.price
}

export function repriceListingsAndItemsToBuy(purchasableNfts, cartPoolMap) {
  let listings = [...purchasableNfts]

  for (let nft of listings) {
    // check to see if we already have an entry for this pool address
    // if not then dont touch the spot price
    let poolMapEntry = cartPoolMap.get(nft.poolAddress.toLowerCase())
    if (!poolMapEntry) {
      nft.price = nft.poolStartPrice
      continue
    }

    // if we have cart items from this pool address, see if we have this nft
    let nftMap = poolMapEntry.poolNfts
    let price = nftMap.get(nft.id)

    // if we do then just assign the price it has been given in cart
    if (price) nft.price = price
    // else this nft is not in cart but will get its spot price from pool config
    else nft.price = poolMapEntry.spotPrice
  }

  listings.sort(compare)
  return listings
}

export function mapCartItemsToPools(cartItemsToBuy, details) {
  let poolMap = new Map()

  for (let nft of cartItemsToBuy) {
    let collectionAddress = nft.collectionAddress.toLowerCase()
    let poolAddress = nft.poolAddress.toLowerCase()
    if (collectionAddress !== details.address.toLowerCase()) continue

    if (!poolMap.has(poolAddress)) {
      let nftMap = new Map()
      nftMap.set(nft.id, nft.price)

      let poolMapEntry = {
        poolNfts: nftMap,
        poolStartPrice: nft.poolStartPrice,
        bondingCurve: nft.bondingCurve,
        delta: nft.delta,
        spotPrice: null,
      }

      poolMap.set(poolAddress, poolMapEntry)
    } else {
      let poolMapEntry = poolMap.get(poolAddress)
      let nftMap = poolMapEntry.poolNfts
      nftMap.set(nft.id, nft.price)
    }
  }

  // traverse map, for each pool setSpotPrice based on #nfts in map
  for (let entry of poolMap.values()) {
    entry.spotPrice = calculateNthTrade(entry.poolStartPrice, entry.delta, entry.poolNfts.size, entry.bondingCurve)
  }

  // console.log(poolMap)
  return poolMap
}
