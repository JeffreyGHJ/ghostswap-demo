export const loadMore = (
  nfts,
  details,
  imageSources,
  numPages,
  PAGE_SIZE,
  getNftImageSource,
  setImageSources,
  setCardsToDisplay,
  setNumPages
) => {
  let pages = numPages + 1
  let nftsToAdd = nfts.slice(numPages * PAGE_SIZE, pages * PAGE_SIZE)
  let imageSourcesData = new Map(imageSources)

  for (let nft of nftsToAdd) {
    let id = nft.id
    let address = details.address.toLowerCase()
    let src = getNftImageSource(address, id)
    imageSourcesData.set(id, src)
  }

  setImageSources(imageSourcesData)
  setCardsToDisplay(nfts.slice(0, pages * PAGE_SIZE))
  setNumPages(pages)
}

export const initializeCardsToDisplay = (
  nfts,
  PAGE_SIZE,
  details,
  getNftImageSource,
  setImageSources,
  setCardsToDisplay
) => {
  let imageSourcesData = new Map()

  for (let nft of nfts.slice(0, PAGE_SIZE)) {
    let id = nft.id
    let address = details.address.toLowerCase()
    let src = getNftImageSource(address, id)
    imageSourcesData.set(id, src)
  }

  setImageSources(imageSourcesData)
  setCardsToDisplay(nfts.slice(0, PAGE_SIZE))
}

export const mapOwnedNfts = (nftAssets) => {
  const ownedNftMap = new Map()

  for (const nft of nftAssets) {
    let nftData = {
      ...nft,
      metadata: {},
    }
    ownedNftMap.set(nft.tokenId, nftData)
  }

  return ownedNftMap
}
