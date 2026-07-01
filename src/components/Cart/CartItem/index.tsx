import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useNftImageSources from '../../../hooks/useNftImageSources'
import { toggleCartItem, toggleItemToSell } from '../../../state/cart'
import IdenticonImage from '../../IdenticonImage'
import { ArrowTooltipFlat as Tooltip } from '../../Tooltip'
import useSpaceId from '../../../hooks/useSpaceId'

const CartItem = ({ nftData, type }) => {
  const dispatch = useDispatch()
  const { getNftImageSource } = useNftImageSources()
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [innerTooltipVisible, setInnerTooltipVisible] = useState(false)
  const [imageSource, setImageSource] = useState(null)
  const address = nftData.poolAddress || nftData.owner
  const { spaceId } = useSpaceId(address)

  const enableTooltipVisible = () => {
    setTooltipVisible(true)
  }

  const disableTooltipVisible = () => {
    setTooltipVisible(false)
  }

  const enableInnerTooltipVisible = () => {
    setInnerTooltipVisible(true)
    setTooltipVisible(false)
  }

  const disableInnerTooltipVisible = () => {
    setInnerTooltipVisible(false)
    setTooltipVisible(true)
  }

  const toggleItem = (nftData: any, type: string) => {
    type === 'BUY' ? dispatch(toggleCartItem(nftData)) : dispatch(toggleItemToSell(nftData))
  }

  useEffect(() => {
    getNftImageSource(nftData.collectionAddress, nftData.id, setImageSource)
  }, [])

  const innerTooltipContent = spaceId ? `Owned by ${spaceId}` : `Owned by ${address.slice(0, 6)}...${address.slice(38)}`

  return (
    <Tooltip show={tooltipVisible} content={`${nftData.name} #${nftData.id}`} placement="left">
      <div
        id="cart-item-wrapper"
        className="flex w-full"
        onMouseEnter={enableTooltipVisible}
        onMouseLeave={disableTooltipVisible}
      >
        <div
          id="cart-item"
          style={{ margin: '0.1875rem' }}
          className="flex flex-col items-center w-full hover:bg-gray-700"
        >
          <div className="flex w-full">
            <div className="relative">
              <div
                onMouseEnter={enableInnerTooltipVisible}
                onMouseLeave={disableInnerTooltipVisible}
                className="absolute w-4 h-4"
              >
                <Tooltip show={innerTooltipVisible} content={innerTooltipContent} placement={'right'}>
                  <IdenticonImage address={address} width={16} />
                </Tooltip>
              </div>
            </div>

            <div id="image-wrapper" className="flex justify-center w-[20%] mr-[.1875rem]">
              <img
                className="object-contain w-full align-middle max-h-16 m-[.4rem]"
                src={imageSource}
                alt={nftData.name + ' ' + nftData.id}
              ></img>
            </div>
            <div id="desc" className="flex flex-col justify-center font-bold w-[40%] text-[.97rem] tracking-[-.02em]">
              <div
                id="collection-name"
                className="overflow-hidden font-normal text-gray-400 overflow-ellipsis whitespace-nowrap text-[.8rem]"
              >
                {nftData.name}
              </div>
              <div id="collection-id" className="overflow-hidden overflow-ellipsis whitespace-nowrap text-[15px]">
                {nftData.name} #{nftData.id}
              </div>
            </div>
            <div id="item-price" className="flex items-center justify-end w-[30%] tracking-[-0.04em]">
              <img id="bnb-icon" className="flex items-center w-4 h-4 mr-2" src={'/images/tokens/bnb-icon.png'} />
              <div className="font-bold text-[0.97rem]">{parseFloat((+nftData.price).toFixed(6))}</div>
            </div>
            <div id="remove-from-cart" className="flex items-center justify-center w-[8%]">
              <button className="font-bold text-gray-400 hover:text-white" onClick={() => toggleItem(nftData, type)}>
                x
              </button>
            </div>
          </div>
        </div>
      </div>
    </Tooltip>
  )
}

export default CartItem
