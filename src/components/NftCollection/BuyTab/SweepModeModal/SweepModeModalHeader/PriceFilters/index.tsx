import { useRef } from 'react'

const inputs = 'flex flex-row justify-between w-full gap-2 text-gray-400 leading-[1.5rem] text-[.95rem]'

const PriceFilters = ({ changeMinPriceFilter, changeMaxPriceFilter }) => {
  const maxPriceRef = useRef(null)
  const minPriceRef = useRef(null)

  return (
    <div id="price-filters" className="w-full py-1">
      <div className={inputs}>
        <div id="input-container" className="max-w-xs">
          <input
            id="min-price"
            ref={minPriceRef}
            type="number"
            step="0.1"
            min="0"
            placeholder="Min Price (BNB)"
            className="w-full px-2 py-1 pr-0 bg-black border-2 border-gray-800 rounded-lg"
            onChange={() => changeMinPriceFilter(minPriceRef.current.value)}
          ></input>
        </div>

        <div id="input-container" className="max-w-xs">
          <input
            id="max-price"
            ref={maxPriceRef}
            type="number"
            step="0.1"
            min="0"
            placeholder="Max Price (BNB)"
            className="w-full px-2 py-1 pr-0 bg-black border-2 border-gray-800 rounded-lg"
            onChange={() => changeMaxPriceFilter(maxPriceRef.current.value)}
          ></input>
        </div>
      </div>
    </div>
  )
}

export default PriceFilters
