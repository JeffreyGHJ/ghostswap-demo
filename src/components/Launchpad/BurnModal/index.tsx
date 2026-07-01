import Modal from '../../Modal'
import NftListBox from '../../NftListBox'
import { X } from 'react-feather'
import { CheckIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

const buttonBaseStyle =
  ' w-32 xxs:w-40 px-1 xxs:px-3 py-2 bg-opacity-50 select-none border-2 rounded-md text-bold border-opacity-80 text-center text-[14px] xxs:text-[16px] '
const buttonEnabled = ' border-cyan-blue bg-cyan-blue hover:bg-opacity-100 hover:border-opacity-100 cursor-pointer '
const buttonDisbaled = ' border-gray-800 bg-gray-800 text-gray-500 '
const closeModalBtn = 'absolute top-0 right-0 p-2 text-gray-500 cursor-pointer xxs:p-4 hover:text-white'
const footer = 'relative flex items-center justify-center px-6 py-4 border-t gap-x-[2rem] border-t-dark-500'
const confirm = 'flex items-center justify-center text-[28px] font-bold cursor-pointer mb-4 w-fit mx-auto'
const checkBox = 'w-[22px] h-[22px] bg-black border-2 border-gray-500 rounded-[4px] ml-1 flex-none hover:border-white'

const BurnModal = ({
  modalOpen,
  setModalOpen,
  littleGhostsOwned,
  selectedGhosts,
  setSelectedGhosts,
  burnModalStep,
  setBurnModalStep,
  amountToMint,
  checkAndApproveSoulEaters,
  isApproved,
  approvalPending,
  approvalRejected,
  setApprovalRejected,
  executeMintWithBurn,
}) => {
  const [confirmed, setConfirmed] = useState(false)
  const [burnAmount, setBurnAmount] = useState(amountToMint * 2)

  useEffect(() => {
    setBurnAmount(amountToMint * 2)
  }, [amountToMint])

  useEffect(() => {
    if (!modalOpen) {
      setBurnModalStep(1)
      setSelectedGhosts([])
      setConfirmed(false)
    }
  }, [modalOpen])

  useEffect(() => {
    if (burnModalStep !== 2) setConfirmed(false)
  }, [burnModalStep])

  return (
    <Modal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} maxWidth={800} padding={0}>
      <ModalHeader
        setModalOpen={setModalOpen}
        burnModalStep={burnModalStep}
        selectedGhosts={selectedGhosts}
        burnAmount={burnAmount}
        amountToMint={amountToMint}
      />
      <ModalBody
        littleGhostsOwned={littleGhostsOwned}
        selectedGhosts={selectedGhosts}
        setSelectedGhosts={setSelectedGhosts}
        burnModalStep={burnModalStep}
        setBurnModalStep={setBurnModalStep}
        burnAmount={burnAmount}
        confirmed={confirmed}
        setConfirmed={setConfirmed}
      />
      <ModalFooter
        selectedGhosts={selectedGhosts}
        setSelectedGhosts={setSelectedGhosts}
        burnModalStep={burnModalStep}
        setBurnModalStep={setBurnModalStep}
        amountToMint={amountToMint}
        burnAmount={burnAmount}
        confirmed={confirmed}
        checkAndApproveSoulEaters={checkAndApproveSoulEaters}
        isApproved={isApproved}
        approvalPending={approvalPending}
        approvalRejected={approvalRejected}
        setApprovalRejected={setApprovalRejected}
        executeMintWithBurn={executeMintWithBurn}
      />
    </Modal>
  )
}

const ModalHeader = ({ setModalOpen, burnModalStep, selectedGhosts, burnAmount, amountToMint }) => {
  return (
    <div id="header" className="relative flex items-center justify-center px-6 py-2 border-b border-b-dark-500">
      <div className="flex flex-col">
        <div id="title" className="text-[20px] w-[full] text-center font-bold ">
          {burnModalStep === 1 && 'Select LittleGhosts'}
          {burnModalStep === 2 && 'Confirm Burn to Mint'}
        </div>
        <div id="status" className="text-[14px] w-[full] text-center text-pink leading-[0.9] ">
          {burnModalStep === 1 && `${selectedGhosts.length} out of ${burnAmount} Selected`}
          {burnModalStep === 2 && `Minting ${amountToMint} SoulEater${amountToMint > 1 ? 's' : ''}`}
        </div>
      </div>
      <div className={closeModalBtn} onClick={() => setModalOpen(false)}>
        <X className="w-5 h-5 xxs:w-7 xxs:h-7" />
      </div>
    </div>
  )
}

