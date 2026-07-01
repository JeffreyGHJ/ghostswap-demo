import { ChevronUpIcon } from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import {useSelector } from 'react-redux'
import StakePoolGrid from './StakingPoolsGridView'
import StakePoolList from './StakingPoolsListView'
import ViewSwitch from './ViewSwitch'

//total, totalStaked

const StakingPools = (props) => {
  const [viewMode, setViewMode] = useState('grid')
  const ref = useRef<HTMLDivElement | null>(null)
  const stakePools = useSelector((state: any) => state.stakePools.pools)

  return (
    <div ref={ref}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-end w-full pb-5">
          <div className="flex justify-end">
            <ViewSwitch viewMode={viewMode} updateViewMode={setViewMode} />
          </div>
        </div>
      </div>
      {viewMode === 'list' ? (
        <div>
          <StakePoolList stakePools={stakePools} />
          {/* <div className="flex items-center justify-center mt-3 text-xl">
            <button onClick={() => setViewMode('grid')}>
              <div className="flex items-center px-2">
                <div>Featured</div>
                <div className="text-2xl">
                  <ChevronUpIcon />
                </div>
              </div>
            </button>
          </div> */}
        </div>
      ) : (
        <div>
          <StakePoolGrid stakePools={stakePools} />
          {/* <div className="flex items-center justify-center mt-3 text-xl">
            <button onClick={() => setView('list')}>
              <div className="flex items-center px-2">
                <div>See all</div>
                <div className="text-2xl">
                <ChevronUpIcon />
                </div>
              </div>
            </button>
          </div> */}
        </div>
      )}
    </div>
  )
}

export default StakingPools
