import NftListBox from '../../NftListBox'
import nftIcon from '../../../../public/nft.png'

const value = 'flex w-full items-center text-[16px] sm:text-[20px] pl-1 tracking-tight ts-2 text-center '
const container = 'flex flex-col gap-1 p-2 w-full items-center justify-center rounded-md overflow-hidden bg-dark-1000'
const label = 'w-full text-left text-[12px] sm:text-[16px] text-[#9fcde6] ts-1'

const NftDepositExpanded = ({ item }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[780px]">
      <div className="flex w-full gap-1 md:gap-3">
        <div id="amount-deposited" className={container}>
          <div id="price-box-label" className={label}>
            Amount Deposited
          </div>
          <div className={value + ' gap-1'}>
            {item.data.nftTokenIds.length}
            <img src={nftIcon.src} height={24} width={24} />
          </div>
        </div>
        <div id="new-balance" className={container}>
          <div id="price-box-label" className={label}>
            New Balance
          </div>
          <div className={value + ' gap-1'}>
            {item.data.nftTokenBalance}
            <img src={nftIcon.src} height={24} width={24} />
          </div>
        </div>
      </div>

      <NftListBox
        nfts={item.data.nftTokenIds.map((nftTokenId) => {
          let nft = {
            tokenId: nftTokenId,
            tokenAddress: item.collectionAddress.toLowerCase(),
          }
          return nft
        })}
        listStyle="rowCentered"
        mode="deposited"
        nftSize="small"
      />
      <div className="flex justify-center text-gray-500 w-full text-[11px] pt-3">
        {new Date(item.timestamp * 1000).toLocaleString()}
      </div>
    </div>
  )
}

export default NftDepositExpanded
