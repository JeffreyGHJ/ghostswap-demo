import { useEffect, useState } from 'react'
import Modal from '../../Modal'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { getSigner } from '../../../functions'
import { Contract } from '@ethersproject/contracts'
import { NFT_FACTORY } from '../../../config/contracts'
import { BNB_PAIR, FACTORY_ABI } from '../../../web3/abi'
import 'toastify-js/src/toastify.css'
import { useWeb3React } from '@web3-react/core'
import useToastify from '../../../hooks/useToastify'
import { depositNfts, depositTokens, editPricing, validateInputs, withdrawNfts, withdrawTokens } from './functions'
import ModalHeader from './ModalHeader'
import ModalBody from './ModalBody'
import ModalFooter from './ModalFooter'

const EditPoolModal = ({ modalState, closeModal, poolDetails, nfts, ownedNfts, canEdit, account, poolAddress }) => {
  const currentTokenBalance = +Web3.utils.fromWei(poolDetails.balanceNBT, 'ether')
  const currentPrice = +Web3.utils.fromWei(
    poolDetails.poolType === 'BUY' ? poolDetails.floorNBT : poolDetails.offerNBT,
    'ether'
  )
  const currentFee = +Web3.utils.fromWei(poolDetails.fee, 'ether')
  const currentDelta = poolDetails.delta
  const { provider, chainId, connector } = useWeb3React()
  const { toastSuccess, toastError } = useToastify()

  // For Edit Pricing
  const [price, setPrice] = useState('')
  const [delta, setDelta] = useState('')
  const [fee, setFee] = useState('')

  // For Edit Tokens
  const [amountToDeposit, setAmountToDeposit] = useState('')
  const [amountToWithdraw, setAmountToWithdraw] = useState('')
  const [newTokenBalance, setNewTokenBalance] = useState(new BigNumber(0))

  // For Edit NFTs
  const [nftsToWithdraw, setNftsToWithdraw] = useState([])
  const [nftsToDeposit, setNftsToDeposit] = useState([]) // get assets from wallet

  // Validation
  const [updateIsValid, setUpdateIsValid] = useState(false)
  const [error, setError] = useState(undefined) // if transaction errors change button text

  useEffect(() => {
    setUpdateIsValid(
      validateInputs(
        account,
        modalState,
        canEdit,
        poolDetails,
        price,
        fee,
        delta,
        amountToDeposit,
        amountToWithdraw,
        nftsToDeposit,
        nftsToWithdraw
      )
    )
  }, [
    account,
    modalState,
    poolDetails,
    price,
    delta,
    fee,
    amountToDeposit,
    amountToWithdraw,
    nftsToDeposit,
    nftsToWithdraw,
  ])

  useEffect(() => {
    let balance = new BigNumber(currentTokenBalance)
    if (modalState === 'deposit-tokens') balance = balance.plus(new BigNumber(amountToDeposit))
    if (modalState === 'withdraw-tokens') balance = balance.minus(new BigNumber(amountToWithdraw))
    setNewTokenBalance(balance)
  }, [currentTokenBalance, amountToDeposit, amountToWithdraw, modalState])

  const handleUpdatePool = async () => {
    const signer = getSigner(provider, account)
    const contract = new Contract(poolAddress, BNB_PAIR, signer)
    const factory = new Contract(NFT_FACTORY, FACTORY_ABI, signer)

    if (modalState === 'withdraw-tokens')
      withdrawTokens(contract, currentTokenBalance, amountToWithdraw, toastSuccess, toastError, closeModal)
    else if (modalState === 'deposit-tokens')
      depositTokens(provider, signer, poolAddress, amountToDeposit, toastSuccess, toastError, closeModal)
    else if (modalState === 'withdraw-nfts')
      withdrawNfts(nftsToWithdraw, contract, poolDetails, toastSuccess, toastError, closeModal)
    else if (modalState === 'deposit-nfts')
      depositNfts(nftsToDeposit, factory, poolDetails, poolAddress, toastSuccess, toastError, closeModal)
    else if (modalState === 'edit-pricing')
      editPricing(poolDetails, delta, price, currentDelta, fee, contract, toastSuccess, toastError, closeModal)
    // else if (modalState === 'withdraw-all') withdrawAllTokens(contract, toastSuccess, toastError, closeModal)
    else console.log('Error: unexpected state in EditPoolModal.')
  }

  return (
    <Modal isOpen={modalState !== 'closed'} onDismiss={() => closeModal()} padding={0} maxWidth={900}>
      <div className="flex flex-col h-full">
        <ModalHeader modalState={modalState} closeModal={closeModal} />
        <ModalBody
          modalState={modalState}
          poolDetails={poolDetails}
          nfts={nfts}
          price={price}
          delta={delta}
          fee={fee}
          setPrice={setPrice}
          setDelta={setDelta}
          setFee={setFee}
          currentTokenBalance={currentTokenBalance}
          currentPrice={currentPrice}
          currentFee={currentFee}
          currentDelta={currentDelta}
          amountToDeposit={amountToDeposit}
          newTokenBalance={newTokenBalance}
          setAmountToDeposit={setAmountToDeposit}
          amountToWithdraw={amountToWithdraw}
          setAmountToWithdraw={setAmountToWithdraw}
          nftsToWithdraw={nftsToWithdraw}
          nftsToDeposit={nftsToDeposit}
          setNftsToWithdraw={setNftsToWithdraw}
          setNftsToDeposit={setNftsToDeposit}
          ownedNfts={ownedNfts}
        />
        <ModalFooter
          canEdit={canEdit}
          updateIsValid={updateIsValid}
          handleUpdatePool={handleUpdatePool}
          chainId={chainId}
          poolDetails={poolDetails}
        />
      </div>
    </Modal>
  )
}

export default EditPoolModal
