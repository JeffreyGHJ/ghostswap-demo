import router from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Search } from 'react-feather'
import { useSelector } from 'react-redux'
import Web3 from 'web3'
import Toggle from '../Toggle'
import CollectionListEntry from './CollectionListEntry'
import * as filters from './filters'
import { applySort } from './functions'

const PAGE_SIZE = 100

const NftMarket = () => {
  const searchBarRef = useRef(null)
  const [numPages, setNumPages] = useState(1)
  const [searchString, setSearchString] = useState(searchBarRef.current?.value || '')
  const [timeFilter, setTimeFilter] = useState('All')
  const [currencyFilter, setCurrencyFilter] = useState('USD')

  const collections = useSelector((state: any) => state.nftMarket.collections)
  const collectionsWithActivity = useSelector((state: any) => state.nftMarket.activeCollections)

  const [showCollectionsWithActivity, setShowCollectionsWithActivity] = useState(true)
  const [showAggregateVolume, setShowAggregateVolume] = useState(false)
  const [filteredListings, setFilteredListings] = useState(collectionsWithActivity || [])
  const [searchResult, setSearchResult] = useState([])
  const [initialized, setInitialized] = useState(false)

  const [sort, setSort] = useState({ col: 1, mode: 'asc' })

  useEffect(() => {
    if (collectionsWithActivity.length > 1 && !initialized) {
      setFilteredListings([...collectionsWithActivity].sort(filters.byVolumeAsc))
      setInitialized(true)
    }
  }, [collectionsWithActivity])

  useEffect(() => {
    if (!showAggregateVolume || showCollectionsWithActivity) setFilteredListings(collectionsWithActivity)
    else setFilteredListings(collections)
  }, [showAggregateVolume, showCollectionsWithActivity])

  const changeSort = (colNum) => {
    if (colNum !== sort.col) setSort({ col: colNum, mode: 'asc' })
    else if (sort.mode === 'asc') setSort({ col: sort.col, mode: 'desc' })
    else if (sort.mode === 'desc') setSort({ col: 1, mode: 'asc' })
    // default back to asc volume
    else setSort({ col: sort.col, mode: 'asc' })
  }

  useEffect(() => {
    applySort(sort, filteredListings, showAggregateVolume, timeFilter, currencyFilter, setFilteredListings)
  }, [sort, showAggregateVolume, filteredListings.length, timeFilter, currencyFilter])

  const handleSearchChange = () => {
    if (Web3.utils.isAddress(searchBarRef.current.value)) {
      router.push(`/nftamm/collection/${searchBarRef.current.value}`).then((r) => console.log('search done'))
    } else {
      setSearchString(searchBarRef.current.value)
    }
  }

  useEffect(() => {
    if (searchString.length > 0) {
      const timeout = setTimeout(() => {
        let searchResult = filteredListings
        searchResult = searchResult.filter((listing: any) =>
          listing.name.toLowerCase().includes(searchString.toLowerCase())
        )
        setSearchResult(searchResult)
      }, 150)

      return () => clearTimeout(timeout)
    }
  }, [searchString])

  return (
    <>
      <div id="nft-market-page" className="flex flex-col items-center justify-center w-full">
        <div id="page-content" className="flex flex-col items-center px-1 justify-center sm:px-4 max-w-[1200px] w-full">
          <div id="heading" className="text-[36px] w-full px-2 sm:px-0 text-center sm:text-left">
            Trending NFT Collections
          </div>

          <div className="flex items-center justify-start w-full pl-1 mb-2 gap-x-2">
            <div>show aggregate volume data</div>
            <Toggle isActive={showAggregateVolume} toggle={() => setShowAggregateVolume(!showAggregateVolume)} />
          </div>

          {showAggregateVolume && (
            <>
              <Filters
                timeFilter={timeFilter}
                currencyFilter={currencyFilter}
                handleCurrencyFilterChange={(filterValue) => setCurrencyFilter(filterValue)}
                handleTimeFilterChange={(filterValue) => setTimeFilter(filterValue)}
              />

              <div className="flex items-center justify-center w-full gap-2 mt-2 mb-2 sm:justify-start">
                <div>Only show collections with activity</div>
                <Toggle
                  isActive={showCollectionsWithActivity}
                  toggle={() => setShowCollectionsWithActivity(!showCollectionsWithActivity)}
                />
              </div>
            </>
          )}

          <SearchBar searchBarRef={searchBarRef} handleSearchChange={handleSearchChange} />

          <div
            id="table-container"
            className="w-full overflow-hidden border border-gray-600 rounded bg-dark-950 shadow-light-glow"
          >
            <table id="nft-collections-list" className="w-full border-collapse ">
              <thead className="text-right text-[14px] text-gray-400 border-b select-none border-b-gray-600 tracking-[-.03em]">
                <tr>
                  <th className="py-3 pl-6 text-left sm:pl-10 w-[380] md:w-[340px] lg:w-[420px]">
                    <div className="flex items-center justify-start">
                      <div>Collection Name</div>
                    </div>
                  </th>

                  <th className="py-3 pr-5 sm:pr-0" onClick={() => changeSort(1)}>
                    <div className="flex items-center justify-end">
                      <div className={'flex cursor-pointer hover:text-white ' + (sort.col === 1 ? 'text-white' : '')}>
                        <ColumnSort sortedCol={sort.col} mode={sort.mode} col={1} />
                        {showAggregateVolume && <div>{timeFilter} Vol.</div>}
                        {!showAggregateVolume && <div>Volume</div>}
                      </div>
                    </div>
                  </th>

                  <th className="hidden py-3 md:table-cell" onClick={() => changeSort(2)}>
                    <div className="flex justify-end">
                      <div className={'flex cursor-pointer hover:text-white ' + (sort.col === 2 ? 'text-white' : '')}>
                        <ColumnSort sortedCol={sort.col} mode={sort.mode} col={2} />
                        {showAggregateVolume && <div>{timeFilter} Trades</div>}
                        {!showAggregateVolume && <div>Highest Offer</div>}
                      </div>
                    </div>
                  </th>

                  <th className="hidden py-3 pr-5 md:pr-0 sm:table-cell" onClick={() => changeSort(3)}>
                    <div className="flex justify-end">
                      <div className={'flex cursor-pointer hover:text-white ' + (sort.col === 3 ? 'text-white' : '')}>
                        <ColumnSort sortedCol={sort.col} mode={sort.mode} col={3} />
                        {showAggregateVolume && <div>Volume</div>}
                        {!showAggregateVolume && <div>Floor Price</div>}
                      </div>
                    </div>
                  </th>
                  <th className="hidden py-3 pr-5 lg:pr-0 md:table-cell" onClick={() => changeSort(4)}>
                    <div className="flex justify-end">
                      <div className={'flex cursor-pointer hover:text-white ' + (sort.col === 4 ? 'text-white' : '')}>
                        <ColumnSort sortedCol={sort.col} mode={sort.mode} col={4} />
                        <div>Trades</div>
                      </div>
                    </div>
                  </th>
                  <th className="hidden py-3 pr-5 lg:table-cell" onClick={() => changeSort(5)}>
                    <div className="flex justify-end ">
                      <div className={'flex cursor-pointer hover:text-white ' + (sort.col === 5 ? 'text-white' : '')}>
                        <ColumnSort sortedCol={sort.col} mode={sort.mode} col={5} />
                        <div>Holders</div>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchString.length < 1 &&
                  filteredListings.length > 0 &&
                  filteredListings
                    .slice(0, PAGE_SIZE * numPages)
                    .map(
                      (listing: any, index: number) =>
                        +listing.rank > 0 && (
                          <CollectionListEntry
                            key={index + ':' + listing.rank}
                            index={index + 1}
                            timeFilter={timeFilter}
                            currencyFilter={currencyFilter}
                            showAggregateVolume={showAggregateVolume}
                            {...listing}
                          />
                        )
                    )}
                {searchString.length > 0 &&
                  searchResult
                    .slice(0, PAGE_SIZE * numPages)
                    .map(
                      (listing: any, index: number) =>
                        +listing.rank > 0 && (
                          <CollectionListEntry
                            key={index + ':' + listing.rank}
                            index={index + 1}
                            timeFilter={timeFilter}
                            currencyFilter={currencyFilter}
                            showAggregateVolume={showAggregateVolume}
                            {...listing}
                          />
                        )
                    )}
                {filteredListings.length < 1 && !searchString && (
                  <tr className="w-full font-bold text-center h-[50rem]">
                    <td colSpan={999}>Loading collections...</td>
                  </tr>
                )}
                {searchResult.length < 1 && searchString?.length > 0 && (
                  <tr className="w-full font-bold text-center h-[5rem]">
                    <td colSpan={999}>No collections found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center w-full gap-4 pt-4 pb-4">
            {numPages > 1 && (
              <div
                className="w-32 px-3 py-2 text-center bg-indigo-500 border border-black rounded-md cursor-pointer hover:bg-indigo-800 ts-3"
                onClick={() => setNumPages(1)}
              >
                Collapse
              </div>
            )}
            {numPages * PAGE_SIZE < filteredListings.length && (
              <div
                className="w-32 px-3 py-2 text-center bg-indigo-500 border border-black rounded-md cursor-pointer hover:bg-indigo-800 ts-3"
                onClick={() => setNumPages(numPages + 1)}
              >
                Load More
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const ColumnSort = ({ sortedCol, col, mode }) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-4 h-5 text-blue">
      {sortedCol === col && (
        <>
          {mode === 'asc' && <ChevronUp size={20} strokeWidth={2.5} />}
          {mode === 'desc' && <ChevronDown size={20} strokeWidth={2.5} />}
        </>
      )}
    </div>
  )
}

const Filters = (props) => {
  return (
    <div
      id="filters"
      className="flex flex-wrap items-center justify-center w-full gap-6 mt-6 mb-2 font-bold xs:justify-between"
    >
      <div id="time-filter" className="flex p-1 border border-gray-600 rounded-2xl">
        <div
          style={{ backgroundColor: props.timeFilter === '1d' ? 'rgba(75, 85, 99)' : '' }}
          className="px-3 py-2 cursor-pointer rounded-xl"
          onClick={() => props.handleTimeFilterChange('1d')}
        >
          1D
        </div>
        <div
          style={{ backgroundColor: props.timeFilter === '1w' ? 'rgba(75, 85, 99)' : '' }}
          className="px-3 py-2 cursor-pointer rounded-xl"
          onClick={() => props.handleTimeFilterChange('1w')}
        >
          1W
        </div>
        <div
          style={{ backgroundColor: props.timeFilter === '1m' ? 'rgba(75, 85, 99)' : '' }}
          className="px-3 py-2 cursor-pointer rounded-xl"
          onClick={() => props.handleTimeFilterChange('1m')}
        >
          1M
        </div>
        <div
          style={{ backgroundColor: props.timeFilter === 'All' ? 'rgba(75, 85, 99)' : '' }}
          className="px-3 py-2 cursor-pointer rounded-xl"
          onClick={() => props.handleTimeFilterChange('All')}
        >
          ALL
        </div>
      </div>
      <div id="price-filter" className="flex p-1 border border-gray-600 rounded-2xl">
        <div
          style={{ backgroundColor: props.currencyFilter === 'BNB' ? 'rgba(75, 85, 99)' : '' }}
          className="px-3 py-2 cursor-pointer rounded-xl"
          onClick={() => props.handleCurrencyFilterChange('BNB')}
        >
          BNB
        </div>
        <div
          style={{ backgroundColor: props.currencyFilter === 'USD' ? 'rgba(75, 85, 99)' : '' }}
          className="px-3 py-2 cursor-pointer rounded-xl"
          onClick={() => props.handleCurrencyFilterChange('USD')}
        >
          USD
        </div>
      </div>
    </div>
  )
}

const SearchBar = (props) => {
  return (
    <div
      id="search-bar"
      className="flex items-center w-full p-[1px] mb-5 bg-gray-600 focus:bg-red rounded hover:bg-gradient-to-r hover:from-blue hover:to-[#8b8bbc] active:bg-gradient-to-r active:from-blue active:to-[#8b8bbc]"
    >
      <div className="flex items-center w-full px-4 py-3 bg-black rounded">
        <Search width={24} height={24} className="text-gray-300 " />
        <input
          ref={props.searchBarRef}
          type="text"
          placeholder="Search collections or enter address"
          className="w-full ml-3 bg-black"
          onChange={() => props.handleSearchChange()}
        ></input>
      </div>
    </div>
  )
}

export default NftMarket
