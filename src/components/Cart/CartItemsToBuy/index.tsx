import { useDispatch } from 'react-redux'
import { clearCartItems } from '../../../state/cart'

import CartItem from '../CartItem'

const bnbIcon = '/images/tokens/bnb-icon.png'
const totalPriceContainer =
  'flex font-bold text-[.97rem] tracking-[-0.02em] items-center justify-center py-[.375rem] m-[.1875rem] bg-gray-700 rounded'
const clearItemsBtn =
  'p-[.1875rem] m-[.375rem] text-[.7rem] bg-gray-800 border border-gray-300 rounded-lg hover:bg-gray-500 hover:border-gray-500'

const CartItemsToBuy = ({ cartItems, buyTotal }) => {
  const dispatch = useDispatch()

  const emptyCart = () => {
    dispatch(clearCartItems())
  }

  return (
    <>
      {cartItems.length > 0 && (
        <>
          <div id="control-group-row" className="flex items-center justify-between mt-3 ml-3 mb-[.1875rem]">
            <div id="item-count" className="font-bold text-[1.25rem]">
              {'Buy ' + cartItems.length + (cartItems.length > 1 ? ' NFTs' : ' NFT')}
            </div>
            <div id="clear-items">
              <button id="clear-items-btn" className={clearItemsBtn} onClick={() => emptyCart()}>
                CLEAR
              </button>
            </div>
          </div>
          <div id="total-price" className={totalPriceContainer}>
            <div className="w-2/5">Buy Total:</div>
            <div id="price-container" className="flex items-center justify-end w-[30%]">
              <img id="bnb-icon" className="flex items-center w-4 h-4 mr-2" src={bnbIcon} />
              <div>{buyTotal.toFixed(6)}</div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            {cartItems.map((nftData: any, index: number) => (
              <CartItem nftData={nftData} key={index + ':' + nftData.id} type={'BUY'} />
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default CartItemsToBuy
