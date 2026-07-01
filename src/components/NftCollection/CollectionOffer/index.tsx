import { useState } from 'react'
import { CollectionOfferModal } from './CollectionOfferModal'
import { ArrowTooltipBordered as Tooltip } from '../../Tooltip'
import Button from '../../Button'

const CollectionOffer = ({ account, liqPools, details, bestOffer, floorPrice }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [show, setShow] = useState(false)

  const openModal = () => {
    if (account) {
      setModalIsOpen(true)
    }
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  return (
    <div className="flex items-center justify-center">
      <Tooltip show={show && !account} content={'Connect wallet to make collection offers'}>
        <Button
          id="collection-offer-btn"
          variant="outlined"
          color="gray"
          size="sm"
          className="border-2 border-dark-900 hover:border-dark-800"
          onClick={openModal}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          Make Collection Offer
        </Button>
      </Tooltip>
      <CollectionOfferModal
        highestOffer={bestOffer}
        lowestFloor={floorPrice}
        liqPools={liqPools}
        details={details}
        isOpen={modalIsOpen}
        closeModal={closeModal}
      />
    </div>
  )
}

export default CollectionOffer
