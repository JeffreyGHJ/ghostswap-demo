import { ShoppingCart } from 'react-feather'
import {useDispatch, useSelector } from 'react-redux'
import { toggleCartIsOpen } from '../../state/cart'
import Badge from '../Badge'

const CartButton = (props: any) => {
  const itemCount = useSelector((state: any) => state.cart.cartItems.length + state.cart.itemsToSell.length)
  const cartIsOpen = useSelector((state: any) => state.cart.cartIsOpen)
  const dispatch = useDispatch()

  const handleCartClick = () => {
    dispatch(toggleCartIsOpen())
  }

  return (
    <div id="cart-btn-container" className="flex items-center h-full">
      {(props.inPopup || (props.inHeader && !cartIsOpen)) && (
        <div
          id="cart-button"
          className="flex text-indigo-300 hover:cursor-pointer hover:text-indigo-500"
          onClick={handleCartClick}
        >
          <ShoppingCart className="h-full" />
          <div id="badge-container" className="flex items-center h-full">
            <Badge color={'gray'} size="default">
              <div className="flex h-full items-center text-[11px]">{itemCount}</div>
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartButton
