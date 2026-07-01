import { useEffect, useState } from 'react'
import { countFilters } from '../functions'
import { Tab } from '@headlessui/react'
import InventoryToggles from '../InventoryToggles'
import SplitPane from '../../SplitPane'
import Filters from '../Filters'
import PooledNfts from '../PooledNfts'

const SORTINGS = ['Lowest ID', 'Highest ID']

const PooledNftsTab = ({
  showFilters,
  setShowFilters,
  filteredPooledNfts,
  pooledNftFilters,
  setPooledNftFilters,
  pageSize,
}) => {
  const [searchString, setSearchString] = useState('')
  const [numFiltersApplied, setNumFiltersApplied] = useState(0)
  const [activeSort, setActiveSort] = useState(SORTINGS[0])
  const [sortedNfts, setSortedNfts] = useState([])

  useEffect(() => {
    setSortedNfts(
      [...filteredPooledNfts].sort((a, b) => {
        if (a.tokenAddress.toLowerCase() === b.tokenAddress.toLowerCase()) {
          if (activeSort === 'Lowest ID') return +a.tokenId - +b.tokenId
          if (activeSort === 'Highest ID') return +b.tokenId - +a.tokenId
        }
      })
    )
  }, [filteredPooledNfts, activeSort])

  useEffect(() => {
    setNumFiltersApplied(countFilters(pooledNftFilters))
  }, [pooledNftFilters])

  return (
    <Tab.Panel id="panel" className={'h-full flex flex-col'}>
      <InventoryToggles
        showFilters={showFilters}
        toggleShowFilters={() => setShowFilters(!showFilters)}
        activeSort={activeSort}
        setActiveSort={setActiveSort}
        SORTINGS={SORTINGS}
      />
      <SplitPane
        left={
          <Filters
            searchString={searchString}
            setSearchString={setSearchString}
            collectionsToFilter={pooledNftFilters}
            setCollectionsToFilter={setPooledNftFilters}
            numFiltersApplied={numFiltersApplied}
          />
        }
        right={<PooledNfts filteredPooledNfts={sortedNfts} pageSize={pageSize} />}
        showLeft={showFilters}
        split="left"
        container="flex flex-col lg:flex-row justify-between overflow-hidden h-full "
        rightStyles="overflow-y-auto h-full"
      />
    </Tab.Panel>
  )
}

export default PooledNftsTab
