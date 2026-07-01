import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../../../hooks'
import ThreePartModal from '../../../Modal/ThreePartModal'
import NftListBox from '../../../NftListBox'
import axios from 'axios'

const NftSelectionModal = (props) => {
  const { account } = useActiveWeb3React()
  const bnbBalance = useSelector((state: any) => state.walletAssets.bnbBalance)
  const [selectedToDeposit, setSelectedToDeposit] = useState([])
  const [assets, setAssets] = useState([])
  const [undepositedAssets, setUndepositedAssets] = useState([])

  const deselectAll = () => {
    setSelectedToDeposit([])
  }

  const selectAll = () => {
    setSelectedToDeposit([...undepositedAssets].filter((nft) => !props.nftsToDeposit.includes(nft.tokenId)))
  }

  const fetchAssets = async (account, address) => {
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_AWS_URL}api/collection/account/` + account + '/moralis/assets/collection/' + address
      )
      .then((response) => {
        setAssets(response.data)
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('fetchData() aborted')
        } else {
          console.log(error?.response?.data)
        }
      })
  }

  useEffect(() => {
    fetchAssets(account, props.nftCollection.address)
  }, [account, props.nftCollection.address])

  useEffect(() => {
    console.log(selectedToDeposit)
  }, [selectedToDeposit])

  useEffect(() => {
    let undeposited = assets?.filter((asset) => {
      for (let nft of props.nftsToDeposit) if (nft.tokenId === asset.tokenId) return false
      return asset
    })
    setUndepositedAssets(undeposited)
  }, [assets, props.nftsToDeposit])

  return (
    <ThreePartModal
      isOpen={props.isOpen}
      closeModal={props.closeModal}
      header={<ModalHeader />}
      body={
        <ModalBody
          account={account}
          closeModal={props.closeModal}
          nftsToDeposit={props.nftsToDeposit}
          selectedToDeposit={selectedToDeposit}
          undepositedAssets={undepositedAssets}
          setSelectedToDeposit={setSelectedToDeposit}
          deselectAll={deselectAll}
          selectAll={selectAll}
        />
      }
      footer={
        <ModalFooter
          selectedToDeposit={selectedToDeposit}
          addNftsToDeposit={props.addNftsToDeposit}
          closeModal={props.closeModal}
          deselectAll={deselectAll}
        />
      }
    />
  )
}

const ModalFooter = ({ selectedToDeposit, addNftsToDeposit, closeModal, deselectAll }) => {
  return (
    <div id="confirm-selections" className="flex items-center justify-center w-full">
      <button
        id="confirm-btn"
        className="px-3 py-2 border border-black rounded-md hover:border-gray-800 hover:bg-gray-800"
        onClick={() => {
          addNftsToDeposit(selectedToDeposit)
          deselectAll()
          closeModal()
        }}
      >
        Select {selectedToDeposit.length} NFT{selectedToDeposit.length === 1 ? '' : 's'}
      </button>
    </div>
  )
}

const ModalHeader = () => {
  return (
    <div
      id="title"
      className="flex flex-row items-center justify-center mt-1 font-semibold text-center text-[1.25rem] leading-[1.1] tracking-[-.02em]"
    >
      Select Your NFTs
    </div>
  )
}

const ModalBody = (props) => {
  return (
    <div id="modal-body" className="">
      <div id="quick-select-buttons" className="flex items-center justify-end w-full gap-2 mb-[6px]">
        <button
          id="deselect-all"
          className="py-[2px] px-2 border rounded-md border-black hover:bg-gray-800 hover:border-gray-800"
          onClick={() => props.deselectAll()}
        >
          Deselect All
        </button>
        <button
          id="select-all"
          className="py-[2px] px-2 border rounded-md border-black hover:bg-gray-800 hover:border-gray-800"
          onClick={() => props.selectAll()}
        >
          Select All
        </button>
      </div>
      <NftListBox
        selectEnabled
        listStyle="grid1"
        nfts={props.undepositedAssets}
        selectedNfts={props.selectedToDeposit}
        setSelectedNfts={props.setSelectedToDeposit}
      />
    </div>
  )
}

export default NftSelectionModal
