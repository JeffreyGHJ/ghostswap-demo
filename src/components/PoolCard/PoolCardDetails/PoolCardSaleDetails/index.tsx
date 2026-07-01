import Web3 from "web3";

const PoolCardSaleDetails = (props) => {
  return (
    <>
      <div id="sale-details" className="flex flex-col">
        <div id="heading" className="text-left">
          Sell Price
        </div>
        <div
          id="sale-values"
          className="flex items-center justify-between mt-[0.1875rem] tracking-[-0.08em] ts-[initial]"
        >
          <div id="crypto-value" className="flex items-center justify-between">
            <img id="crypto-icon" src={'/images/tokens/bnb-icon.png'} className="w-6 h-6 mr-[0.1875rem]"></img>
            <div id="value" className="text-white text-[1.75rem]">
              {props.floorNBT && parseFloat((+Web3.utils.fromWei(props.floorNBT, 'ether')).toFixed(4)) || '-'}
            </div>
          </div>
          <div id="usd-value" className="text-[.9rem] text-gray-500">
            ${props.sellPriceUSD?.toFixed(2) || '-'}
          </div>
        </div>
      </div>
    </>
  )
}

export default PoolCardSaleDetails
