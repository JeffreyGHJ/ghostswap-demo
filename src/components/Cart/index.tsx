import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWindowSize } from '../../hooks/useWindowSize'
import CartButton from '../CartButton'
import CartItemsToBuy from './CartItemsToBuy'
import CartItemsToSell from './CartItemsToSell'
import MobileCartOpener from './MobileCartOpener'
import Checkout from './Checkout'
import CartSettings from './CartSettings'
import MobileCloseButton from './MobileCloseButton'
import EmptyCartMessage from './EmptyCartMessage'

const TABLET_MIN_WIDTH = 768

const cartContainer =
  'flex flex-col fixed bottom-0 md:relative w-full mb-[3.5rem] lg:mb-0 bg-gray-800 md:bg-gray-900 lg:max-w-1/4 lg:h-[100vh]'

const cartStyle = ' bg-gray-900 h-[53vh] mt-[.3rem] md:mt-0 md:h-[83vh] lg:h-full overflow-y-auto '

const Cart = ({ styles = null }) => {
  const cartIsOpen = useSelector((state: any) => state.cart.cartIsOpen)
  const cartItems = useSelector((state: any) => state.cart.cartItems)
  const itemsToSell = useSelector((state: any) => state.cart.itemsToSell)
  const [mobileCartVisible, setMobileCartVisible] = useState(false)
  const [sellTotal, setSellTotal] = useState(0)
  const [buyTotal, setBuyTotal] = useState(0)
  const [netCost, setNetCost] = useState(0)
  const { width: windowWidth } = useWindowSize()

  useEffect(() => {
    setSellTotal(itemsToSell.reduce((previousValue, currentItem) => +previousValue + +currentItem.price, 0))
  }, [itemsToSell])

  useEffect(() => {
    setBuyTotal(cartItems.reduce((previousValue, currentItem) => +previousValue + +currentItem.price, 0))
  }, [cartItems])

  useEffect(() => {
    setNetCost(buyTotal - sellTotal)
  }, [buyTotal, sellTotal])

  return (
    <>
      {cartIsOpen && (mobileCartVisible || windowWidth >= TABLET_MIN_WIDTH) && (
        <div id="cart-container" className={cartContainer}>
          <div id="cart" className={cartStyle}>
            <div id="cart-controls" className="flex items-center justify-between px-3">
              <CartButton inPopup={true} />
              <CartSettings />
              <MobileCloseButton width={windowWidth} min={TABLET_MIN_WIDTH} close={() => setMobileCartVisible(false)} />
            </div>
            <CartItemsToBuy cartItems={cartItems} buyTotal={buyTotal} />
            <CartItemsToSell itemsToSell={itemsToSell} sellTotal={sellTotal} />
            <EmptyCartMessage cartItems={cartItems} itemsToSell={itemsToSell} />
          </div>
          <Checkout
            cartItems={cartItems}
            itemsToSell={itemsToSell}
            netCost={netCost}
            sellTotal={sellTotal}
            buyTotal={buyTotal}
          />
        </div>
      )}
      {windowWidth < TABLET_MIN_WIDTH && cartIsOpen && !mobileCartVisible && (
        <MobileCartOpener setMobileCartVisible={setMobileCartVisible} cartItems={cartItems} itemsToSell={itemsToSell} />
      )}
    </>
  )
}

export default Cart
