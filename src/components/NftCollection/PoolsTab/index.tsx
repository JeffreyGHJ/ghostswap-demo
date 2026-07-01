import { useEffect, useState } from 'react'
import BondingCurveFilters from './BondingCurveFilters'
import PoolCard from '../../PoolCard'
import PoolTypeFilters from './PoolTypeFilters'
import PriceFilters from './PriceFilters'
import SplitPane from '../../SplitPane'
import Toggle from '../../Toggle'
import { countEmptyPools, filterPools, sortPools } from '../../../functions/poolCards'
import { Tab } from '@headlessui/react'

const PoolsTab = (props: any) => {
  const [poolFilters, setPoolFilters] = useState([])
  const [minPriceFilter, setMinPriceFilter] = useState('')
  const [maxPriceFilter, setMaxPriceFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [hideEmpty, setHideEmpty] = useState(true)
  const [numEmpty, setNumEmpty] = useState(0)

  const toggleFilter = (filterName: string) => {
    let filters = [...poolFilters]
    filters.includes(filterName) ? filters.splice(poolFilters.indexOf(filterName), 1) : filters.push(filterName)
    setPoolFilters(filters)
  }

  useEffect(() => {
    if (props?.liqPools?.length > 0) setNumEmpty(countEmptyPools(props.liqPools))
  }, [props.liqPools])

  const filters = (
    <div id="controls-container" className="w-full pt-1 px-3 lg:px-0 lg:h-full h-[15rem]">
      <div className="flex flex-col h-full overflow-y-auto">
        <div id="hide-empty" className="flex items-center lg:justify-start justify-center gap-2 text-[15px] py-2">
          <div className="ts-[thin]">Hide Empty Pools</div>
          <Toggle id="hidden-pools-toggle" isActive={hideEmpty} toggle={() => setHideEmpty(!hideEmpty)} />
        </div>
        <div id="controls" className="flex flex-col h-full gap-4">
          <PriceFilters
            changeMaxPriceFilter={(val) => setMaxPriceFilter(val)}
            changeMinPriceFilter={(val) => setMinPriceFilter(val)}
          />
          <PoolTypeFilters liqPools={props.liqPools} toggleFilter={toggleFilter} poolFilters={poolFilters} />
          <BondingCurveFilters liqPools={props.liqPools} toggleFilter={toggleFilter} poolFilters={poolFilters} />
        </div>
      </div>
    </div>
  )

  const poolCards = (
    <>
      {props?.liqPools?.length > 0 && (
        <div
          id="pools-grid"
          className="grid w-full grid-cols-1 gap-4 p-3 lg2:grid-cols-2 3xl:grid-cols-3 5xl:grid-cols-4"
        >
          {props.liqPools &&
            props.liqPools
              .filter((pool) => filterPools(pool, poolFilters, minPriceFilter, maxPriceFilter, hideEmpty))
              .sort(sortPools)
              .map((pool, index) => <PoolCard {...pool} key={index} {...pool} link={true} />)}{' '}
        </div>
      )}
      {props?.liqPools?.length === numEmpty && props?.liqPools?.length > 0 && hideEmpty === true && (
        <>
          <div className="pt-8 text-center">
            Hiding {numEmpty} Empty Pool{numEmpty === 1 ? '' : 's'}
          </div>

          <div className="text-blue pt-2 text-[12px] w-fit cursor-pointer m-auto" onClick={() => setHideEmpty(false)}>
            click here to unhide empty pools
          </div>
        </>
      )}
      {(!props.liqPools || props?.liqPools?.length === 0) && (
        <div className="pt-8 text-center">No Pools Have Been Created Yet</div>
      )}
    </>
  )

  return (
    <Tab.Panel id="panel" /*className={'h-full flex flex-col'}*/>
      <div id="filters-toggle" className="flex w-full gap-2 lg:justify-start justify-center text-[15px] lg:pl-4">
        <div className="ts-[thin]">Show Filters</div>
        <Toggle isActive={showFilters} toggle={() => setShowFilters(!showFilters)} />
      </div>
      <div id="pools-view" className="flex flex-row sm:px-2 md:px-4">
        <SplitPane
          left={filters}
          right={poolCards}
          showLeft={showFilters}
          split="left"
          container="flex flex-1 flex-col lg:flex-row justify-between pb-2"
        />
      </div>
    </Tab.Panel>
  )
}

export default PoolsTab
