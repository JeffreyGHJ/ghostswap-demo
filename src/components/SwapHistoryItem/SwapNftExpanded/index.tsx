import NftListBox from '../../NftListBox'
import Web3 from 'web3'
import PoolAddress from '../PoolAddress'
import { useWindowSize } from '../../../hooks/useWindowSize'
import SwapNftAddress from '../SwapNftAddress'

const SwapNftExpanded = ({ item, width }) => {
  return (
    <>
      {item.eventType === 'SWAP_NFT_OUT_POOL' && (
        <div className="flex flex-col gap-1 w-full max-w-[780px]">
          <div
            id="swap-nft-out"
            className="flex w-full h-[fit] text-[13px] rounded-md bg-dark-1000 px-1 sm:text-[16px]"
          >
            <div id="left" className="w-full max-w-[50%]">
              <div className="text-[#9fcde6] text-center">This pool sent:</div>
              <NftSwapped swap={item} />
            </div>
            <div id="right" className="w-full max-w-[50%]">
              <div className="text-[#9fcde6] text-center">This pool received:</div>
              <TokenSwapped swap={item} />
            </div>
          </div>
          <div className="flex flex-wrap justify-between w-full gap-1">
            <PoolAddress item={item} width={width} isSwap={true} />
            <SwapNftAddress item={item} width={width} />
          </div>

          <div className="flex justify-center text-gray-500 w-full text-[11px] pt-3">
            {new Date(item.timestamp * 1000).toLocaleString()}
          </div>
        </div>
      )}
      {item.eventType === 'SWAP_NFT_IN_POOL' && (
        <div className="flex flex-col w-full gap-1 max-w-[780px]">
          <div
            id="swap-nft-out"
            className="flex gap-2 w-full h-[fit] text-[13px] rounded-md bg-dark-1000 px-1 sm:text-[16px]"
          >
            <div id="left" className="w-full max-w-[50%] pt-1 ">
              <div className="text-[#9fcde6] text-center">This pool sent:</div>
              <TokenSwapped swap={item} />
            </div>
            <div id="right" className="w-full max-w-[50%] pt-1 ">
              <div className="text-[#9fcde6] text-center">This pool received:</div>
              <NftSwapped swap={item} />
            </div>
          </div>
          <div className="flex flex-wrap justify-between w-full gap-1">
            <PoolAddress item={item} width={width} isSwap={true} />
            <SwapNftAddress item={item} width={width} />
          </div>

          <div className="flex justify-center text-gray-500 w-full text-[11px] pt-3">
            {new Date(item.timestamp * 1000).toLocaleString()}
          </div>
        </div>
      )}
    </>
  )
}

const NftSwapped = ({ swap }) => {
  const nftsTransferred = swap.data.nftsTransfered
  return (
    <>
      {nftsTransferred?.length > 0 && (
        <NftListBox
          nfts={nftsTransferred.map((nft) => {
            nft.tokenId = nft.nftTokenId
            nft.tokenAddress = swap.collectionAddress
            return nft
          })}
          listStyle="rowCentered"
          mode="deposited"
          nftSize="small"
        />
      )}
    </>
  )
}
const priceLabel = 'flex items-center text-[18px] sm:text-[30px] ts-4 tracking-tighter font-bold'
const priceAvg =
  'flex items-center text-[14px] sm:text-[16px] bg-black rounded-md p-2 sm:p-3 tracking-tight ts-4 text-center'
const TokenSwapped = ({ swap }) => {
  const nftsTransferred = swap.data.nftsTransfered.length
  return (
    <>
      <div className="flex flex-col items-center justify-center pt-[1.5rem] gap-1">
        <div id="price" className={priceLabel}>
          <img src="/images/tokens/bnb-icon.png" className="w-4 h-4 mr-1 sm:w-7 sm:h-7" />
          {(+Web3.utils.fromWei(String(swap.data.amountT))).toFixed(6)}
        </div>
        <div id="price-average" className={priceAvg}>
          Avg Price: {(+Web3.utils.fromWei(String(swap.data.amountT)) / nftsTransferred).toFixed(6)} BNB per NFT
        </div>
      </div>
    </>
  )
}

export default SwapNftExpanded
