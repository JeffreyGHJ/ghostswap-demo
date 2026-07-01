import { CheckIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import Badge from '../../Badge'
import { toggleAllFilters, toggleFilter } from '../functions'

const filters = ' flex flex-col gap-1 mx-1 lg:mx-0 overflow-y-auto px-1 pb-2 '

const Filters = ({
  collectionsToFilter,
  setSearchString,
  searchString,
  numFiltersApplied,
  setCollectionsToFilter,
  showOffers = null,
}) => {
  const [filterOptions, setFilterOptions] = useState([])

  useEffect(() => {
    let filterOps = []

    Array.from(collectionsToFilter.keys()).map((tokenAddress) => {
      tokenAddress = tokenAddress.toString().toLowerCase()
      let values = collectionsToFilter.get(tokenAddress)

      if (showOffers === true && values?.offer === null) {
        console.log('excluding collection: ', values)
        return
      }
      // console.log(values)
      if (!searchString || values.name.toLowerCase().includes(searchString.toLowerCase())) {
        let filterOption = { tokenAddress, ...values }
        filterOps.push(filterOption)
      }
    })
    // console.log(filterOps)
    setFilterOptions(filterOps)
  }, [collectionsToFilter, searchString, showOffers])

  return (
    <div className="max-h-[16rem] lg:max-h-full overflow-auto lg:pl-3 pl-0">
      <div id="control-group-col" className="flex flex-col h-full overflow-auto">
        <div
          className="flex text-[14px] w-fit px-2 gap-x-1 ml-1 py-[.2rem] select-none items-center text-[#b6b4b4e9] justify-center rounded-md bg-blue hover:bg-opacity-70 bg-opacity-30 cursor-pointer gap-1"
          onClick={() => toggleAllFilters(collectionsToFilter, numFiltersApplied, setCollectionsToFilter)}
        >
          {numFiltersApplied > 0 ? 'Deselect all' : 'Select all'}
          {numFiltersApplied > 0 && (
            <Badge color="pink" size="small">
              {numFiltersApplied}
            </Badge>
          )}
        </div>
        <div className="w-full p-[0.1875rem]">
          <input
            id="collection-search"
            value={searchString.length ? searchString : ''}
            placeholder="Search collection"
            className="w-full text-[0.9375rem] rounded-md border-2 border-gray-800 bg-black py-2 pl-3 leading-[1.5]"
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>

        <div id="collection-filters" className={filters}>
          {filterOptions.map((filterOption, index) => (
            <FilterOption
              key={index}
              collectionName={filterOption.name}
              count={filterOption.count}
              isFiltered={filterOption.isFiltered}
              toggleFilter={() => toggleFilter(filterOption.tokenAddress, collectionsToFilter, setCollectionsToFilter)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const FilterOption = ({ collectionName, count, isFiltered, toggleFilter }) => {
  return (
    <div
      id="filter-option"
      className="w-full p-3 bg-gray-900 rounded cursor-pointer hover:bg-gray-800"
      onClick={() => toggleFilter()}
    >
      <div id="group-row" className="flex flex-row items-center justify-between">
        <div className="flex items-center w-full overflow-hidden overflow-ellipsis">
          <div className="pr-2 overflow-hidden overflow-ellipsis whitespace-nowrap">{collectionName}</div>
          <Badge color="blue" size="default">
            {count}
          </Badge>
        </div>

        <div className="w-[17px] h-[17px] bg-black border-2 border-gray-500 rounded-[4px] ml-1 flex-none">
          {isFiltered && <CheckIcon />}
        </div>
      </div>
    </div>
  )
}

export default Filters
