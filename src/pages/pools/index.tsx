import Link from 'next/link'
import { useEffect, useState } from 'react'
import PoolCard from '../../components/PoolCard'
import Toggle from '../../components/Toggle'
import { useActiveWeb3React } from '../../hooks'
import SplitPane from '../../components/SplitPane'
import PriceFilters from '../../components/NftCollection/PoolsTab/PriceFilters'
import PoolTypeFilters from '../../components/NftCollection/PoolsTab/PoolTypeFilters'
import BondingCurveFilters from '../../components/NftCollection/PoolsTab/BondingCurveFilters'
import { useWindowSize } from '../../hooks/useWindowSize'
import { filterPools, sortPools } from '../../functions/poolCards'
import useDefinedApi from '../../hooks/useDefinedApi'
import useSpaceId from '../../hooks/useSpaceId'
import ForceBnbSwitch from '../../components/ForceBnbSwitch'

const Pools = () => {
  const { account, chainId } = useActiveWeb3React()
  const { getNftPoolsByOwner } = useDefinedApi()
  const [ownedPools, setOwnedPools] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [hideEmpty, setHideEmpty] = useState(true)
  const [poolFilters, setPoolFilters] = useState([])
  const [minPriceFilter, setMinPriceFilter] = useState('')
  const [maxPriceFilter, setMaxPriceFilter] = useState('')

  const toggleFilter = (filterName: string) => {
    let filters = [...poolFilters]
    filters.includes(filterName) ? filters.splice(poolFilters.indexOf(filterName), 1) : filters.push(filterName)
    setPoolFilters(filters)
  }

  useEffect(() => {
    if (!account || chainId !== 56) {
      setOwnedPools([])
      return
    }
    getNftPoolsByOwner(account, setOwnedPools)
  }, [account])

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
          <PoolTypeFilters liqPools={ownedPools} toggleFilter={toggleFilter} poolFilters={poolFilters} />
          <BondingCurveFilters liqPools={ownedPools} toggleFilter={toggleFilter} poolFilters={poolFilters} />
        </div>
      </div>
    </div>
  )

  const poolCards = (
    <div id="pools-grid" className="grid w-full grid-cols-1 gap-4 p-3 lg2:grid-cols-2 3xl:grid-cols-3 5xl:grid-cols-4">
      {ownedPools &&
        ownedPools
          .filter((pool) => filterPools(pool, poolFilters, minPriceFilter, maxPriceFilter, hideEmpty))
          .sort(sortPools)
          .map((pool, index) => <PoolCard {...pool} key={index} {...pool} link={true} />)}
    </div>
  )

  return (
    <ForceBnbSwitch>
      <div id="pools-page" className="w-full h-full overflow-auto">
        <Heading address={account} />
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
      </div>
    </ForceBnbSwitch>
  )
}

const Heading = ({ address }) => {
  const { width } = useWindowSize()
  const { spaceId } = useSpaceId(address)

  return (
    <div id="heading-flex-col" className="flex flex-col items-center justify-center px-3 mb-6 mt-9">
      <div id="pools-title" className="text-[2.5rem] mb-[1.125rem] tracking-[-0.02em] font-bold text-center">
        Pools Overview
      </div>

      <div id="pool-owner" className="flex flex-wrap items-center justify-center w-full gap-4">
        <div className="text-center">
          View all of the pools that
          {width > 500 && <strong className="ts-3 text-pink">{spaceId ? ` ${spaceId} ` : ` ${address} `}</strong>}
          {width <= 500 && (
            <strong className="ts-3 text-pink">
              {spaceId ? ` ${spaceId} ` : ` ${address.slice(0, 6)}...${address.slice(38)} `}
            </strong>
          )}
          provides liquidity for.
        </div>
      </div>

      <Link href="/pools/create">
        <button
          id="create-pool-button"
          className="px-2 py-3 mt-6 tracking-tight border-2 rounded-[.25rem] border-blue bg-blue bg-opacity-60 hover:bg-opacity-100"
        >
          <div style={{ WebkitTextStrokeWidth: 'thin' }}>+ Create New Pool</div>
        </button>
      </Link>
    </div>
  )
}

const skeletonStyles = 'w-full h-[200px] bg-dark-850 rounded-[7px] px-3 animate-pulse-shrink-bg-primary  '
const Skeleton = () => {
  return (
    <div
      id="skeleton-container"
      className="w-full px-3 m-auto max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px]"
    >
      <div id="group-col" className="flex flex-col">
        <div id="skeleton" className={skeletonStyles} />
        <div id="skeleton" className={skeletonStyles + ' mt-[0.375rem]'} />
        <div id="skeleton" className={skeletonStyles + ' mt-[0.375rem]'} />
      </div>
    </div>
  )
}

export default Pools
