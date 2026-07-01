const bnbicon = '/images/tokens/bnb-icon.png'

const PriceDetails = ({ price, handleCheckout }) => {
  return (
    <div id="price-details" className="flex flex-col items-center justify-between gap-2 md:flex-row">
      <div id="price" className="flex items-center gap-2 md:gap-0 md:items-start md:flex-col">
        <div id="label" className="text-[16px] text-[#95AAC9]">
          Price
        </div>
        <div id="amount" className="flex items-center justify-center">
          <img src={bnbicon} className="mr-[6px]" width={20} />
          <div className="text-[24px] font-black">{(+price).toFixed(3)}</div>
        </div>
      </div>
      <button
        id="buy-now-btn"
        className="w-3/4 text-gray-800 font-bold bg-[#b9b9ff] rounded-md px-2 py-3 text-sm2 hover:border-white hover:shadow-light-glow-inset"
        onClick={() => handleCheckout()}
      >
        Buy Now
      </button>
    </div>
  )
}

export default PriceDetails
