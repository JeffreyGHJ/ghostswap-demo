import Web3 from 'web3'

export function getCollectionDetailsFromPool(collections, nftPool, setCollectionName, setAvatar) {
  if (!collections || !nftPool) return
  let collectionDetails = collections?.find((collection) => collection.address === nftPool?.collectionAddress)
  let name
  let avatar

  if (!collectionDetails) return
  if (collectionDetails.name) name = collectionDetails?.name
  if (collectionDetails.avatar) avatar = collectionDetails?.avatar.toString()
  if (name) setCollectionName(name)
  if (avatar) setAvatar(avatar)
}

export function getNftDataFromPool(nftPool) {
  if (!nftPool) return []
  let nftData = []
  if (nftPool.poolType == 'BUY' || nftPool.poolType == 'BUY_AND_SELL')
    for (const nft of nftPool.nftAssets) {
      nftData.push({
        name: nft.name,
        tokenAddress: nftPool.collectionAddress,
        tokenId: nft.tokenId,
      })
    }
  return nftData
}

export function calculateFees(swapHistory) {
  let fees = swapHistory?.reduce((sum, swap) => {
    if (swap?.data?.poolFeeT !== undefined) sum = +sum + +Web3.utils.fromWei(swap.data.poolFeeT)
    return sum
  }, 0)
  return fees !== undefined ? fees : 0
}

export function calculateNftsBought(swapHistory) {
  let nftsBought = swapHistory?.reduce(
    (sum, swap) => (swap.eventType === 'SWAP_NFT_IN_POOL' ? +sum + swap.data.nftsTransfered.length : sum),
    0
  )
  return nftsBought !== undefined ? nftsBought : 0
}

export function calculateNftsSold(swapHistory) {
  let nftsSold = swapHistory?.reduce(
    (sum, swap) => (swap.eventType === 'SWAP_NFT_OUT_POOL' ? +sum + swap.data.nftsTransfered.length : sum),
    0
  )
  return nftsSold !== undefined ? nftsSold : 0
}

export function add(A, B) {
  const AL = A.length
  const BL = B.length
  const ML = Math.max(AL, BL)

  let carry = 0,
    sum = ''

  for (let i = 1; i <= ML; i++) {
    let a = +A.charAt(AL - i)
    let b = +B.charAt(BL - i)

    let t = carry + a + b
    carry = (t / 10) | 0
    t %= 10

    sum = i === ML && carry ? carry * 10 + t + sum : t + sum
  }

  return sum
}
