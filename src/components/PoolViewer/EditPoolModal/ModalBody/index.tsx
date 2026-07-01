import Web3 from 'web3'
import NftListBox from '../../../NftListBox'
import Input from '../../Input'
import PriceGraph from '../../PriceGraph'
import { add } from '../functions'
import Button from '../../Button'

const tokenDisplay = (
  <>
    <div id="icon-container" className="w-[20px] h-[20px]">
      <img src="/images/tokens/bnb-icon.png" width={20} height={20} />
    </div>
    <div className="ml-1 font-bold">BNB</div>
  </>
)
const percentDisplay = <div>%</div>

const ModalBody = ({
  modalState,
  poolDetails,
  nfts,
  price,
  delta,
  fee,
  setPrice,
  setDelta,
  setFee,
  currentTokenBalance,
  currentPrice,
  currentDelta,
  currentFee,
  amountToDeposit,
  newTokenBalance,
  setAmountToDeposit,
  amountToWithdraw,
  setAmountToWithdraw,
  nftsToWithdraw,
  nftsToDeposit,
  setNftsToWithdraw,
  setNftsToDeposit,
  ownedNfts,
}) => {
  return (
    <div id="modal-body" className="relative flex flex-col max-w-full gap-4 p-4 border-b border-b-dark-500">
      {modalState === 'edit-pricing' && (
        <EditPricing
          price={price}
          setPrice={setPrice}
          delta={delta}
          setDelta={setDelta}
          fee={fee}
          setFee={setFee}
          poolDetails={poolDetails}
          currentPrice={currentPrice}
          currentDelta={currentDelta}
          currentFee={currentFee}
        />
      )}
      {modalState === 'deposit-tokens' && (
        <DepositTokens
          currentTokenBalance={currentTokenBalance}
          amountToDeposit={amountToDeposit}
          setAmountToDeposit={setAmountToDeposit}
          newTokenBalance={newTokenBalance}
        />
      )}
      {modalState === 'withdraw-tokens' && (
        <WithdrawTokens
          currentTokenBalance={currentTokenBalance}
          amountToWithdraw={amountToWithdraw}
          setAmountToWithdraw={setAmountToWithdraw}
          newTokenBalance={newTokenBalance}
        />
      )}
      {modalState === 'withdraw-nfts' && (
        <WithdrawNfts nfts={nfts} nftsToWithdraw={nftsToWithdraw} setNftsToWithdraw={setNftsToWithdraw} />
      )}
      {modalState === 'deposit-nfts' && (
        <DepositNfts ownedNfts={ownedNfts} nftsToDeposit={nftsToDeposit} setNftsToDeposit={setNftsToDeposit} />
      )}
    </div>
  )
}

const WithdrawNfts = ({ nfts, nftsToWithdraw, setNftsToWithdraw }) => {
  return (
    <>
      <div className="text-[18px] tracking-tight text-center ts-4">
        Select NFTs from this pool to withdraw into your wallet
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center w-full gap-2">
          <Button enabled={true} onClick={() => setNftsToWithdraw(nfts)}>
            Select All
          </Button>
          <Button enabled={nftsToWithdraw.length > 0} onClick={() => setNftsToWithdraw([])}>
            Deselect All
          </Button>
        </div>

        <div className="w-full rounded-md bg-dark-800">
          <NftListBox
            nfts={nfts}
            listStyle="grid2"
            listClass={'overflow-y-auto max-h-[24rem]'}
            selectedNfts={nftsToWithdraw}
            setSelectedNfts={setNftsToWithdraw}
            selectEnabled
          />
        </div>
      </div>
    </>
  )
}

const DepositNfts = ({ ownedNfts, nftsToDeposit, setNftsToDeposit }) => {
  return (
    <>
      <div className="text-[18px] tracking-tight text-center ts-4">
        Select NFTs from your wallet to deposit into this pool
      </div>
      <div className="rounded-md bg-dark-800">
        <NftListBox
          nfts={ownedNfts}
          listStyle="grid2"
          listClass={'overflow-y-auto max-h-[24rem]'}
          selectedNfts={nftsToDeposit}
          setSelectedNfts={setNftsToDeposit}
          selectEnabled
        />
      </div>
    </>
  )
}

