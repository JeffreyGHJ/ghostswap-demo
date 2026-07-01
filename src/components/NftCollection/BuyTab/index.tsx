import { useEffect, useState } from 'react'
import NftListings from '../NftListings'
import TraitFilters from '../TraitFilters'
import useNftImageSources from '../../../hooks/useNftImageSources'
import Button from '../../Button'
import { SweepModeModal } from './SweepModeModal'
import { clearTraitFilters } from '../functions'
import { Tab } from '@headlessui/react'
import BuyTabControls from './BuyTabControls'

const PAGE_SIZE = 30

const SORTINGS = ['Lowest Price', 'Highest Price', 'Lowest ID', 'Highest ID']
const SORTINGS_EXT = ['Lowest Price', 'Highest Price', 'Lowest ID', 'Highest ID', 'Lowest Rank', 'Highest Rank']
const littleGhostsCollectionAddress = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48'
const ectoSkeletonsCollectionAddress = '0x0fa48f20dddcf6ed724a36381f66c3e905fe7988'

const BuyTab = ({
  filteredNftsToBuy,
  purchasableNfts,
  pools,
  details,
  traitsMap,
  traitFilters,
  setTraitsMap,
  setTraitFilters,
  setCanInitializeMetadata,
}) => {
  const [filtersReady, setFiltersReady] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [show, setShow] = useState(false)

  const [cardsToDisplay, setCardsToDisplay] = useState([])
  const [numPages, setNumPages] = useState(1)

  const [imageSources, setImageSources] = useState(new Map())
  const [numFiltersApplied, setNumFiltersApplied] = useState(0)

  const [nfts, setNfts] = useState(filteredNftsToBuy)
  const [activeSort, setActiveSort] = useState(SORTINGS[0])

  const allowMoreSorting =
    details?.address?.toLowerCase() === littleGhostsCollectionAddress ||
    details?.address?.toLowerCase() === ectoSkeletonsCollectionAddress

  useEffect(() => {
    if (activeSort === 'Lowest Price') setNfts(filteredNftsToBuy)
    else if (activeSort === 'Highest Price') setNfts([...filteredNftsToBuy].sort((a, b) => +b.price - +a.price))
    else if (activeSort === 'Lowest ID') setNfts([...filteredNftsToBuy].sort((a, b) => +a.id - +b.id))
    else if (activeSort === 'Highest ID') setNfts([...filteredNftsToBuy].sort((a, b) => +b.id - +a.id))
    else if (activeSort === 'Lowest Rank') setNfts([...filteredNftsToBuy].sort((a, b) => +b.rank - +a.rank))
    else if (activeSort === 'Highest Rank') setNfts([...filteredNftsToBuy].sort((a, b) => +a.rank - +b.rank))
  }, [filteredNftsToBuy, activeSort])

  const { getNftImageSource } = useNftImageSources()

  // wait until we have set some image sources without change for 1 second
  // after no new image requests wait until all promises in the image sources have resolved
  // once those promises have resolved and the images are probably displayed
  // after images display we can execute the expensive function of applying metadatas and filters
  useEffect(() => {
    let timeout = setTimeout(() => {
      Promise.all(imageSources).then(() => {
        setCanInitializeMetadata(true)
      })
    }, 1000)

    return () => clearTimeout(timeout)
  }, [imageSources])

  const clearFilters = () => {
    clearTraitFilters(traitsMap, setTraitsMap, setTraitFilters)
  }

  useEffect(() => {
    let sum = 0
    for (let traitsArray of traitFilters.values()) sum += traitsArray.length
    setNumFiltersApplied(sum)
  }, [traitFilters])

  useEffect(() => {
    setFiltersReady(traitsMap !== null)
  }, [traitsMap])

  const handleLoadMore = () => {
    let pages = numPages + 1
    let nftsToAdd = nfts.slice(numPages * PAGE_SIZE, pages * PAGE_SIZE)
    let imageSourcesData = new Map(imageSources)

    for (let nft of nftsToAdd) {
      let id = nft.id
      let data = imageSourcesData.get(id)
      if (data !== undefined && !data.then) continue // this is probably an image source
      if (data === undefined) {
        // no image source and no promise
        let address = details.address.toLowerCase()
        let src = getNftImageSource(address, id)
        imageSourcesData.set(id, src)
      }
      // then this is a resolved promise and we can take the image source
      else if (data.then) {
        data.then((src) => {
          imageSourcesData.set(id, src)
        })
      }
    }

    setImageSources(imageSourcesData)
    setCardsToDisplay(nfts.slice(0, pages * PAGE_SIZE))
    setNumPages(pages)
  }

  const handleCollapse = () => {
    setCardsToDisplay(nfts.slice(0, 1 * PAGE_SIZE))
    setNumPages(1)
  }

  return (
    <Tab.Panel id="panel" /*className={'h-full flex flex-col'}*/>
      <div id="buy-tab" className="mt-6 min-h-[30rem]">
        <BuyTabControls
          filtersReady={filtersReady}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          show={show}
          setShow={setShow}
          numFiltersApplied={numFiltersApplied}
          clearFilters={clearFilters}
          purchasableNfts={purchasableNfts}
          setModalIsOpen={setModalIsOpen}
          activeSort={activeSort}
          setActiveSort={setActiveSort}
          SORTINGS={allowMoreSorting ? SORTINGS_EXT : SORTINGS}
          traitsMap={traitsMap}
        />

        <SweepModeModal
          isOpen={modalIsOpen}
          closeModal={() => setModalIsOpen(false)}
          nfts={purchasableNfts || []}
          details={details}
          pools={pools}
        />

        <div className="flex w-full h-full ">
          <TraitFilters
            traitsMap={traitsMap}
            showFilters={showFilters}
            setTraitsMap={setTraitsMap}
            traitFilters={traitFilters}
            setTraitFilters={setTraitFilters}
          />
          {nfts?.length > 0 && (
            <NftListings
              details={details}
              buying={true}
              pools={pools}
              nfts={nfts}
              PAGE_SIZE={PAGE_SIZE}
              numPages={numPages}
              imageSources={imageSources}
              setImageSources={setImageSources}
              cardsToDisplay={cardsToDisplay}
              setCardsToDisplay={setCardsToDisplay}
            />
          )}
          {purchasableNfts?.length > 0 && nfts?.length === 0 && details.name !== undefined && (
            <div className="w-full mt-8 text-center">
              There are no {details?.name}
              {details?.name[details?.name.length - 1] === 's' ? '' : 's'} that match these filters
            </div>
          )}
          {purchasableNfts?.length < 1 && details.name !== undefined && (
            <div className="w-full mt-8 text-center">
              There are no {details?.name}
              {details?.name[details?.name.length - 1] === 's' ? '' : 's'} for sale
            </div>
          )}
        </div>

        <div className="flex items-center justify-center w-full gap-4">
          {cardsToDisplay?.length < nfts?.length && (
            <Button size="default" className="w-32 mt-6 bg-indigo-500" onClick={() => handleLoadMore()}>
              Load More
            </Button>
          )}
          {numPages > 1 && cardsToDisplay.length > PAGE_SIZE && (
            <Button size="default" className="w-32 mt-6 bg-indigo-500" onClick={() => handleCollapse()}>
              Collapse
            </Button>
          )}
        </div>
      </div>
    </Tab.Panel>
  )
}

export default BuyTab
