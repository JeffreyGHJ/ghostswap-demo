import { ChevronUp } from 'react-feather'
import Badge from '../../Badge'

const mobileCartOpener =
  'flex items-center justify-center fixed bottom-0 w-full mb-[3.5rem] h-[3.5rem] px-3 bg-gray-900'
const mobileCartOpenerBtn =
  'flex items-center text-[15px] justify-between w-full px-3 py-2 border-2 rounded-md bg-blue border-cyan-blue hover:bg-cyan-blue'

const MobileCartOpener = ({ setMobileCartVisible, cartItems, itemsToSell }) => {
  return (
    <div id="mobile-cart-opener" className={mobileCartOpener}>
      <button id="open-mobile-cart-btn" className={mobileCartOpenerBtn} onClick={() => setMobileCartVisible(true)}>
        <div id="open-cart-label" className="flex items-center justify-center ">
          <ChevronUp size={16} />
          open cart
          <Badge color="gray" className="px-[4.5px] ml-1">
            {cartItems.length + itemsToSell.length}
          </Badge>
        </div>

        <span id="cart-net-price" className="flex items-center">
          <img id="bnb-icon" className="w-4 h-4 mr-2 " src={'/images/tokens/bnb-icon.png'} />
          {(
            cartItems.reduce((previousValue, currentItem) => +previousValue + +currentItem.price, 0) -
            itemsToSell.reduce((previous, current) => +previous + +current.price, 0)
          ).toFixed(3)}
        </span>
      </button>
    </div>
  )
}

export default MobileCartOpener
