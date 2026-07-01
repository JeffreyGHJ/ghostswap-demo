import Link from 'next/link'
import BondingCurveBadge from '../../BondingCurveBadge'

const PoolInfoTooltip = ({ color, nftData, pool }) => {
  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-center border-b-2 border-gray-500 overflow-ellipsis pb-xxs w-[12rem] tracking-[-.04em]">
        <div style={{ color: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }} className="w-full text-center ts-4">
          <div className="flex items-center justify-center w-full overflow-hidden overflow-ellipsis">
            {pool?.poolType === 'BUY_AND_SELL' && 'Trade '}
            {pool?.poolType === 'BUY' && 'NFT '}
            Pool {pool?.poolAddress.slice(0, 6) + '...' + pool?.poolAddress.slice(38)}
          </div>
        </div>
      </div>
      <div className="flex justify-between py-3px mx-3px">
        <div id="pool-inventory" className="font-bold ts-[.06rem] text-[19.2px] tracking-tight">
          {pool?.nftBalance || 'X'} NFT{pool?.nftBalance > 1 ? 's' : ''}
        </div>
        <div className="flex items-center justify-center">
          <BondingCurveBadge bondingCurveType={pool?.bondingCurveType} />
        </div>
      </div>
      <Link
        href={{
          pathname: `/pools/view/[address]`,
          query: {
            address: nftData.poolAddress,
          },
        }}
      >
        <button className="w-full text-gray-800 ts-[.04rem] bg-[#b9b9ff] rounded-md p-3px text-[15px] hover:bg-[#6146a0] hover:text-pink transition-colors">
          View Pool
        </button>
      </Link>
    </div>
  )
}

export default PoolInfoTooltip
