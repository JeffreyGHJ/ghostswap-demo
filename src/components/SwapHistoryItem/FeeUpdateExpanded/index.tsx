import Web3 from 'web3'

const value = 'flex w-full items-center text-[16px] sm:text-[20px] pl-1 tracking-tight ts-2 text-center '
const container = 'flex flex-col gap-1 p-2 w-full items-center justify-center rounded-md overflow-hidden bg-dark-1000'
const label = 'w-full text-left text-[12px] sm:text-[16px] text-[#9fcde6] ts-1'

const FeeUpdateExpanded = ({ item }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div id="prices" className="flex flex-row items-center gap-1 sm:gap-3 justify-between max-w-[780px] w-full">
        <div id="new-fee" className={container}>
          <div id="price-box-label" className={label}>
            New Fee
          </div>
          <div className={value}>
            {(+Web3.utils.fromWei(item.data.newFeeT) * 100).toFixed(3)}
            <div className="ml-[.2rem]">%</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center text-gray-500 w-full text-[11px] pt-3">
        {new Date(item.timestamp * 1000).toLocaleString()}
      </div>
    </div>
  )
}

export default FeeUpdateExpanded
