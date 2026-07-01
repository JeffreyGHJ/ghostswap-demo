import Web3 from "web3";

const PoolCardTradeDetails = (props) => {
  return (
    <>
      <div id="trade-details" className="flex items-center justify-center">
        <div id="left-col" className="w-full border-r-2 border-r-[#3b5587] pr-3">
          <div id="heading" className="text-left">
            Sell Price
          </div>
          <div
            id="sale-values"
            style={{ WebkitTextStrokeWidth: 'initial' }}
            className="flex flex-col items-center mt-[0.1875rem] tracking-[-0.08em]"
          >
            <div id="crypto-value" className="flex items-center justify-start w-full">
              <img id="crypto-icon" src={'/images/tokens/bnb-icon.png'} className="w-6 h-6 mr-[0.1875rem]"></img>
              <div id="value" className="text-white text-[1.75rem] break-all">
                {parseFloat((+Web3.utils.fromWei(props.floorNBT, 'ether')).toFixed(4))|| '-'}
              </div>
            </div>
            <div id="usd-value" className="text-[.9rem] text-gray-500 text-right w-full">
              ${props.sellPriceUSD?.toFixed(2) || '-'}
            </div>
          </div>
        </div>
        <div id="right-col" className="w-full pl-3">
          <div id="heading" className="text-left">
            Buy Price
          </div>
          <div
            id="sale-values"
            style={{ WebkitTextStrokeWidth: 'initial' }}
            className="flex flex-col items-center mt-[0.1875rem] tracking-[-0.08em]"
          >
            <div id="crypto-value" className="flex items-center justify-start w-full">
              <img id="crypto-icon" src={'/images/tokens/bnb-icon.png'} className="w-6 h-6 mr-[0.1875rem]"></img>
              <div id="value" className="text-white text-[1.75rem] break-all">
                {parseFloat((+Web3.utils.fromWei(props.offerNBT, 'ether')).toFixed(4)) || '-'}
              </div>
            </div>
            <div id="usd-value" className="text-[.9rem] text-gray-500 text-right w-full">
              ${props.buyPriceUSD?.toFixed(2) || '-'}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PoolCardTradeDetails
