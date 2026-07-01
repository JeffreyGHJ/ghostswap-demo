import AddressHolder from '../../AddressHolder'

const SwapNftAddress = ({ item, width }) => {
  return (
    <div id="pool-owner" className="flex items-center justify-between w-full px-1 rounded-md bg-dark-1000">
      <div className={'text-[12px] md:text-[14px] text-left text-[#9fcde6] ts-1 whitespace-nowrap min-w-[3.5rem]'}>
        {width > 767 && 'Pool'} {item.eventType === 'SWAP_NFT_IN_POOL' ? ' Seller:' : ' Buyer:'}
      </div>
      <div className="flex items-center overflow-hidden">
        <AddressHolder
          address={item.maker}
          containerStyle="flex items-center overflow-hidden"
          addressContainerStyle="flex items-center"
          addressStyle="ts-3 text-[13px] md:text-[14px] text-[#7aa6bb] font-mono pr-2 overflow-hidden"
          internalAddressLink={item.maker}
          isUser={true}
          identicon={true}
        />
      </div>
    </div>
  )
}

export default SwapNftAddress
