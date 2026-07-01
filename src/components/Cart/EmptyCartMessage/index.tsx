const EmptyCartMessage = ({ cartItems, itemsToSell }) => {
  return (
    <>
      {!cartItems.length && !itemsToSell.length && <div className="text-center text-[15px] mt-9">No items in cart</div>}
    </>
  )
}

export default EmptyCartMessage
