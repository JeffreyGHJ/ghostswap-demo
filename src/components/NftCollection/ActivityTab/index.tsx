import { useEffect, useState } from 'react'
import { SwapHistoryChart } from '../../Charts/SwapHistoryChart'
import SwapHistoryItem from '../../SwapHistoryItem'
import Toggle from '../../Toggle'
import { ArrowDown, ArrowUp, MoreHorizontal } from 'react-feather'
import { Tab } from '@headlessui/react'

const responsiveContainer = ' w-full mx-auto xs:max-w-[540px] md:max-w-[720px] md2:max-w-[960px] lg3:max-w-[1140px] '
const countBtn = 'cursor-pointer rounded-md px-1 '

const PAGE_SIZE = 10

const ActivityTab = ({ details, collectionActivity }) => {
  const [numPages, setNumPages] = useState(1)
  const [filteredSwaps, setFilteredSwaps] = useState([])
  const [showNewPools, setShowNewPools] = useState(true)
  const [count, setCount] = useState(25)
  const [expandAll, setExpandAll] = useState(null)

  const maxResultValues = [10, 25, 50, 100, 200]

  useEffect(() => {
    let swaps = []
    let launchTime = new Date('2023-03-16T00:00:00').getTime()
    let filters = ['SWAP_NFT_IN_POOL', 'SWAP_NFT_OUT_POOL']
    if (showNewPools) filters.push('NEW_POOL')

    swaps = collectionActivity.filter((swap) => {
      let swapTime = new Date(+swap.timestamp).getTime() * 1000
      if (swapTime < launchTime) return false
      if (!filters.includes(swap.eventType)) return false
      return true
    })

    setFilteredSwaps(swaps.slice(0, count))
  }, [collectionActivity, showNewPools, count])

  return (
    <Tab.Panel id="panel" /*className={'h-full flex flex-col'}*/>
      <div id="swap-history" className={responsiveContainer}>
        <div className="flex items-center gap-1 ml-2 ts-3">
          Show new pools
          <Toggle isActive={showNewPools} toggle={() => setShowNewPools(!showNewPools)} />
        </div>
        <div className="p-3 mt-3 mb-6 rounded-md bg-dark-800">
          {filteredSwaps?.length > 0 && (
            <div id="graph-container" className="w-full p-3 rounded-md bg-dark-900 text-[20px] mb-3 h-[20rem]">
              <SwapHistoryChart swaps={filteredSwaps} />
            </div>
          )}

          {filteredSwaps.length > 0 && (
            <div id="history-controls" className="flex justify-between mb-3">
              <div id="max-results" className="flex items-center select-none gap-x-1">
                <div id="label" className="ts-3">
                  Max results
                </div>
                <div id="result-options" className="flex px-1 p-[.2rem] border rounded text-pink border-blue gap-x-2">
                  {maxResultValues.map((value, index) => (
                    <div
                      key={index}
                      className={countBtn + (count === value ? 'bg-dark-500' : '')}
                      onClick={() => setCount(value)}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>

              <ToggleExpandAll expandAll={expandAll} setExpandAll={setExpandAll} />
            </div>
          )}

          {!filteredSwaps && (
            <div id="loading-swaps-message" className="w-full text-center text-[15px] text-gray-500">
              Loading Activity...
            </div>
          )}
          {filteredSwaps?.length < 1 && (
            <div id="empty-swaps-message" className="w-full text-center text-[15px] text-gray-500">
              No activity yet.
            </div>
          )}
          {filteredSwaps?.length > 0 && (
            <>
              <div id="swap-history-item-list" className="flex flex-col gap-[6px]">
                {filteredSwaps.slice(0, PAGE_SIZE * numPages).map((item, index) => (
                  <SwapHistoryItem key={index} item={item} expandAll={expandAll} setExpandAll={setExpandAll} />
                ))}
              </div>
              <div className="relative flex items-center justify-center w-full gap-4 pt-4 h-[56px]">
                <div className="absolute right-0">
                  <ToggleExpandAll expandAll={expandAll} setExpandAll={setExpandAll} />
                </div>
                {numPages > 1 && (
                  <div
                    className="w-32 px-3 py-2 text-center bg-indigo-500 border border-black rounded-md cursor-pointer hover:bg-indigo-800 ts-3"
                    onClick={() => {
                      setNumPages(1)
                      setExpandAll(false)
                    }}
                  >
                    Collapse
                  </div>
                )}
                {numPages * PAGE_SIZE < filteredSwaps.length && (
                  <div
                    className="w-32 px-3 py-2 text-center bg-indigo-500 border border-black rounded-md cursor-pointer hover:bg-indigo-800 ts-3"
                    onClick={() => {
                      setNumPages(numPages + 1)
                      // setExpandAll(null)
                    }}
                  >
                    Load More
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Tab.Panel>
  )
}

const ToggleExpandAll = ({ expandAll, setExpandAll }) => {
  return (
    <div
      id="toggle-expand-all"
      className="relative flex items-center justify-center w-6 text-gray-500 cursor-pointer hover:text-gray-400"
      onClick={() => setExpandAll(!expandAll)}
    >
      <div className={'absolute flex gap-y-[2px] ' + (expandAll === true ? 'flex-col' : 'flex-col-reverse')}>
        <ArrowDown size={10} />
        <ArrowUp size={10} />
      </div>
      <div className="absolute flex">
        <MoreHorizontal size={12} className="mx-[-2.5px]" />
        <MoreHorizontal size={12} className="mx-[-2.5px]" />
      </div>
    </div>
  )
}

export default ActivityTab
