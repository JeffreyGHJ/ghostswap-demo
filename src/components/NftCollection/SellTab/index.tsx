import { useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import { toggleItemToSell, setCartIsOpen } from '../../../state/cart'
import NftCard from '../../NftCard'
import Button from '../../Button'
import useNftImageSources from '../../../hooks/useNftImageSources'
import { initializeCardsToDisplay, loadMore } from './functions'
import TraitFilters from '../TraitFilters'
import { clearTraitFilters } from '../functions'
import { Tab } from '@headlessui/react'
import SellTabControls from './SellTabControls'

const PAGE_SIZE = 30
const SORTINGS = ['Lowest ID', 'Highest ID']
const SORTINGS_EXT = ['Lowest ID', 'Highest ID', 'Lowest Rank', 'Highest Rank']
const littleGhostsCollectionAddress = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48'
const ectoSkeletonsCollectionAddress = '0x0fa48f20dddcf6ed724a36381f66c3e905fe7988'

const SellTab = ({
  filteredNftsToSell,
  assets,
  details,
  buying = null,
  assetTraitFilters,
  setAssetTraitFilters,
  assetTraitsMap,
  setAssetTraitsMap,
  setCanInitSellTabMetadata,
  sellTabMetaInitialized,
}) => {
  const dispatch = useDispatch()
  const { getNftImageSource } = useNftImageSources()
  const itemsToSell = useSelector((state: any) => state.cart.itemsToSell)
  const [cardsToDisplay, setCardsToDisplay] = useState([])
  const [numPages, setNumPages] = useState(1)
  const [imageSources, setImageSources] = useState(new Map())
  const [showFilters, setShowFilters] = useState(false)
  const [numFiltersApplied, setNumFiltersApplied] = useState(0)
  const [nfts, setNfts] = useState(filteredNftsToSell)
  const [activeSort, setActiveSort] = useState(SORTINGS[0])

  const allowMoreSorting =
    details?.address?.toLowerCase() === littleGhostsCollectionAddress ||
    details?.address?.toLowerCase() === ectoSkeletonsCollectionAddress

  useEffect(() => {
    initializeCardsToDisplay(nfts, PAGE_SIZE, details, getNftImageSource, setImageSources, setCardsToDisplay)
  }, [])

  useEffect(() => {
    if (activeSort === 'Lowest ID') setNfts([...filteredNftsToSell].sort((a, b) => +a.id - +b.id))
    else if (activeSort === 'Highest ID') setNfts([...filteredNftsToSell].sort((a, b) => +b.id - +a.id))
    else if (activeSort === 'Lowest Rank') setNfts([...filteredNftsToSell].sort((a, b) => +b.rank - +a.rank))
    else if (activeSort === 'Highest Rank') setNfts([...filteredNftsToSell].sort((a, b) => +a.rank - +b.rank))
  }, [filteredNftsToSell, activeSort])

  useEffect(() => {
    let toDisplay = nfts.slice(0, numPages * PAGE_SIZE)
    let imageSourcesData = new Map(imageSources)

    for (let nft of toDisplay) {
      let id = nft.id
      let address = details.address.toLowerCase()
      let src = getNftImageSource(address, id)
      // console.log(src)
      imageSourcesData.set(id, src)
    }

    setImageSources(imageSourcesData)
    setCardsToDisplay(toDisplay)
  }, [nfts, numPages])

  useEffect(() => {
    let timeout = setTimeout(() => {
      Promise.all(imageSources).then(() => {
        setCanInitSellTabMetadata(true)
      })
    }, 1000)

    return () => clearTimeout(timeout)
  }, [imageSources])

  const handleLoadMore = () => {
    loadMore(
      nfts,
      details,
      imageSources,
      numPages,
      PAGE_SIZE,
      getNftImageSource,
      setImageSources,
      setCardsToDisplay,
      setNumPages
    )
  }

  const handleCollapse = () => {
    setCardsToDisplay(nfts.slice(0, 1 * PAGE_SIZE))
    setNumPages(1)
  }

  const toggleItemInCart = (nftData: any) => {
    // allow toggle if price is a number or if we want to remove from cart
    if (!isNaN(nftData.price) || isInCart(nftData)) {
      dispatch(toggleItemToSell(nftData))
      dispatch(setCartIsOpen(true))
    }
  }

  const isInCart = (nftData) => {
    let itemList = itemsToSell
    for (let item of itemList) {
      if (item.id === nftData.id && item.collectionAddress === details.address) return true
    }
    return false
  }

  const clearFilters = () => {
    clearTraitFilters(assetTraitsMap, setAssetTraitsMap, setAssetTraitFilters)
  }

  useEffect(() => {
    let sum = 0
    for (let traitsArray of assetTraitFilters.values()) sum += traitsArray.length
    setNumFiltersApplied(sum)
  }, [assetTraitFilters])

  return (
    <Tab.Panel id="panel" /*className={'h-full flex flex-col'}*/>
      <div id="sell-tab" className="mt-6 min-h-[30rem]">
        <SellTabControls
          assets={assets}
          sellTabMetaInitialized={sellTabMetaInitialized}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          numFiltersApplied={numFiltersApplied}
          clearFilters={clearFilters}
          activeSort={activeSort}
          setActiveSort={setActiveSort}
          SORTINGS={allowMoreSorting ? SORTINGS_EXT : SORTINGS}
        />

        <div className="flex w-full h-full ">
          <TraitFilters
            traitsMap={assetTraitsMap}
            showFilters={showFilters}
            setTraitsMap={setAssetTraitsMap}
            traitFilters={assetTraitFilters}
            setTraitFilters={setAssetTraitFilters}
          />
          {nfts?.length > 0 && (
            <div id="listings-flexbox" className="flex flex-wrap justify-center w-full h-full">
              {[...cardsToDisplay].map((nftData: any, index: number) => (
                <NftCard
                  key={index + ':' + nftData.id}
                  details={details}
                  toggleItemInCart={toggleItemInCart}
                  buying={buying ? true : false}
                  isSelected={isInCart(nftData)}
                  nftData={nftData}
                  imageSource={imageSources.get(nftData.id)}
                />
              ))}
            </div>
          )}
          {assets?.length > 0 && cardsToDisplay?.length === 0 && (
            <div className="w-full mt-8 text-center">
              There are no {details?.name}
              {details?.name[details?.name.length - 1] === 's' ? '' : 's'} that match these filters
            </div>
          )}
          {(!assets || assets.length < 1) && (
            <div className="w-full mt-8 text-center">
              You have no {details?.name}
              {details?.name[details?.name.length - 1] === 's' ? '' : 's'}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center w-full gap-4">
          {cardsToDisplay?.length < nfts?.length && (
            <Button size="default" className="w-32 mt-6 bg-indigo-500" onClick={() => handleLoadMore()}>
              Load More
            </Button>
          )}
          {numPages > 1 && cardsToDisplay?.length > PAGE_SIZE && (
            <Button size="default" className="w-32 mt-6 bg-indigo-500" onClick={() => handleCollapse()}>
              Collapse
            </Button>
          )}
        </div>
      </div>
    </Tab.Panel>
  )
}

export default SellTab
