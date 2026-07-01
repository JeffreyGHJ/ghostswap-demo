import { Tab } from '@headlessui/react'
import InventoryToggles from '../InventoryToggles'
import SplitPane from '../../SplitPane'
import Filters from '../Filters'
import InventoryNfts from '../InventoryNfts'
import InventoryFooter from '../InventoryFooter'
import { useEffect, useState } from 'react'
import { countFilters } from '../functions'

const SORTINGS = ['Lowest ID', 'Highest ID']

const AvailableNftsTab = ({
  filteredAvailableNfts,
  availableNftFilters,
  setAvailableNftFilters,
  selectedNfts,
  setSelectedNfts,
  showFilters,
  setShowFilters,
  showOffers,
  setShowOffers,
  setModalOpen,
  pageSize,
}) => {
  const [searchString, setSearchString] = useState('')
  const [numFiltersApplied, setNumFiltersApplied] = useState(0)
  const [activeSort, setActiveSort] = useState(SORTINGS[0])
  const [sortedNfts, setSortedNfts] = useState([])

  useEffect(() => {
    setSortedNfts(
      [...filteredAvailableNfts].sort((a, b) => {
        if (a.tokenAddress.toLowerCase() === b.tokenAddress.toLowerCase()) {
          if (activeSort === 'Lowest ID') return +a.tokenId - +b.tokenId
          if (activeSort === 'Highest ID') return +b.tokenId - +a.tokenId
        }
      })
    )
  }, [filteredAvailableNfts, activeSort])

  useEffect(() => {
    // TO-DO: this does not work as expected - if show offers is true, update the set of filteredAvailableNfts
    // to only be filtered on the collections that have offers
    // if (showOffers) {
    //   let toCount = Array.from(availableNftFilters).filter(
    //     (filter: any) => filter[1]?.isFiltered === true && filter[1]?.offer !== null
    //   )
    //   setNumFiltersApplied(toCount?.length)
    // } else {
    //   setNumFiltersApplied(countFilters(availableNftFilters))
    // }
    setNumFiltersApplied(countFilters(availableNftFilters))
  }, [availableNftFilters, showOffers])

  return (
    <Tab.Panel id="panel" className={'h-full flex flex-col'}>
      <InventoryToggles
        showFilters={showFilters}
        toggleShowFilters={() => setShowFilters(!showFilters)}
        showOffers={showOffers}
        toggleShowOffers={() => setShowOffers(!showOffers)}
        activeSort={activeSort}
        setActiveSort={setActiveSort}
        SORTINGS={SORTINGS}
      />
      <SplitPane
        left={
          <Filters
            searchString={searchString}
            setSearchString={setSearchString}
            collectionsToFilter={availableNftFilters}
            setCollectionsToFilter={setAvailableNftFilters}
            numFiltersApplied={numFiltersApplied}
            showOffers={showOffers}
          />
        }
        right={
          <InventoryNfts
            filteredAvailableNfts={sortedNfts}
            selectedNfts={selectedNfts}
            setSelectedNfts={setSelectedNfts}
            pageSize={pageSize}
            showOffers={showOffers}
          />
        }
        showLeft={showFilters}
        split="left"
        container="flex flex-col lg:flex-row justify-between overflow-hidden h-full "
      />
      <InventoryFooter
        selectedNfts={selectedNfts}
        deselectAll={() => setSelectedNfts([])}
        openModal={() => setModalOpen(true)}
      />
    </Tab.Panel>
  )
}

export default AvailableNftsTab
