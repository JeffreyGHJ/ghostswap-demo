import nft from '../../../public/question.png'
import Web3 from 'web3'

export function assembleCollectionsWithActivity(collections, definedApiCollections, lastRank) {
  let copy = [...collections]
  let unwhitelistedCollections = []
  let collectionsWithActivity = []
  let rank = lastRank // rank used for scraped data set

  // merge scraped data with definedApi results if scraped data is available
  definedApiCollections.map((collection) => {
    let whitelistedCollection = copy.find((c) => c.address.toLowerCase() === collection.collectionAddress.toLowerCase())

    if (whitelistedCollection !== undefined) {
      let collectionWithActivity = {
        ...whitelistedCollection,
        trades_def: collection.nftVolumeAllTime,
        volumeBNB_def: Web3.utils.fromWei(collection.volumeAllTimeNBT),
        nftBalance: collection.nftBalance,
        balanceNBT: collection.balanceNBT,
        floorNBT: collection.floorNBT,
        offerNBT: collection.offerNBT,
      }
      collectionsWithActivity.push(collectionWithActivity)
    } else {
      let unwhitelistedCollection = {
        name: collection.name,
        rank: rank++,
        trades_def: collection.nftVolumeAllTime,
        volumeBNB_def: Web3.utils.fromWei(collection.volumeAllTimeNBT),
        nftBalance: collection.nftBalance,
        balanceNBT: collection.balanceNBT,
        floorNBT: collection.floorNBT,
        offerNBT: collection.offerNBT,
        trades: collection.nftVolumeAllTime,
        volumeBNB: Web3.utils.fromWei(collection.volumeAllTimeNBT),
        address: collection.collectionAddress.toLowerCase(),
        avatar: nft.src,
        holders: null,
        holders_7d: null,
        holders_24h: null,
        holders_30d: null,
        status: null,
        trades_7d: null,
        trades_30d: null,
        trades_last7d: null,
        trades_last24h: null,
        trades_last30d: null,
        volumeBNB_7d: null,
        volumeBNB_30d: null,
        volumeBNB_last7d: null,
        volumeBNB_last24h: null,
        volumeBNB_last30d: null,
        volumeUSD: null,
        volumeUSD_7d: null,
        volumeUSD_30d: null,
        volumeUSD_last7d: null,
        volumeUSD_last24h: null,
        volumeUSD_last30d: null,
      }
      unwhitelistedCollections.push(unwhitelistedCollection)
    }
  })

  let rank_def = 1

  // concatenate collections with merged scraped data and those without
  collectionsWithActivity = collectionsWithActivity.concat(unwhitelistedCollections)

  // sort all merged collections based on definedApi volume
  collectionsWithActivity.sort((a, b) => +b.volumeBNB_def - +a.volumeBNB_def)

  // apply ranks to sorted data
  collectionsWithActivity.map((collection) => {
    collection.rank_def = rank_def++
  })

  return collectionsWithActivity
}

export const rankCollections = (collections, startingRank = null) => {
  let rank = startingRank || 1
  collections.sort((a, b) => b.volumeUSD - a.volumeUSD) // sort by volume
  collections.map((collection) => (collection.rank = rank++))
  return rank
}
