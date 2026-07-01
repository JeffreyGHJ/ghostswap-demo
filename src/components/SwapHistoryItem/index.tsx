import { useEffect, useState } from 'react'
import { useWindowSize } from '../../hooks/useWindowSize'
import DefaultDetails from './DefaultDetails'
import NewPoolExpanded from './NewPoolExpanded'
import SwapNftExpanded from './SwapNftExpanded'
import NftWithdrawalExpanded from './NftWithdrawalExpanded'
import NftDepositExpanded from './NftDepositExpanded'
import TokenWithdrawalExpanded from './TokenWithdrawalExpanded'
import TokenDepositExpanded from './TokenDepositExpanded'
import PriceUpdateExpanded from './PriceUpdateExpanded'
import DeltaUpdateExpanded from './DeltaUpdateExpanded'
import FeeUpdateExpanded from './FeeUpdateExpanded'
import React from 'react'

const itemContainer =
  'flex flex-wrap justify-center items-center w-full pl-2 md:pl-4 md:pr-2 rounded-md bg-dark-900 gap-4 overflow-hidden h-fit'
const expandedContainer =
  'flex items-start w-full justify-evenly z-[9] md:px-4 py-1 pb-3 overflow-y-auto overflow-x-hidden'

const SwapHistoryItem = ({ item, poolDetails = null, expandAll = null, setExpandAll = null }) => {
  const [expanded, setExpanded] = useState(expandAll !== null ? expandAll : false)
  const { width } = useWindowSize()

  useEffect(() => {
    expandAll === null ? {} : setExpanded(expandAll)
  }, [expandAll])

  return (
    <div id="swap-history-item" className={itemContainer}>
      <div id="item-inner-container" className="flex flex-col w-full h-full">
        <DefaultDetails
          item={item}
          width={width}
          setExpanded={setExpanded}
          expanded={expanded}
          setExpandAll={setExpandAll}
        />

        {expanded && (
          <div id="expanded-details" className={expandedContainer}>
            {item.eventType === 'SWAP_NFT_OUT_POOL' && <SwapNftExpanded item={item} width={width} />}
            {item.eventType === 'SWAP_NFT_IN_POOL' && <SwapNftExpanded item={item} width={width} />}
            {item.eventType === 'NEW_POOL' && <NewPoolExpanded item={item} width={width} />}
            {item.eventType === 'SPOT_PRICE_UPDATE' && <PriceUpdateExpanded item={item} />}
            {item.eventType === 'DELTA_UPDATE' && <DeltaUpdateExpanded item={item} poolDetails={poolDetails} />}
            {item.eventType === 'FEE_UPDATE' && <FeeUpdateExpanded item={item} />}
            {item.eventType === 'TOKEN_DEPOSIT' && <TokenDepositExpanded item={item} />}
            {item.eventType === 'TOKEN_WITHDRAWAL' && <TokenWithdrawalExpanded item={item} />}
            {item.eventType === 'NFT_DEPOSIT' && <NftDepositExpanded item={item} />}
            {item.eventType === 'NFT_WITHDRAWAL' && <NftWithdrawalExpanded item={item} />}
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(SwapHistoryItem)
