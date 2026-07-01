import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../../hooks'
import NftListBox from '../../NftListBox'
import NftSelectionModal from './NftSelectionModal'

const approveEnabled = 'px-3 py-2 border-2 rounded-md border-cyan-blue bg-cyan-blue bg-opacity-70'
const approveDisabled = 'px-3 py-2 border-2 rounded-md border-gray-800 bg-gray-600 bg-opacity-70'
const deselectEnabled = 'px-3 py-2 border border-gray-500 rounded-md w-[12rem]'
const deselectDisabled = 'px-3 py-2 border border-gray-500 rounded-md w-[12rem] text-gray-600'

const FinalizeDeposit = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [nftsToDeposit, setNftsToDeposit] = useState([])
  const [nftsToRemove, setNftsToRemove] = useState([])
  const { account } = useActiveWeb3React()

  const addNftsToDeposit = (ids) => {
    setNftsToDeposit(nftsToDeposit.concat([...ids]))
  }

  const removeNfts = () => {
    let nftsToKeep = nftsToDeposit.filter((nftToKeep) => !nftsToRemove.some((nft) => nftToKeep.tokenId === nft.tokenId))
    setNftsToDeposit([...nftsToKeep])
    setNftsToRemove([])
  }

  useEffect(() => {
    props.setDepositedNfts(nftsToDeposit)
  }, [nftsToDeposit, props.setDepositedNfts])

  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }
  return (
    <>
      <NftSelectionModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        nftCollection={props.nftCollection}
        nftsToDeposit={nftsToDeposit}
        addNftsToDeposit={addNftsToDeposit}
      />
      <div id="step-info" className="w-full mb-3 text-[15px] text-gray-500 tracking-tight">
        <div style={{ WebkitTextStrokeWidth: '0.8px' }}>
          Step {props.currentStep || '?'}/{props.TOTAL_STEPS || '?'}: {props.description || 'DESCRIPTION_TEXT'}
        </div>
      </div>
      <div className="flex">
        <div
          id="finalize-deposit"
          className="items-center w-full h-full p-3 m-3 text-center border-2 border-gray-600 rounded-md"
        >
          <div className="font-bold text-[1.5rem] tracking-tighter px-3 mb-3">Your Pool Details</div>
          <div id="pool-summary" className="flex flex-col max-w-[52rem] mx-auto">
            {props.poolType === 'BUY' && (
              <FinalizeBuy
                totalPurchasePrice={props.totalPurchasePrice}
                token={props.token}
                amountToBuy={props.amountToBuy}
                nftCollection={props.nftCollection}
                startPrice={props.startPrice}
                delta={props.delta}
                bondingCurve={props.bondingCurve}
                executePoolCreation={props.executePoolCreation}
                approved={props.approved}
                approveNftContract={props.approveNftContract}
              />
            )}
            {props.poolType === 'SELL' && (
              <FinalizeSell
                totalSalesPrice={props.totalSalesPrice}
                token={props.token}
                amountToSell={props.amountToSell}
                nftCollection={props.nftCollection}
                startPrice={props.startPrice}
                delta={props.delta}
                bondingCurve={props.bondingCurve}
                openModal={openModal}
                nftsToDeposit={nftsToDeposit}
                account={account}
                nftsToRemove={nftsToRemove}
                setNftsToRemove={setNftsToRemove}
                removeNfts={removeNfts}
                approved={props.approved}
                executePoolCreation={props.executePoolCreation}
                approveNftContract={props.approveNftContract}
              />
            )}
            {props.poolType === 'BUY_AND_SELL' && (
              <FinalizeTrade
                totalPurchasePrice={props.totalPurchasePrice}
                totalSalesPrice={props.totalSalesPrice}
                token={props.token}
                amountToBuy={props.amountToBuy}
                amountToSell={props.amountToSell}
                nftCollection={props.nftCollection}
                startPrice={props.startPrice}
                delta={props.delta}
                bondingCurve={props.bondingCurve}
                nftsToDeposit={nftsToDeposit}
                account={account}
                nftsToRemove={nftsToRemove}
                setNftsToRemove={setNftsToRemove}
                removeNfts={removeNfts}
                openModal={openModal}
                approved={props.approved}
                executePoolCreation={props.executePoolCreation}
                approveNftContract={props.approveNftContract}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const FinalizeBuy = (props) => {
  return (
    <>
      <div id="deposit-info" className="m-[6px] px-3 text-[1.25rem] text-left">
        You are depositing {(+props.totalPurchasePrice).toFixed(3)} {props.token.name} to buy up to {+props.amountToBuy}{' '}
        {props.nftCollection.name}
      </div>
      <div id="start-price-info" className="m-[6px] px-3 text-[1.25rem] text-left">
        Your pool will have a starting price of {props.startPrice} {props.token.name}
      </div>
      {props.bondingCurve !== 'xyk' && (
        <div id="price-adjust-info" className="m-[6px] px-3 text-[1.25rem] text-left">
          Each time your pool buys an NFT, your price will adjust down by
          {props.bondingCurve === 'linear' && ' ' + props.delta + ' ' + props.token.name}{' '}
          {props.bondingCurve === 'exponential' && props.delta + '%'}
        </div>
      )}
      <hr className="bg-gray-800 h-[1px] my-4"></hr>
      <div className="flex items-center justify-center w-full">
        <button
          className="px-3 py-2 border-2 rounded-md border-cyan-blue bg-cyan-blue bg-opacity-70"
          onClick={() => props.executePoolCreation()}
        >
          Create Pool
        </button>
      </div>
    </>
  )
}

const FinalizeSell = (props) => {
  return (
    <>
      <div id="deposit-info" className="m-[6px] px-3 text-[1.25rem] text-left">
        You are depositing {props.amountToSell} {props.nftCollection.name} to sell for up to{' '}
        {(+props.totalSalesPrice).toFixed(3)} {props.token.name}
      </div>
      <div id="start-price-info" className="m-[6px] px-3 text-[1.25rem] text-left">
        Your pool will have a starting price of {props.startPrice} {props.token.name}
      </div>
      {props.bondingCurve !== 'xyk' && (
        <div id="price-adjust-info" className="m-[6px] px-3 text-[1.25rem] text-left">
          Each time your pool sells an NFT, your price will adjust up by
          {props.bondingCurve === 'linear' && ' ' + props.delta + ' ' + props.token.name}
          {props.bondingCurve === 'exponential' && props.delta + '%'}
        </div>
      )}

      <hr className="bg-gray-800 h-[1px] my-4"></hr>
      <div className="text-[1.25rem]">
        Deposit {props.amountToSell} NFT{props.amountToSell > 1 && 's'}
      </div>
      <NftDepositList
        nftsToDeposit={props.nftsToDeposit}
        nftsToRemove={props.nftsToRemove}
        setNftsToRemove={props.setNftsToRemove}
      />
      <div id="flex-container" className="flex">
        <div id="button-group" className="flex items-center justify-center w-full gap-1 m-3">
          <button
            disabled={props.nftsToRemove.length < 1}
            className={props.nftsToRemove.length < 1 ? deselectDisabled : deselectEnabled}
            onClick={() => props.removeNfts()}
          >
            Deselect {props.nftsToRemove.length} NFTs
          </button>
          <button className="px-3 py-2 border border-gray-500 rounded-md w-[12rem]" onClick={() => props.openModal()}>
            Select Your NFTs +
          </button>
        </div>
      </div>

      <hr className="bg-gray-800 h-[1px] my-4"></hr>
      <div className="flex items-center justify-center w-full">
          {props.approved == false && (
              <button
              disabled={props.nftsToDeposit.length !== props.amountToSell}
              className={props.nftsToDeposit.length === props.amountToSell ? approveEnabled : approveDisabled}
              onClick={() => props.approveNftContract()}
          >
              Approve {props.nftCollection.name}
          </button>)}
          {props.approved == true && (
              <button
                  disabled={props.nftsToDeposit.length !== props.amountToSell}
                  className={props.nftsToDeposit.length === props.amountToSell ? approveEnabled : approveDisabled}
                  onClick={() => props.executePoolCreation()}
              >
                  Create Pool
              </button>)}
      </div>
    </>
  )
}

const FinalizeTrade = (props) => {
  return (
    <>
      <div id="deposit-info-token" className="m-[6px] px-3 text-[1.25rem] text-left">
        You are depositing {(+props.totalPurchasePrice).toFixed(3)} {props.token.name} to buy up to {props.amountToBuy}{' '}
        {props.nftCollection.name}
      </div>
      <div id="deposit-info-nft" className="m-[6px] px-3 text-[1.25rem] text-left">
        You are depositing {props.amountToSell} {props.nftCollection.name} to sell for up to{' '}
        {(+props.totalSalesPrice).toFixed(3)} {props.token.name}
      </div>
      <div id="start-price-info" className="m-[6px] px-3 text-[1.25rem] text-left">
        Your pool will have a starting price of {props.startPrice} {props.token.name}
      </div>
      {props.bondingCurve !== 'xyk' && (
        <>
          <div id="buy-price-adjust-info" className="m-[6px] px-3 text-[1.25rem] text-left">
            Each time your pool buys an NFT, your price will adjust down by{' '}
            {props.bondingCurve === 'linear' && ' ' + props.delta + ' ' + props.token.name}{' '}
            {props.bondingCurve === 'exponential' && props.delta + '%'}
          </div>
          <div id="sell-price-adjust-info" className="m-[6px] px-3 text-[1.25rem] text-left">
            Each time your pool sells an NFT, your price will adjust up by{' '}
            {props.bondingCurve === 'linear' && ' ' + props.delta + ' ' + props.token.name}{' '}
            {props.bondingCurve === 'exponential' && props.delta + '%'}
          </div>
        </>
      )}

      <hr className="bg-gray-800 h-[1px] my-4"></hr>
      <div className="text-[1.25rem]">
        Deposit {props.amountToSell} NFT{props.amountToSell > 1 && 's'}
      </div>
      <NftDepositList
        nftsToDeposit={props.nftsToDeposit}
        nftsToRemove={props.nftsToRemove}
        setNftsToRemove={props.setNftsToRemove}
      />
      <div id="flex-container" className="flex">
        <div id="button-group" className="flex items-center justify-center w-full gap-1 m-3">
          <button
            disabled={props.nftsToRemove.length < 1}
            className={props.nftsToRemove.length < 1 ? deselectDisabled : deselectEnabled}
            onClick={() => props.removeNfts()}
          >
            Deselect {props.nftsToRemove.length} NFTs
          </button>
          <button className="px-3 py-2 border border-gray-500 rounded-md w-[12rem]" onClick={() => props.openModal()}>
            Select Your NFTs +
          </button>
        </div>
      </div>

      <hr className="bg-gray-800 h-[1px] my-4"></hr>
      <div className="flex items-center justify-center w-full">
          {props.approved == false && (
              <button
                  disabled={props.nftsToDeposit.length !== props.amountToSell}
                  className={props.nftsToDeposit.length === props.amountToSell ? approveEnabled : approveDisabled}
                  onClick={() => props.approveNftContract()}
              >
                  Approve {props.nftCollection.name}
              </button>)}
          {props.approved == true && (
              <button
                  disabled={props.nftsToDeposit.length !== props.amountToSell}
                  className={props.nftsToDeposit.length === props.amountToSell ? approveEnabled : approveDisabled}
                  onClick={() => props.executePoolCreation()}
              >
                  Create Pool
              </button>)}
      </div>
    </>
  )
}

const NftDepositList = ({ nftsToDeposit, nftsToRemove, setNftsToRemove }) => {
  return (
    <NftListBox
      selectEnabled
      listStyle="grid2"
      nfts={nftsToDeposit}
      selectedNfts={nftsToRemove}
      setSelectedNfts={setNftsToRemove}
      className="min-h-[200px] max-h-[375px]"
    />
  )
}

export default FinalizeDeposit
