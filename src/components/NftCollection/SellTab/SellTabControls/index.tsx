import Badge from '../../../Badge'
import Toggle from '../../../Toggle'
import SortDropdown from '../../BuyTab/BuyTabControls/SortDropdown'

const sellTabControls = 'flex w-full pl-[.2rem] md:pl-[.5rem] pr-[.2rem] md:pr-[0.5rem]'
const filterControls = 'flex flex-col justify-start w-full gap-1 md:p-0'
const spinner = 'w-5 h-5 rounded-full border-[3px] border-dark-800 border-b-[#2181e7] animate-spin'
const clear = 'flex px-2 py-[.1rem] text-secondary rounded-md bg-[#264A8A4D] cursor-pointer gap-1 text-[14px] w-fit'

const SellTabControls = ({
  assets,
  sellTabMetaInitialized,
  showFilters,
  setShowFilters,
  numFiltersApplied,
  clearFilters,
  activeSort,
  setActiveSort,
  SORTINGS,
}) => {
  return (
    <div className={sellTabControls}>
      <div className={filterControls}>
        {sellTabMetaInitialized && (
          <div className="flex w-full gap-2 ts-3 text-[14px] sm:text-[16px]">
            Show Trait Filters
            <Toggle isActive={showFilters} toggle={() => setShowFilters(!showFilters)} />
          </div>
        )}

        {assets?.length > 0 && !sellTabMetaInitialized && (
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

      <SortDropdown activeSort={activeSort} setActiveSort={setActiveSort} SORTINGS={SORTINGS} />
    </div>
  )
}

export default SellTabControls
