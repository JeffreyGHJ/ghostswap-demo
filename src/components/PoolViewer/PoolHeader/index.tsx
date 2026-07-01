import { ArrowLongRightIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import AddressHolder from '../../AddressHolder'
const tokenIcon = <img src="/images/tokens/bnb-icon.png" width={24} height={24} className="mr-1" />
const fallbackAvatar = '/../../nft.png'
const arrowRight = <ArrowLongRightIcon className="w-8 h-8 mx-1 stroke-2" />
const arrowLeftRight = <ArrowsRightLeftIcon className="w-8 h-8 mx-1" />
const nftAvatar = (avatarSrc) => {
  return <img src={avatarSrc} width={24} height={24} className="mr-1 rounded-full" />
}
const PoolHeader = ({ poolAddress, poolDetails, avatar, shortName }) => {
  return (
    <div id="header" className="flex flex-col items-center justify-center w-full gap-1">
      <div style={{ WebkitTextStrokeWidth: 'thin' }} className="flex items-center text-[24px] font-bold">
        {poolDetails.poolType === 'SELL' && (
          <div className="flex items-center">
            {tokenIcon} BNB {arrowRight} {nftAvatar(avatar || fallbackAvatar)} NFT
          </div>
        )}
        {poolDetails.poolType === 'BUY' && (
          <div className="flex items-center">
            {nftAvatar(avatar || fallbackAvatar)} NFT {arrowRight} {tokenIcon} BNB
          </div>
        )}
        {poolDetails.poolType === 'BUY_AND_SELL' && (
          <div className="flex items-center">
            {tokenIcon} BNB {arrowLeftRight} {nftAvatar(avatar || fallbackAvatar)} NFT
          </div>
        )}
      </div>
      <div id="pool-type" style={{ WebkitTextStrokeWidth: 'thin' }} className="flex text-center">
        {poolDetails.poolType === 'BUY' && (
          <div className="rounded-md font-normal text-black bg-[#ec84f0] px-2 text-[13px] tracking-[-.02em]">
            Pool Sells Nfts for Tokens
          </div>
        )}
        {poolDetails.poolType === 'BUY_AND_SELL' && (
          <div className="rounded-md font-normal text-black bg-indigo-300 px-2 text-[13px] tracking-[-.02em]">
            Pool Trades Assets for a Fee
          </div>
        )}
        {poolDetails.poolType === 'SELL' && (
          <div className="rounded-md font-normal text-black bg-[#478fe7] px-2 text-[13px] tracking-[-.02em]">
            Pool Buys Nfts with Tokens
          </div>
        )}
      </div>
      <AddressHolder address={poolAddress} />
    </div>
  )
}

export default PoolHeader
