import useSwitchChain from '../../../../hooks/useSwitchChain'

const buttonBase = ' py-2 px-3 border border-[#0d111c] rounded-[.25rem] tracking-tight bg-opacity-50 select-none '
const buttonEnabled = ' text-white cursor-pointer bg-blue hover:border-blue hover:bg-opacity-80 '
const buttonDisabled = ' text-gray-400 cursor-default bg-dark-800 pointer-events-none '
const ModalFooter = ({ canEdit, updateIsValid, handleUpdatePool, chainId, poolDetails }) => {
  const { switchChain } = useSwitchChain()
  return (
    <div id="modal-footer" className="relative flex items-center justify-center max-w-full p-4">
      {chainId !== poolDetails.networkId && (
        <div className={buttonBase + buttonEnabled} onClick={() => switchChain(poolDetails.networkId)}>
          Switch to
          {poolDetails.networkId === 56 && ' Binance '}
          {poolDetails.networkId === 137 && ' Polygon '}
          Network
        </div>
      )}
      {chainId === poolDetails.networkId && (
        <div
          id="update-pool-btn"
          className={buttonBase + (updateIsValid && canEdit ? buttonEnabled : buttonDisabled)}
          onClick={() => handleUpdatePool()}
        >
          Update
        </div>
      )}
    </div>
  )
}

export default ModalFooter
