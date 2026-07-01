import { useEffect, useState } from 'react'
import PriceFilters from './PriceFilters'

const switchBtn = ' px-[0.375rem] py-[0.1875rem] cursor-pointer '

const SweepModeModalHeader = ({
  setInputValue,
  cartItems,
  details,
  totalNfts,
  currencySwitch,
  updateCurrencySwitch,
  inputValue,
  setMinPriceFilter,
  setMaxPriceFilter,
}) => {
  const [sliderMax, setSliderMax] = useState(0)

  const switchClass = (option) => switchBtn + (option === currencySwitch && ' bg-[#374151] ')

  useEffect(() => {
    let numNftsInCart = cartItems.filter((item) => item.collectionAddress === details.address).length
    setSliderMax(totalNfts - numNftsInCart)
  }, [cartItems, totalNfts])

  return (
    <>
      <div id="title" className="leading-[1.1] tracking-[-.02em] text-[1.25rem] font-semibold text-center">
        Sweep Mode
      </div>
      <div id="control-group" className="px-3 m-[0.1875rem] mt-2">
        <p className="text-center">
          {currencySwitch === 'items' ? 'Select number of NFTs to sweep.' : 'Select amount of BNB to use to sweep.'}
        </p>
        <PriceFilters changeMinPriceFilter={setMinPriceFilter} changeMaxPriceFilter={setMaxPriceFilter} />

        <div className="flex items-center justify-between">
          <div id="number-input" className="flex flex-row items-center my-[0.375rem]">
            <label>Total {currencySwitch === 'items' ? 'items' : 'BNB'}:</label>
            <input
              type="number"
              placeholder={inputValue.toString() || 0}
              value={inputValue || ''}
              min={0}
              step={currencySwitch === 'items' ? 1 : 0.001}
              max={currencySwitch === 'items' ? sliderMax : 100}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-20 font-semibold text-center bg-black rounded-md text-[1.2rem] py-[1px] px-[2px] ml-[0.375rem]"
            ></input>
          </div>

          <div className="flex flex-row items-center overflow-hidden border-2 border-gray-500 rounded-md w-fit">
            <div className={switchClass('items')} onClick={() => updateCurrencySwitch('items')}>
              Items
            </div>
            <div className={switchClass('bnb')} onClick={() => updateCurrencySwitch('bnb')}>
              BNB
            </div>
          </div>
        </div>

        <div id="slider" className="flex flex-row border border-transparent">
          <input
            type="range"
            style={{ accentColor: 'dimgray' }}
            value={inputValue || 0}
            min={0}
            max={currencySwitch === 'items' ? sliderMax : 100} // put user bnb balance here
            step={currencySwitch === 'items' ? 1 : 0.001}
            className="w-full"
            onChange={(e) => setInputValue(e.target.value)}
          ></input>
        </div>
      </div>
    </>
  )
}

export default SweepModeModalHeader
