import { Menu } from '@headlessui/react'
import Badge from '../../../Badge'
import Toggle from '../../../Toggle'
import { ArrowTooltipBordered as Tooltip } from '../../../Tooltip'
import SortDropdown from './SortDropdown'

const buyTabControls =
  'flex flex-wrap justify-between whitespace-nowrap w-full pl-[.2rem] md:pl-[.5rem] pr-[.2rem] md:pr-[.5rem]'
// const buyTabControls = 'flex w-full pl-[.2rem] md:pl-[.5rem] pr-[.2rem] md:pr-[10rem] lg:pr-[20rem]'
const filterControls = 'flex flex-col justify-start gap-1 md:p-0'
const spinner = 'w-5 h-5 rounded-full border-[3px] border-dark-800 border-b-[#2181e7] animate-spin'
const clear = 'flex px-2 py-[.1rem] text-secondary rounded-md bg-[#264A8A4D] cursor-pointer gap-1 text-[14px] w-fit'
const sweepBtnContainer = 'flex justify-center mb-3 md:justify-end max-w-[1140px]'
const sweepModeBtn = ' px-3 py-2 bg-gray-700 border border-black rounded-md hover:border-gray-700 text-[15px] '

const BuyTabControls = ({
  filtersReady,
  showFilters,
  setShowFilters,
  numFiltersApplied,
  clearFilters,
  show,
  setShow,
  purchasableNfts,
  setModalIsOpen,
  activeSort,
  setActiveSort,
  SORTINGS,
  traitsMap,
}) => {
  return (
    <div className={buyTabControls}>
      <div className={filterControls}>
        {filtersReady && traitsMap?.size > 0 && (
          <div className="flex w-full gap-2 ts-3 text-[14px] sm:text-[16px]">
            Show Trait Filters
            <Toggle isActive={showFilters} toggle={() => setShowFilters(!showFilters)} />
          </div>
        )}

        {purchasableNfts?.length > 0 && !filtersReady && (
          <div className="flex items-center w-full gap-2 ts-3 text-[14px] sm:text-[16px]">
            Loading Filters...
            <div className={spinner} />
          </div>
        )}

        <div className={clear + (numFiltersApplied > 0 ? '' : ' invisible')} onClick={() => clearFilters()}>
          Clear Filters
          <Badge color="pink" size="small">
            {numFiltersApplied}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap">
        <div className={sweepBtnContainer} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
          <Tooltip show={show} content={'Quickly add the cheapest items to your cart'} placement="top">
            <button className={sweepModeBtn} onClick={() => setModalIsOpen(true)}>
              {'Sweep Mode 🧹'}
            </button>
          </Tooltip>
        </div>
        <SortDropdown activeSort={activeSort} setActiveSort={setActiveSort} SORTINGS={SORTINGS} />
      </div>
    </div>
  )
}

export default BuyTabControls
