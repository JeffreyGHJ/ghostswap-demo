import { CheckIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import Badge from '../../../Badge'

const filters = ' flex flex-col gap-1 mx-1 lg:mx-0 overflow-y-auto px-1 pb-2 '

const Filters = ({ collections, currentCollection, setCollection, setSearchString, searchString }) => {
  const displayFilters = () => {
    let toDisplay = []
    Array.from(collections.keys()).map((tokenAddress) => {
      let values = collections.get(tokenAddress)
      if (!searchString || values.name.toLowerCase().includes(searchString.toLowerCase()))
        toDisplay.push({ tokenAddress, ...values })
    })
    return toDisplay.map((collection, index) => (
      <FilterOption
        key={index}
        collectionAddress={collection.tokenAddress}
        collectionName={collection.name}
        count={collection.tokenIds.length}
        isSelected={currentCollection === collection.tokenAddress}
        setCollection={setCollection}
      />
    ))
  }

  return (
    <div id="control-group-col" className="flex flex-col h-full overflow-auto">
      <div className="w-full p-[0.1875rem]">
        <input
          id="collection-search"
          placeholder="Search collection"
          className="w-full text-[0.9375rem] rounded-md border-2 border-gray-800 bg-black py-2 pl-3 leading-[1.5]"
          onChange={(e) => setSearchString(e.target.value)}
        />
      </div>

      <div id="collection-filters" className={filters}>
        {displayFilters()}
      </div>
    </div>
  )
}

const FilterOption = ({ collectionAddress, collectionName, count, isSelected, setCollection }) => {
  return (
    <div
      id="filter-option"
      className="w-full p-3 bg-gray-900 rounded cursor-pointer hover:bg-gray-800"
      onClick={() => setCollection(collectionAddress)}
    >
      <div id="group-row" className="flex flex-row items-center justify-between">
        <div className="flex items-center w-full overflow-hidden overflow-ellipsis">
          <div className="pr-2 overflow-hidden overflow-ellipsis whitespace-nowrap">{collectionName}</div>
          <Badge color="blue" size="default">
            {count}
          </Badge>
        </div>

        <div className="w-[17px] h-[17px] bg-black border-2 border-gray-500 rounded-[4px] ml-1 flex-none">
          {isSelected && <CheckIcon />}
        </div>
      </div>
    </div>
  )
}

export default Filters