const EditPricing = ({
  price,
  setPrice,
  delta,
  setDelta,
  fee,
  setFee,
  poolDetails,
  currentPrice,
  currentDelta,
  currentFee,
}) => {
  return (
    <>
      <div id="price-inputs-flex-container" className="flex flex-col justify-between gap-3 lg2:flex-row ts-[.018rem]">
        {poolDetails.bondingCurveType !== 'XYK' && (
          <div id="price-input" className="flex flex-col w-full gap-1">
            <div id="price-input-label" className="ml-1 whitespace-nowrap text-[18px] tracking-tight">
              Current Price: {currentPrice.toFixed(4)} BNB
            </div>
            <Input value={price} onUserInput={setPrice} display={tokenDisplay} />
          </div>
        )}

        {poolDetails.bondingCurveType !== 'XYK' && (
          <div id="delta-input" className="flex flex-col w-full gap-1">
            <div id="delta-input-label" className="ml-1 whitespace-nowrap text-[18px] tracking-tight">
              Current Delta:{' '}
              {poolDetails.bondingCurveType === 'EXPONENTIAL'
                ? ((+Web3.utils.fromWei(poolDetails.delta) - 1) * 100).toFixed(2)
                : Web3.utils.fromWei(currentDelta, 'ether')}{' '}
              {poolDetails.bondingCurveType === 'EXPONENTIAL' ? '%' : 'BNB'}
            </div>
            <Input
              value={delta}
              onUserInput={setDelta}
              display={poolDetails.bondingCurveType === 'EXPONENTIAL' ? percentDisplay : tokenDisplay}
            />
          </div>
        )}
        {poolDetails.poolType === 'BUY_AND_SELL' && (
          <div id="fee-input" className="flex flex-col w-full gap-1">
            <div id="fee-input-label" className="ml-1 whitespace-nowrap text-[18px] tracking-tight">
              Current Swap Fee: {(currentFee * 100).toFixed(4)} %
            </div>
            <Input value={fee} max={90} onUserInput={setFee} display={percentDisplay} />
          </div>
        )}
      </div>
      <div id="pool-update-message" style={{ WebkitTextStrokeWidth: '0.01rem' }}>
        <div id="heading" className="w-full pb-2 pl-2 text-left text-[15px] text-gray-400">
          After updating your pool pricing with the above changes:
        </div>
        <div id="message" className="w-full h-auto p-3 text-gray-400 rounded-md bg-dark-800">
          No changes made.
        </div>
      </div>
      <PriceGraph
        poolDetails={poolDetails}
        price={price > 0 ? Web3.utils.toWei(String(price)) : Web3.utils.toWei(String(currentPrice))}
        delta={
          delta
            ? poolDetails.bondingCurveType === 'EXPONENTIAL'
              ? add(Web3.utils.toWei(String(delta / 100)), Web3.utils.toWei('1'))
              : Web3.utils.toWei(String(delta))
            : null
        }
      />{' '}
    </>
  )
}

const DepositTokens = ({ currentTokenBalance, amountToDeposit, setAmountToDeposit, newTokenBalance }) => {
  return (
    <div id="deposit-tokens" className="flex flex-col w-full gap-1 ts-4">
      <div id="current-bal-label" className="ml-1 whitespace-nowrap text-[18px] tracking-tight">
        Current Token Balance: {currentTokenBalance.toFixed(4)} BNB
      </div>

      <div className="flex items-center justify-center pl-4 mb-4 rounded-md bg-dark-800">
        <div className="flex text-[15px] text-center mr-2 ts-1 w-[11rem]">Amount to deposit:</div>
        <Input value={amountToDeposit} onUserInput={setAmountToDeposit} display={tokenDisplay} />
      </div>

      <div id="pool-update-message" className="ts-1">
        <div id="heading" className="w-full pb-2 pl-2 text-left text-[15px] text-gray-400">
          After depositing desired amount of tokens into pool:
        </div>
        <div id="message" className="w-full h-auto p-3 text-white rounded-md ts-4 bg-dark-800">
          <div id="new-bal-label" className="ml-1 whitespace-nowrap text-[18px] tracking-tight">
            New Token Balance:{' '}
            {newTokenBalance.toFixed(4) !== 'NaN' ? newTokenBalance.toFixed(4) : currentTokenBalance.toFixed(4)} BNB
          </div>
        </div>
      </div>
    </div>
  )
}

const WithdrawTokens = ({ currentTokenBalance, amountToWithdraw, setAmountToWithdraw, newTokenBalance }) => {
  return (
    <div id="deposit-tokens" className="flex flex-col w-full gap-1 ts-4">
      <div className="flex items-center justify-between whitespace-nowrap">
        <div id="current-bal-label" className="ml-1 whitespace-nowrap text-[18px] tracking-tight">
          Current Token Balance: {currentTokenBalance.toFixed(4)} BNB
        </div>
        <Button enabled={true} onClick={() => setAmountToWithdraw(currentTokenBalance)}>
          Withdraw All
        </Button>
      </div>

      <div className="flex items-center justify-center pl-4 mb-4 rounded-md bg-dark-800">
        <div className="flex text-[15px] text-center mr-2 ts-1 w-[12rem]">Amount to withdraw:</div>
        <Input
          value={amountToWithdraw}
          max={+currentTokenBalance.toFixed(4)}
          onUserInput={setAmountToWithdraw}
          display={tokenDisplay}
        />
      </div>

      <div id="pool-update-message" className="ts-1">
        <div id="heading" className="w-full pb-2 pl-2 text-left text-[15px] text-gray-400">
          After withdrawing desired amount of tokens from pool:
        </div>
        <div id="message" className="w-full h-auto p-3 text-white rounded-md ts-4 bg-dark-800">
          <div id="new-bal-label" className="ml-1 whitespace-nowrap text-[18px] tracking-tight">
            New Token Balance:{' '}
            {newTokenBalance.toFixed(4) !== 'NaN' ? newTokenBalance.toFixed(4) : currentTokenBalance.toFixed(4)} BNB
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalBody
