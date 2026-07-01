const littleGhostsCollectionAddress = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48'

function QuerySwapHistory(
  collectionAddress,
  poolAddress,
  networkId = 56,
  eventTypes = ['SWAP_NFT_IN_POOL', 'SWAP_NFT_OUT_POOL'],
  limit = 50
) {
  return {
    query: `{ 
      getNftPoolEvents(networkId: ${networkId}, collectionAddress: "${collectionAddress}", poolAddress: "${poolAddress}", eventTypes: [${eventTypes}], limit: ${limit}) {
        items {
          timestamp
          data {
            ... on SwapNftInPoolEventData {
              type
              nftsTransfered {
                amountT
                nftTokenId
              }
            }
            ... on SwapNftOutPoolEventData {
              type
              nftsTransfered {
                amountT
                nftTokenId
              }
            }
          } 
        } 
      }
    }`,
  }
}

export function QueryNftPoolCollection(collectionAddress) {
  console.log('test')
  return {
    query: `{ 
      getNftPoolCollection(networkId: ${56}, exchangeAddress: ${'0x00000000000000000000000000000000'}, collectionAddress: ${collectionAddress} ) {
        balanceNBT
            collectionAddress
            collectionId
            exchangeAddress
            exchangeId
            floorNBT
            media {
              image
              thumbLg
              thumbSm
            }
            name
            networkId
            nftBalance
            nftVolumeAllTime
            offerNBT
            volumeAllTimeNBT
      }
    }`,
  }
}

export default QuerySwapHistory
