import SimpleNftCard from '../NftCard/SimpleNftCard'
import { classNames } from '../../functions'
import useNftImageSources from '../../hooks/useNftImageSources'
import { useCallback, useEffect, useState } from 'react'
import React from 'react'

const listBase = 'h-full p-3 gap-x-[.1rem]'

const CONTAINER = {
  default: 'flex w-full overflow-y-auto overflow-x-hidden',
  grid1: 'flex overflow-y-auto overflow-x-hidden',
  grid2: 'flex overflow-y-auto overflow-x-hidden',
  grid3: 'flex overflow-y-auto overflow-x-hidden',
  grid4: 'flex overflow-y-auto overflow-x-hidden',
  row: 'flex w-full overflow-y-hidden overflow-x-auto',
  rowCentered: 'flex overflow-y-hidden overflow-x-auto w-fit max-w-full m-auto',
}

const LIST = {
  default: 'flex flex-wrap w-full justify-center',
  grid1: 'grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] w-full justify-items-center',
  grid2: 'grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] w-full justify-items-center',
  grid3: 'grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] w-full justify-items-center',
  grid4: 'grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] w-full justify-items-center',
  row: 'flex px-0 justify-start',
  rowCentered: 'flex px-0',
}

const toggleNftSelected = (asset, selectedNfts, setSelectedNfts) => {
  let nftInSelection = selectedNfts.some(
    (nft) => nft.tokenId === asset.tokenId && nft.tokenAddress.toLowerCase() === asset.tokenAddress.toLowerCase()
  )
  if (nftInSelection) {
    let selection = [...selectedNfts]
    let index = selection.indexOf(
      selection.find(
        (nft) => nft.tokenId === asset.tokenId && nft.tokenAddress.toLowerCase() === asset.tokenAddress.toLowerCase()
      )
    )
    selection.splice(index, 1)
    setSelectedNfts(selection)
  } else {
    setSelectedNfts(selectedNfts.concat(asset))
  }
}

const NftListBox = ({
  mode = 'default',
  listStyle = 'default',
  nftSize = 'default',
  nfts = undefined,
  listClass = undefined,
  className = undefined,
  selectedNfts = undefined,
  setSelectedNfts = undefined,
  selectEnabled = false,
  maxSelection = null,
  showOffers = null,
}) => {
  const { getNftImageSource } = useNftImageSources()
  const [imageSources, setImageSources] = useState(new Map())

  useEffect(() => {
    let imageSourcesData = new Map(imageSources)

    for (let nft of nfts) {
      let id = nft.tokenId
      let address = nft.tokenAddress.toLowerCase()
      let key = address + ':' + id
      let src = getNftImageSource(address, id)
      imageSourcesData.set(key, src)
    }
    setImageSources(imageSourcesData)
  }, [nfts])

  const handleSelected = useCallback(
    (asset) => {
      if (selectEnabled) {
        if (maxSelection !== null && selectedNfts?.length === maxSelection) {
          let assetInSelection = selectedNfts.find(
            (nft) =>
              nft.tokenId === asset.tokenId && nft.tokenAddress.toLowerCase() === asset.tokenAddress.toLowerCase()
          )
          if (assetInSelection !== undefined) {
            toggleNftSelected(asset, selectedNfts, setSelectedNfts)
          }
        } else {
          toggleNftSelected(asset, selectedNfts, setSelectedNfts)
        }
      }
    },
    [selectEnabled, selectedNfts, setSelectedNfts]
  )

  return (
    <div id="listbox-container" className={classNames(CONTAINER[listStyle], className)}>
      <div id="nft-list" className={classNames(listBase, LIST[listStyle], listClass)}>
        {nfts?.length > 0 &&
          nfts?.map((nftObject, index) => {
            let img = imageSources.get(nftObject.tokenAddress.toLowerCase() + ':' + nftObject.tokenId)
            return (
              <SimpleNftCard
                name={nftObject.name}
                metadataName={nftObject.metadata ? nftObject.metadata.name : nftObject.name}
                key={index + ':' + nftObject.tokenId}
                address={nftObject.tokenAddress}
                id={nftObject.tokenId}
                size={nftSize}
                mode={mode}
                selectedNfts={selectedNfts}
                toggleNftSelected={handleSelected}
                imageSrc={img}
                maxSelected={maxSelection !== null && maxSelection === selectedNfts?.length}
                nftData={nftObject}
                showOffers={showOffers}
              />
            )
          })}
      </div>
    </div>
  )
}

export default React.memo(NftListBox)
