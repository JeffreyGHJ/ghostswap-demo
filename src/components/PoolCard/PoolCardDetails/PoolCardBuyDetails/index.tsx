import Web3 from 'web3'

const PoolCardBuyDetails = (props) => {
  const buyPrice = props.offerNBT ? parseFloat((+Web3.utils.fromWei(props.offerNBT, 'ether')).toFixed(4)) : 0.0

  return (
    <div id="buy-details" className="flex flex-col">
      <div id="heading" className="text-left">
        Buy Price
      </div>
      <div
        id="buy-values"
        style={{ WebkitTextStrokeWidth: 'initial' }}
        className="flex items-center justify-between mt-[0.1875rem] tracking-[-0.08em]"
      >
        <div id="crypto-value" className="flex items-center justify-between">
          <img id="crypto-icon" src={'/images/tokens/bnb-icon.png'} className="w-6 h-6 mr-[0.1875rem]"></img>
          <div id="value" className="text-white text-[1.75rem]">
            {isNaN(buyPrice) ? '-' : buyPrice}
          </div>
        </div>
        <div id="usd-value" className="text-[.9rem] text-gray-500">
          ${'-'}
        </div>
      </div>
    </div>
  )
}

export default PoolCardBuyDetails
