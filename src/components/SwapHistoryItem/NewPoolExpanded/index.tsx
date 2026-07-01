import Web3 from 'web3'
import BondingCurveBadge from '../../BondingCurveBadge'
import PoolAddress from '../PoolAddress'
import PoolOwner from '../PoolOwner'

const poolTypeBadge =
  'rounded-md font-normal text-black px-1 text-[12px] sm:text-[13px] sm:ml-1 h-[18px] items-center flex tracking-[-.02em] '
const NewPoolExpanded = ({ item, width }) => {
  return (
    <div
      className={'flex flex-col items-start w-full gap-1 text-left max-w-[780px]' /* + bg-[#281f43aa] rounded-md p-1*/}
    >
      <PoolDetailsSlim width={width} item={item} />
      <div className="flex w-full gap-1">
        <div id="balance" className="w-full px-3 py-2 overflow-hidden rounded-md bg-dark-1000 ts-1 whitespace-nowrap">
          <div id="title" className="w-full text-[12px] sm:text-[16px] text-[#9fcde6] ts-1">
            Balance:
          </div>
          <div className="flex sm:text-[20px] items-center gap-1 sm:ts-3 w-full">
            <div className="flex items-center gap-1">
              <div className="mr-1">Tokens:</div>
              <Bnb />
              {(+Web3.utils.fromWei(item.data.tokenBalanceT, 'ether')).toFixed(3)}
            </div>
            <div id="separator" className="w-[1px] mx-3 h-[1.5rem] sm:h-[2rem] bg-dark-600" />
            <div className="flex">
              <div className="mr-2">NFTs:</div>
              {item.data.nftTokenBalance}
            </div>
          </div>
        </div>
        <PoolDetailsWide width={width} item={item} />
      </div>

      <div className="flex w-full gap-1">
        <div
          id="start-price"
          className="w-full px-3 py-2 overflow-hidden rounded-md bg-dark-1000 ts-1 whitespace-nowrap"
        >
          <div className="w-full text-[12px] sm:text-[16px] text-[#9fcde6] ts-1">Start Price:</div>
          <div className="flex sm:text-[20px] items-center gap-1 sm:ts-3">
            <Bnb />
            {(+Web3.utils.fromWei(item.data.startPriceT)).toFixed(3) || '-'}{' '}
          </div>
        </div>

        <div id="buy-price" className="w-full px-3 py-2 overflow-hidden rounded-md bg-dark-1000 ts-1 whitespace-nowrap">
          <div className="w-full text-[12px] sm:text-[16px] text-[#9fcde6] ts-1">Buy Price:</div>
          <div className="flex sm:text-[20px] items-center gap-1 sm:ts-3">
            <Bnb />
            {item?.data?.buyPriceT && item.poolType !== 'SELL' ? (
              <>{(+Web3.utils.fromWei(item.data.buyPriceT)).toFixed(3)}</>
            ) : (
              '-'
            )}
          </div>
        </div>

        <div
          id="sell-price"
          className="w-full px-3 py-2 overflow-hidden rounded-md bg-dark-1000 ts-1 whitespace-nowrap "
        >
          <div className="w-full text-[12px] sm:text-[16px] text-[#9fcde6] ts-1">Sell Price:</div>
          <div className="flex sm:text-[20px] items-center gap-1 sm:ts-3">
            <Bnb />
            {item?.data?.sellPriceT && item.poolType !== 'BUY' ? (
              <div>{(+Web3.utils.fromWei(item.data.sellPriceT)).toFixed(3)}</div>
            ) : (
              '-'
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between w-full gap-1">
        <PoolAddress item={item} width={width} />
        <PoolOwner item={item} width={width} />
      </div>

      <div className="flex justify-center text-gray-500 w-full text-[11px] pt-3">
        {new Date(item.timestamp * 1000).toLocaleString()}
      </div>
    </div>
  )
}

const Bnb = () => {
  return <img src={'/images/tokens/bnb-icon.png'} className="w-3 h-3 sm:w-4 sm:h-4" />
}

const PoolDetailsSlim = ({ width, item }) => {
  return (
    <>
      {width < 768 && (
        <div
          id="pool-details-slim"
          className="flex flex-row sm:py-[.1rem] items-center w-full pr-1 text-[14px] sm:text-[16px] rounded-md bg-dark-1000"
        >
          <div id="delta" className="flex items-center w-full rounded-md bg-dark-1000 ts-1 whitespace-nowrap ">
            <div className="scale-[85%]">
              <BondingCurveBadge bondingCurveType={item.data.bondingCurveType} />
            </div>
            <div className="flex items-center gap-1 ml-2 leading-[1]">
              {+Web3.utils.fromWei(item?.data?.delta) !== 0 ? (
                item.data.bondingCurveType === 'EXPONENTIAL' ? (
                  ((+Web3.utils.fromWei(item.data.delta) - 1) * 100).toFixed(2) + '%'
                ) : (
                  <>
                    <Bnb />
                    {(+Web3.utils.fromWei(item.data.delta)).toFixed(2)}
                  </>
                )
              ) : (
                <>
                  {item.data.bondingCurveType === 'EXPONENTIAL' ? '%' : <Bnb />}
                  {'0'}
                </>
              )}
            </div>
          </div>

          <div
            id="fee"
            className="flex items-center justify-center w-full rounded-md bg-dark-1000 ts-1 whitespace-nowrap "
          >
            <div className="text-[#9fcde6] ">Fee:</div>
            <div className="ml-2">{(+Web3.utils.fromWei(item?.data?.feeAmountT) * 100).toFixed(2)}%</div>
          </div>
          <div id="pool-type" className="flex justify-end rounded-md whitespace-nowrap ">
            <div id="pool-type" className="flex text-center items-center justify-center ts-[thin]">
              {item.poolType === 'SELL' && <div className={poolTypeBadge + 'bg-[#ec84f0]'}>SELL</div>}
              {item.poolType === 'BUY_AND_SELL' && <div className={poolTypeBadge + 'bg-indigo-300'}>TRADE</div>}
              {item.poolType === 'BUY' && <div className={poolTypeBadge + 'bg-[#478fe7]'}>BUY</div>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const PoolDetailsWide = ({ width, item }) => {
  return (
    <>
      {width > 767 && (
        <div
          id="pool-details-wide"
          className="w-full px-3 py-2 overflow-hidden text-[14px] rounded-md bg-dark-1000 ts-1 whitespace-nowrap"
        >
          <div id="pool-type" className="flex w-full whitespace-nowrap">
            <div className="w-24 text-[#9fcde6] ts-1">Pool Type:</div>
            <div id="pool-type" className="flex text-center items-center justify-center ts-[thin]">
              {item.poolType === 'SELL' && <div className={poolTypeBadge + 'bg-[#ec84f0]'}>SELL</div>}
              {item.poolType === 'BUY_AND_SELL' && <div className={poolTypeBadge + 'bg-indigo-300'}>TRADE</div>}
              {item.poolType === 'BUY' && <div className={poolTypeBadge + 'bg-[#478fe7]'}>BUY</div>}
            </div>
          </div>

          <div id="delta" className="flex items-center w-full rounded-md bg-dark-1000 ts-1 whitespace-nowrap">
            <div className="w-24 text-[#9fcde6] ">Delta:</div>
            <div className="scale-[85%]">
              <BondingCurveBadge bondingCurveType={item.data.bondingCurveType} />
            </div>
            <div className="flex items-center gap-1 ml-2 leading-[1]">
              {+Web3.utils.fromWei(item?.data?.delta) !== 0 ? (
                item.data.bondingCurveType === 'EXPONENTIAL' ? (
                  ((+Web3.utils.fromWei(item.data.delta) - 1) * 100).toFixed(2) + '%'
                ) : (
                  <>
                    <Bnb />
                    {(+Web3.utils.fromWei(item.data.delta)).toFixed(2)}
                  </>
                )
              ) : (
                <>
                  {item.data.bondingCurveType === 'EXPONENTIAL' ? '%' : <Bnb />}
                  {'0'}
                </>
              )}
            </div>
          </div>

          <div id="fee" className="flex items-center w-full rounded-md bg-dark-1000 ts-1 whitespace-nowrap">
            <div className="w-24 text-[#9fcde6] ">Fee:</div>
            <div className="ml-2">{(+Web3.utils.fromWei(item?.data?.feeAmountT) * 100).toFixed(2)}%</div>
          </div>
        </div>
      )}
    </>
  )
}

export default NewPoolExpanded
