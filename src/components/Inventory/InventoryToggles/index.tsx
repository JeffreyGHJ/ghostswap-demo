import SortDropdown from '../../SortDropdown'
import Toggle from '../../Toggle'

const InventoryToggles = ({
  showFilters,
  toggleShowFilters,
  showOffers = null,
  toggleShowOffers = null,
  activeSort,
  setActiveSort,
  SORTINGS,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between px-2 whitespace-nowrap lg:px-4">
      <div id="filters-toggle" className="flex items-center gap-2 lg:justify-between text-[15px] py-[0.375rem]">
        <div className="ts-[thin]">Show Filters</div>
        <Toggle isActive={showFilters} toggle={toggleShowFilters} />
      </div>

      <div className="flex gap-x-2">
        {showOffers !== null && (
          <div id="show-offers-toggle" className="flex items-center gap-2 lg:justify-between text-[15px] py-[0.375rem]">
            <div className="ts-[thin]">Show Offers</div>
            <Toggle isActive={showOffers} toggle={toggleShowOffers} />
          </div>
        )}
        <SortDropdown activeSort={activeSort} setActiveSort={setActiveSort} SORTINGS={SORTINGS} />
      </div>
    </div>
  )
}

export default InventoryToggles