const ModalBody = ({
  littleGhostsOwned,
  selectedGhosts,
  setSelectedGhosts,
  burnModalStep,
  setBurnModalStep,
  burnAmount,
  confirmed,
  setConfirmed,
}) => {
  return (
    <div id="modal-body" className=" h-1 w-full min-h-[52vh] max-h-[65vh] overflow-y-auto overflow-x-hidden">
      {burnModalStep === 1 && (
        <NftListBox
          listStyle="grid3"
          nfts={littleGhostsOwned} // all nfts to pick from
          selectedNfts={selectedGhosts} // array to set picked nfts
          setSelectedNfts={setSelectedGhosts} // function to set picked nfts into array
          selectEnabled // enables click event for picking
          nftSize="medium"
          mode="default"
          listClass="lg:justify-start content-start"
          maxSelection={burnAmount}
        />
      )}
      {burnModalStep === 2 && (
        <div className="relative flex flex-col justify-between w-full h-full">
          <div className="flex flex-col justify-center w-full my-auto">
            <div className="text-[20px] xxs:text-[22px] sm:text-[26px] font-bold text-center text-pink px-3 sm:px-12 pb-2 tracking-tight">
              By clicking “Confirm”, I acknowledge that I am choosing to permanently destroy (burn) my LittleGhosts NFTs
              in order to mint SoulEater NFTs with a conversion ratio of 2 LittleGhosts burned for 1 SoulEater minted.
            </div>
            <NftListBox
              listStyle="rowCentered"
              className={'my-0'}
              nfts={selectedGhosts}
              nftSize="small"
              mode="default"
            />
          </div>
          <div className={confirm} onClick={() => setConfirmed(!confirmed)}>
            <div className={checkBox}>{confirmed && <CheckIcon />}</div>
            Confirm
          </div>
          <div className="text-center text-secondary">
            <span className="cursor-pointer hover:text-white" onClick={() => setBurnModalStep(1)}>
              Go Back
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

const ModalFooter = ({
  selectedGhosts,
  setSelectedGhosts,
  burnModalStep,
  setBurnModalStep,
  amountToMint,
  burnAmount,
  confirmed,
  checkAndApproveSoulEaters,
  isApproved,
  approvalPending,
  approvalRejected,
  setApprovalRejected,
  executeMintWithBurn,
}) => {
  return (
    <div className={footer}>
      {burnModalStep === 1 && (
        <>
          <div
            className={buttonBaseStyle + (selectedGhosts?.length > 0 ? buttonEnabled : buttonDisbaled)}
            onClick={() => (selectedGhosts?.length > 0 ? setSelectedGhosts([]) : {})}
          >
            Deselect ({selectedGhosts?.length || 0})
          </div>
          <div
            className={buttonBaseStyle + (selectedGhosts?.length === burnAmount ? buttonEnabled : buttonDisbaled)}
            onClick={() => (selectedGhosts?.length === burnAmount ? setBurnModalStep(2) : {})}
          >
            Continue
          </div>
        </>
      )}
      {burnModalStep === 2 && (
        <div className="flex flex-col items-center">
          <div style={{ width: '14rem' }} className={buttonBaseStyle + (confirmed ? buttonEnabled : buttonDisbaled)}>
            {isApproved && isApproved !== undefined && (
              <div onClick={() => executeMintWithBurn()}>
                Mint {amountToMint} SoulEater{amountToMint > 1 ? 's' : ''}
              </div>
            )}
            {(!isApproved || isApproved === undefined) && (
              <>
                {approvalPending && <>Approval Pending...</>}
                {!approvalPending && (
                  <>
                    {!approvalRejected && (
                      <div
                        className={confirmed ? '' : 'pointer-events-none'}
                        onClick={() => checkAndApproveSoulEaters()}
                      >
                        Approve
                      </div>
                    )}
                    {approvalRejected && <div onClick={() => setApprovalRejected(false)}>Approval Rejected</div>}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BurnModal
