import { useEffect, useState } from 'react'
import AddressHolder from '../../AddressHolder'
import axios from 'axios'

const PoolAddress = ({ item, width, isSwap = false }) => {
  const [spaceName, setSpaceName] = useState(null)
  const [matchingWidth, setMatchingWidth] = useState(null)

  const getSpaceName = async (address) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/spaceid/${address}`)
      setSpaceName(response.data.name)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (item.data.ownerAddress !== undefined) {
      getSpaceName(item.data.ownerAddress)
    } else if (isSwap && item.maker !== undefined) {
      getSpaceName(item.maker)
    }
  }, [item])

  useEffect(() => {
    let baseWidth = width > 768 ? 93 : 86
    let charWidth = width > 768 ? 7.8 : 7.5

    if (spaceName) {
      if (spaceName.length > 11) {
        setMatchingWidth(baseWidth + (spaceName.length - 11) * charWidth)
      } else {
        setMatchingWidth(baseWidth)
      }
    }
  }, [spaceName, width])

  return (
    <div id="pool-address" className="flex items-center justify-between w-full px-1 rounded-md bg-dark-1000">
      <div className={'text-[12px] text-left md:text-[14px] text-[#9fcde6] ts-1 whitespace-nowrap min-w-[3.5rem]'}>
        {width > 767 && 'Pool'} Address:
      </div>
      <div className="flex items-center overflow-hidden">
        <AddressHolder
          address={item.poolAddress}
          containerStyle="flex items-center overflow-hidden"
          addressContainerStyle="flex items-center"
          addressStyle={'ts-3 text-[13px] md:text-[14px] text-[#7aa6bb] font-mono pr-2 overflow-hidden'}
          internalAddressLink={item.poolAddress}
          identicon={true}
          matchingWidth={matchingWidth}
        />
      </div>
    </div>
  )
}

export default PoolAddress
