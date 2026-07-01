import { useEffect, useState } from 'react'
import useDefinedApi from '../../../hooks/useDefinedApi'
import { SwapHistoryChart } from '../../Charts/SwapHistoryChart'
import SwapHistoryItem from '../../SwapHistoryItem'
import axios from 'axios'
import Web3 from 'web3'
import { calculateFees, calculateNftsBought, calculateNftsSold } from '../functions'

const PAGE_SIZE = 10

const btn =
  'w-32 px-3 py-2 text-center bg-indigo-500 border border-black rounded-md cursor-pointer hover:bg-indigo-800 ts-3'

const SwapHistory = ({ poolDetails, poolAddress }) => {
  const [swapHistory, setSwapHistory] = useState(null)
  const [nftsBought, setNftsBought] = useState(0)
  const [nftsSold, setNftsSold] = useState(0)
  const [volume, setVolume] = useState(0)
  const [fees, setFees] = useState(0)
  const [numPages, setNumPages] = useState(1)
  const { getNftPoolEvents } = useDefinedApi()

  useEffect(() => {
    getNftPoolEvents(poolDetails.collectionAddress, poolAddress, setSwapHistory, axios.CancelToken.source())
  }, [])

  useEffect(() => {
    setNftsBought(calculateNftsBought(swapHistory))
    setNftsSold(calculateNftsSold(swapHistory))
    setVolume(+(+Web3.utils.fromWei(poolDetails.volumeAllTimeNBT)).toFixed(3))
    setFees(calculateFees(swapHistory))
  }, [swapHistory, poolDetails])

  return (
    <div id="swap-history" className="w-full p-3 duration-1000 rounded-md bg-dark-800">
      <div id="heading" className="w-full text-[1.45rem] text-center font-bold mb-3 ts-[.02rem]">
        Swap History
      </div>
      <SwapHistoryStats
        poolDetails={poolDetails}
        nftsBought={nftsBought}
        nftsSold={nftsSold}
        volume={volume}
        fees={fees}
      />
      {swapHistory?.length > 0 && (
        <div id="graph-container" className="w-full p-3 rounded-md bg-dark-900 text-[20px] mb-[3rem] h-[20rem]">
          <SwapHistoryChart swaps={swapHistory} />
        </div>
      )}

      {!swapHistory && (
        <div id="empty-swaps-message" className="w-full text-center text-[15px] text-gray-500 mt-2">
          Loading Swap History...
        </div>
      )}
      {swapHistory?.length < 1 && (
        <div id="empty-swaps-message" className="w-full text-center text-[15px] text-gray-500 mt-2">
          No swaps yet with this pool
        </div>
      )}
      {swapHistory?.length > 0 && (
        <>
          <div id="swap-history-item-list" className="flex flex-col gap-[6px]">
            {swapHistory.slice(0, 10 * numPages).map((swap, index) => (
              <SwapHistoryItem key={index} item={swap} poolDetails={poolDetails} />
            ))}
          </div>
          <div className="flex items-center justify-center w-full gap-4 pt-4">
            {numPages > 1 && (
              <div className={btn} onClick={() => setNumPages(1)}>
                Collapse
              </div>
            )}
            {numPages * PAGE_SIZE < swapHistory.length && (
              <div className={btn} onClick={() => setNumPages(numPages + 1)}>
                Load More
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const statBadge = 'flex items-center px-6 py-3 rounded-full bg-dark-900 whitespace-nowrap'
const SwapHistoryStats = ({ poolDetails, nftsBought, nftsSold, volume, fees }) => {
  return (
    <div id="stats" className="w-full flex flex-wrap items-center justify-center gap-3 text-[.9rem] ts-[.02rem] pb-3">
      <div id="volume" className={statBadge}>
        Volume:
        <img src={'/images/tokens/bnb-icon.png'} width={16} height={16} className="mx-1" />
        {(+volume).toFixed(3)}
      </div>
      {poolDetails.poolType === 'BUY_AND_SELL' && (
        <div id="fees" className={statBadge}>
          Fees:
          <img src={'/images/tokens/bnb-icon.png'} width={16} height={16} className="mx-1" />
          {fees?.toFixed(5)}
        </div>
      )}
      {poolDetails.poolType !== 'SELL' && (
        <div id="nfts-sold" className={statBadge}>
          NFTs Sold: {nftsSold}
        </div>
      )}
      {poolDetails.poolType !== 'BUY' && (
        <div id="nfts-bought" className={statBadge}>
          NFTs Bought: {nftsBought}
        </div>
      )}
    </div>
  )
}

export default SwapHistory
