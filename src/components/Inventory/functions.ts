import Web3 from 'web3'

export const mapCollectionsFromNftData = (nftData, activeCollections = null, pooled = false) => {
  let collections = new Map()

  for (let nft of nftData) {
    let tokenAddress = nft.tokenAddress.toLowerCase()
    if (!collections.has(tokenAddress)) {
      let name = nft.name
      let offer = null

      // look for matching active collection and take its offer value
      if (activeCollections !== null && activeCollections?.length > 0) {
        Array.from(activeCollections).filter((collection: any) => {
          if (collection?.address?.toLowerCase() === tokenAddress) {
            offer = collection.offerNBT === null ? null : Web3.utils.fromWei(collection.offerNBT)
          }
        })
      }

      // the function that pulls nfts from pools includes the '#' in the name
      // so here we tokenize the name and remove the token with '#' in it
      // will not work if the collection has an unorthodox naming convention
      // TO-DO: get the collection name only with no "#" in it
      if (pooled === true) {
        let tokens = name.split(' ')
        // console.log(tokens)
        let remove = tokens.find((t) => t.includes('#'))
        if (remove !== undefined) tokens.splice(tokens.indexOf(remove), 1)
        // console.log(tokens)
        name = tokens.join(' ')
      }
      // symbol is not used for anything right now
      collections.set(tokenAddress, { name: name, symbol: nft.symbol, count: 1, isFiltered: false, offer: offer })
    } else {
      let mappedValues = collections.get(tokenAddress)
      mappedValues.count++
      collections.set(tokenAddress, mappedValues)
    }
  }
  return collections
}

export const mapSelectedNftsToCollections = (nftData) => {
  let collections = new Map()
  for (let nft of nftData) {
    let tokenAddress = nft.tokenAddress.toLowerCase()
    if (!collections.has(tokenAddress)) {
      collections.set(tokenAddress, { name: nft.name, tokenIds: [nft.tokenId] })
    } else {
      let collection = collections.get(tokenAddress)
      collection.tokenIds.push(nft.tokenId)
      collections.set(tokenAddress, collection)
    }
  }
  return collections
}

export const toggleFilter = (tokenAddress, collectionsToFilter, setCollectionsToFilter) => {
  tokenAddress = tokenAddress.toLowerCase()
  let copy = { ...collectionsToFilter.get(tokenAddress) }
  copy.isFiltered = !copy.isFiltered
  setCollectionsToFilter(new Map(collectionsToFilter.set(tokenAddress, { ...copy })))
}

export const toggleAllFilters = (collectionsToFilter, numFiltersApplied, setCollectionsToFilter) => {
  let filterUpdate = new Map(collectionsToFilter)
  Array.from(filterUpdate.entries()).map((entry, index) => {
    let key = entry[0]
    let value = entry[1] as object
    let valUpdate = { ...value, isFiltered: numFiltersApplied > 0 ? false : true }
    filterUpdate.set(key, valUpdate)
  })
  setCollectionsToFilter(filterUpdate)
}

export const countFilters = (collectionsToFilter) => {
  let count = 0
  Array.from(collectionsToFilter.entries()).map((entry, index) => {
    entry[1].isFiltered === true ? count++ : {}
  })
  return count
}

export const filterInventoryNfts = (nftData, collectionsToFilter) => {
  let filteredNfts = nftData
  if (Array.from(collectionsToFilter.values()).some((value: any) => value?.isFiltered === true)) {
    filteredNfts = filteredNfts.filter((nft) => {
      let collection = collectionsToFilter.get(nft.tokenAddress.toLowerCase())
      if (collection?.isFiltered === true) return nft
    })
  }
  return filteredNfts
}

export const getNftsInPools = (ownedPools) => {
  let nfts = []
  let pools = ownedPools.filter((pool) => pool.poolType.includes('BUY'))
  pools.map((pool) =>
    pool.nftAssets.map((nftAsset) => {
      let nftData = {
        collectionAddress: pool.collectionAddress.toLowerCase(),
        tokenAddress: pool.collectionAddress.toLowerCase(),
        tokenId: nftAsset.tokenId,
        id: nftAsset.tokenId,
        name: nftAsset.name,
        poolAddress: pool.poolAddress,
        poolType: pool.poolType,
        bondingCurveType: pool.bondingCurveType,
        nftBalance: pool.nftBalance,
      }
      nfts.push(nftData)
    })
  )
  return nfts
}

export const setCollectionOffersOnNfts = (offersAvailable, activeCollections, availableNfts, setAvailableNfts) => {
  if (availableNfts?.length < 1 || offersAvailable === false) return
  let prevMatch = null

  let availableNftsUpdate = availableNfts.map((nftData) => {
    let matchingCollection = null

    if (prevMatch?.address?.toLowerCase() === nftData.tokenAddress.toLowerCase()) {
      console.log('using previous')
      matchingCollection = prevMatch
    } else {
      matchingCollection = activeCollections.find((collection) => {
        if (collection.address.toLowerCase() === nftData.tokenAddress.toLowerCase()) return collection
      })
      prevMatch = matchingCollection && matchingCollection !== undefined ? matchingCollection : null
    }

    let nftDataUpdate = {
      ...nftData,
      offerNBT: matchingCollection?.offerNBT ? (+Web3.utils.fromWei(matchingCollection.offerNBT)).toFixed(4) : null,
    }

    return nftDataUpdate
  })

  setAvailableNfts(availableNftsUpdate)
}
