import { CheckIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import Badge from '../../../Badge'

const PoolTypeFilter = (props) => {
  const [tokenSelected, setTokenSelected] = useState(false)
  const [nftSelected, setNftSelected] = useState(false)
  const [tradeSelected, setTradeSelected] = useState(false)

  useEffect(() => {
    setTokenSelected(props.poolFilters.includes('token'))
    setNftSelected(props.poolFilters.includes('nft'))
    setTradeSelected(props.poolFilters.includes('BUY_AND_SELL'))
  }, [props.poolFilters, setTokenSelected, setNftSelected, setTradeSelected])

  return (
    <div id="type-filter" className="w-full">
      <div id="heading" className="mb-2 text-left">
        Pool Type
      </div>

      <div id="filter-options" className="flex flex-col gap-2">
        <div
          id="filter-option"
          className="w-full p-3 bg-gray-900 rounded cursor-pointer hover:bg-gray-800"
          onClick={() => props.toggleFilter('token')}
        >
          <div id="group-row" className="flex flex-row items-center justify-between">
            <span className="flex flex-row items-center">
              <div id="option-name">Token</div>
              <Badge color="blue" size="default" className="ml-2">
                {props.liqPools && props.liqPools.filter((pool) => pool.poolType === 'SELL').length}
              </Badge>
            </span>
            <div className="w-[17px] h-[17px] bg-black border-2 border-gray-500 rounded-[4px]">
              {tokenSelected && <CheckIcon />}
            </div>
          </div>
        </div>

        <div
          id="filter-option"
          className="w-full p-3 bg-gray-900 rounded cursor-pointer hover:bg-gray-800"
          onClick={() => props.toggleFilter('nft')}
        >
          <div id="group-row" className="flex flex-row items-center justify-between">
            <span className="flex flex-row items-center">
              <div id="option-name">NFT</div>
              <Badge color="blue" size="default" className="ml-2">
                {props.liqPools && props.liqPools.filter((pool) => pool.poolType === 'BUY').length}
              </Badge>
            </span>
            <div className="w-[17px] h-[17px] bg-black border-2 border-gray-500 rounded-[4px]">
              {nftSelected && <CheckIcon />}
            </div>
          </div>
        </div>

        <div
          id="filter-option"
          className="w-full p-3 bg-gray-900 rounded cursor-pointer hover:bg-gray-800"
          onClick={() => props.toggleFilter('BUY_AND_SELL')}
        >
          <div id="group-row" className="flex flex-row items-center justify-between">
            <span className="flex flex-row items-center">
              <div id="option-name">Trade</div>
              <Badge color="blue" size="default" className="ml-2">
                {props.liqPools && props.liqPools.filter((pool) => pool.poolType === 'BUY_AND_SELL').length}
              </Badge>
            </span>
            <div className="w-[17px] h-[17px] bg-black border-2 border-gray-500 rounded-[4px]">
              {tradeSelected && <CheckIcon />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoolTypeFilter
