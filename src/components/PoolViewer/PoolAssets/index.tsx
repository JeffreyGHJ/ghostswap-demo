import NftListBox from '../../NftListBox'
import Button from '../Button'

const PoolAssets = ({ poolDetails, nfts, canEdit, setModalState }) => {
  return (
    <div id="assets" style={{ WebkitTextStrokeWidth: '.02rem' }} className="w-full h-auto p-3 rounded-md bg-dark-800">
      <div id="heading" className="w-full text-[1.45rem] font-bold mb-3">
        Assets
      </div>

      {poolDetails.poolType !== 'BUY' && (
        <div id="tokens" className="flex-col p-3 rounded-md bg-dark-900">
          <div id="heading-and-buttons" className="flex items-start justify-between mb-3">
            <div id="heading">Tokens</div>
            <div id="deposit-withdraw-buttons" className="flex items-center gap-2 justify-evenly">
              <Button enabled={canEdit} onClick={() => setModalState('deposit-tokens')}>
                Deposit
              </Button>
              <Button enabled={canEdit} onClick={() => setModalState('withdraw-tokens')}>
                Withdraw
              </Button>
            </div>
          </div>
          <div id="value-display" className="text-[24px] flex items-center gap-1">
            <Bnb />
            <div id="value" className="mr-2">
              {poolDetails.poolType === 'SELL' && (+poolDetails.balanceNBT / 1e18).toFixed(3)}
              {/* {poolDetails.poolType === 'BUY' && (+poolDetails.balanceNBT / 1e18).toFixed(3)} */}
              {poolDetails.poolType === 'BUY_AND_SELL' && (+poolDetails.balanceNBT / 1e18).toFixed(3)}
            </div>
          </div>
        </div>
      )}
      {poolDetails.poolType !== 'SELL' && (
        <div id="nfts" className="flex-col p-3 rounded-md bg-dark-900 mt-[6px] overflow-hidden">
          <div id="heading-and-buttons" className="flex items-start justify-between mb-3">
            <div id="heading">NFTs</div>
            <div id="deposit-withdraw-buttons" className="flex items-center gap-2 justify-evenly">
              <Button onClick={() => setModalState('deposit-nfts')} enabled={canEdit}>
                Deposit
              </Button>
              <Button onClick={() => setModalState('withdraw-nfts')} enabled={canEdit}>
                Withdraw
              </Button>
            </div>
          </div>
          <div id="nft-count" className="flex items-center gap-1 mb-2 text-[24px]">
            <img src={'/../../nft.png'} width={32} height={32} />
            {poolDetails.nftBalance}
          </div>
          <NftListBox
            mode="deposited"
            nftSize="small"
            nfts={nfts}
            listStyle="grid1"
            className="h-[13.5rem] mx-[-12px] mb-[-12px] ts-0"
          />
        </div>
      )}
      {/* <div id="withdraw-other-tokens" className="mt-2 text-gray-400 w-fit">
        <Button onClick={() => setModalState('withdraw-other-tokens')} enabled={canEdit}>
          Withdraw Other Tokens
        </Button>
      </div> */}
    </div>
  )
}

const Bnb = () => {
  return <img src={'/images/tokens/bnb-icon.png'} className="w-7 h-7" />
}

export default PoolAssets
