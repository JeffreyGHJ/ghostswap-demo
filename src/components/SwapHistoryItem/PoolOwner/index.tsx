import AddressHolder from '../../AddressHolder'

const PoolOwner = ({ item, width }) => {
  return (
    <div id="pool-owner" className="flex items-center justify-between w-full px-1 rounded-md bg-dark-1000">
      <div className={'text-[12px] md:text-[14px] text-[#9fcde6] ts-1 whitespace-nowrap min-w-[3.5rem]'}>
        {width > 767 && 'Pool'} Owner:
      </div>
      <div className="flex items-center overflow-hidden">
        <AddressHolder
          address={item.data.ownerAddress}
          containerStyle="flex items-center overflow-hidden"
          addressContainerStyle="flex item-center"
          addressStyle="ts-3 text-[13px] md:text-[14px] text-[#7aa6bb] font-mono pr-2 overflow-hidden"
          internalAddressLink={item.data.ownerAddress}
          isUser={true}
          identicon={true}
        />
      </div>
    </div>
  )
}

export default PoolOwner
