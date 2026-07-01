import useSpaceId from '../../../hooks/useSpaceId'
import AddressHolder from '../../AddressHolder'
import IdenticonImage from '../../IdenticonImage'

const identicon = 'flex items-center justify-center border-[3px] rounded-full m-[0.375rem] border-gray-700 bg-black'

const InventoryHeading = ({ address }) => {
  const { spaceId } = useSpaceId(address)

  return (
    <div id="header-wallet-data" className="flex flex-col items-center justify-center w-full pb-3">
      <div className={identicon}>
        <IdenticonImage address={address} width={60} size={60} />
      </div>

      <div id="wallet-name" className="w-full text-center font-bold text-[2.5rem]">
        {spaceId ? spaceId : address.slice(0, 6) + '...' + address.slice(-4)}
      </div>

      <AddressHolder address={address} />
    </div>
  )
}

export default InventoryHeading
