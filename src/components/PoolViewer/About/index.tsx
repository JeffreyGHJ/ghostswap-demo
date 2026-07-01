import AddressHolder from '../../AddressHolder'
import Web3 from 'web3'

const nftAvatar = (avatarSrc) => {
  return <img src={avatarSrc} width={16} height={16} className="rounded-full" />
}

const fallbackAvatar = '/../../nft.png'

const About = ({ poolDetails, avatar }) => {
  return (
    <div id="about" className="w-full h-full p-3 rounded-md bg-dark-800">
      <div id="heading" style={{ WebkitTextStrokeWidth: '.02rem' }} className="w-full text-[1.45rem] font-bold mb-3">
        About
      </div>
      <div id="pool-owner" className="w-full px-3 py-1 rounded-md bg-dark-900 text-[.9rem] ts-[.02rem]">
        <div className="w-full">Pool Owner:</div>
        <div className="flex items-center gap-2">
          <AddressHolder
            address={poolDetails.owner}
            containerStyle="flex items-center w-full"
            addressContainerStyle="flex item-center"
            addressStyle="ts-3 text-[#7aa6bb] font-mono pr-2 overflow-hidden"
            internalAddressLink={poolDetails.owner}
            isUser={true}
          />
        </div>
      </div>
      <div id="assets-info" className="text-[14px] tracking-tight px-2 text-gray-300 ts-[.008rem]">
        {poolDetails.poolType === 'SELL' && (
          <>
            <div className="flex flex-wrap items-center gap-x-1 my-[6px]">
              This pool holds
              <img src={'/images/tokens/bnb-icon.png'} width={16} height={16} />
              <div className="font-bold text-white">BNB</div> and buys
              {nftAvatar(avatar || fallbackAvatar)}
              <div className="font-bold text-white">NFT</div>
            </div>
            <div id="price-info" className="flex flex-wrap items-center gap-x-1 my-[6px]">
              Right now this pool will buy at
              <Bnb />
              <div className="font-bold text-white">
                {(+Web3.utils.fromWei(poolDetails.offerNBT, 'ether')).toFixed(3)}
              </div>
            </div>
          </>
        )}
        {poolDetails.poolType === 'BUY' && (
          <>
            <div className="flex flex-wrap items-center gap-x-1 my-[6px]">
              This pool holds
              {nftAvatar(avatar || fallbackAvatar)}
              <div className="font-bold text-white">NFT</div> to sell for
              <img src={'/images/tokens/bnb-icon.png'} width={16} height={16} />
              <div className="font-bold text-white">BNB</div>
            </div>
            <div id="price-info" className="flex flex-wrap items-center my-[6px] gap-x-1">
              Right now this pool will sell at
              <Bnb />
              <div className="font-bold text-white">
                {(+Web3.utils.fromWei(poolDetails.floorNBT, 'ether')).toFixed(3)}
              </div>
            </div>
          </>
        )}
        {poolDetails.poolType === 'BUY_AND_SELL' && (
          <>
            <div className="flex flex-wrap items-center gap-x-1 my-[6px]">
              This pool holds both
              {nftAvatar(avatar || fallbackAvatar)}
              <div className="font-bold text-white">NFT</div> and
              <img src={'/images/tokens/bnb-icon.png'} width={16} height={16} />
              <div className="font-bold text-white">BNB</div> to earn swap fees
            </div>
            <div id="price-info" className="flex flex-wrap gap-x-1 items-center my-[6px]">
              Right now this pool will sell at
              <Bnb />
              <div className="font-bold text-white">
                {(+Web3.utils.fromWei(poolDetails.floorNBT, 'ether')).toFixed(3)}
              </div>
              and buy at
              <Bnb />
              <div className="font-bold text-white">
                {(+Web3.utils.fromWei(poolDetails.offerNBT, 'ether')).toFixed(3)}
              </div>
            </div>
          </>
        )}

        {poolDetails.delta && (
          <div id="delta-info" className="flex flex-wrap gap-x-1 items-center my-[6px] ">
            Each time this pool
            <div>
              {poolDetails.poolType === 'SELL' && 'buys'}
              {poolDetails.poolType === 'BUY' && 'sells'}
              {poolDetails.poolType === 'BUY_AND_SELL' && 'buys/sells'}
            </div>
            an NFT, the price will be
            <div>
              {poolDetails.poolType === 'SELL' && 'decreased'}
              {poolDetails.poolType === 'BUY' && 'increased'}
              {poolDetails.poolType === 'BUY_AND_SELL' && 'decreased/increased'}
            </div>
            by
            <div className="font-bold text-white">
              {poolDetails.bondingCurveType === 'LINEAR' && (
                <div className="flex items-center gap-x-1">
                  <Bnb />
                  {Web3.utils.fromWei(poolDetails.delta, 'ether')}
                </div>
              )}
              {poolDetails.bondingCurveType === 'EXPONENTIAL' && (
                <div> {((+Web3.utils.fromWei(poolDetails.delta) - 1) * 100).toFixed(2)} %</div>
              )}
            </div>
          </div>
        )}

        {poolDetails.poolType === 'BUY_AND_SELL' && (
          <div className="flex flex-wrap items-center gap-x-1 my-[6px]">
            Each time someone swaps with this pool, you will earn
            <div className="flex items-center font-bold text-white">
              {(+Web3.utils.fromWei(poolDetails.fee, 'ether') * 100).toFixed(3) + '%'}
            </div>
            of the swap amount as swap fee
          </div>
        )}
      </div>
    </div>
  )
}

const Bnb = () => {
  return <img src={'/images/tokens/bnb-icon.png'} className="w-4 h-4" />
}

export default About
