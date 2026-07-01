import Modal from '../../components/Modal'
import ModalHeader from '../../components/ModalHeader'
import Account from './Account'

const WalletModalV2 = ({ modalOpen, setModalOpen, ENSName, account, chainId, showConnectionOptions }) => {
  const handleClose = () => {
    setModalOpen(false)
  }

  return (
    <Modal isOpen={modalOpen} onDismiss={() => setModalOpen(false)}>
      <ModalHeader title={'Account'} onClose={() => handleClose()} />
      <Account account={account} ENSName={ENSName} chainId={chainId} showConnectionOptions={showConnectionOptions} />
    </Modal>
  )
}

export default WalletModalV2
