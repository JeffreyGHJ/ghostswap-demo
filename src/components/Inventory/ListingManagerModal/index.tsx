import { useEffect, useState } from 'react'
import { X } from 'react-feather'
import useBlockInvalidInput from '../../../hooks/useBlockInvalidInput'
import Modal from '../../Modal'
import NftListBox from '../../NftListBox'
import SplitPane from '../../SplitPane'
import Toggle from '../../Toggle'
import Filters from './Filters'
import { mapSelectedNftsToCollections } from '../functions'
import { LINEAR_CURVE, NFT_FACTORY } from '../../../config/contracts'
import Web3 from 'web3'
import { getSigner } from '../../../functions'
import { Contract } from '@ethersproject/contracts'
import { BEP721_ABI, FACTORY_ABI } from '../../../web3/abi'
import { useActiveWeb3React } from '../../../hooks'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import { useWeb3React } from '@web3-react/core'

const buttonBaseStyle =
  ' px-3 py-2 bg-opacity-50 border-2 rounded-md text-bold border-opacity-80 hover:bg-opacity-100 hover:border-opacity-100 '
const buttonEnabled = ' border-cyan-blue bg-cyan-blue '
const buttonDisbaled = ' border-gray-800 bg-gray-800 text-gray-500 '

const ListingManager = (props) => {
  const [nfts, setNfts] = useState([])
  const [collections, setCollections] = useState(new Map())
  const [currentCollection, setCurrentCollection] = useState('')
  const [currentNftData, setCurrentNftData] = useState([])
  const [searchString, setSearchString] = useState('')
  const [startPrice, setStartPrice] = useState('')
  const [delta, setDelta] = useState('0')
  const [canSubmit, setCanSubmit] = useState(false)
  const [approved, setApproved] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const validateKeyDown = useBlockInvalidInput()
  //   const { account, library } = useActiveWeb3React()
  const { account, provider } = useWeb3React()

  useEffect(() => {
    if (props.modalOpen) {
      // console.log('setting to first')
      // console.log(collections.keys())
      setCurrentCollection(Array.from(collections.keys())[0])
    }
  }, [props.modalOpen])

  const toggleShowFilters = () => {
    setShowFilters(!showFilters)
  }

  // removing an nft will update collections and currentCollection may no longer be in map
  useEffect(() => {
    let nftData = []
    if (currentCollection != '') {
      let collection = collections.get(currentCollection)
      for (let tokenId of collection?.tokenIds) {
        nftData.push({
          tokenId: tokenId,
          name: collection.name,
          tokenAddress: currentCollection,
        })
      }
    }
    setCurrentNftData(nftData)
  }, [currentCollection, collections])

  useEffect(() => {
    if (nfts.length < 1) {
      props.setModalOpen(false)
      return
    }
    let collections = mapSelectedNftsToCollections(nfts)
    if (collections.get(currentCollection) === undefined) {
      let newCurrentCollection = Array.from(collections.keys())[0]
      setCurrentCollection(newCurrentCollection)
    }
    setCollections(collections)
  }, [nfts])

  useEffect(() => {
    setNfts(props.selectedNfts)
  }, [props.selectedNfts])

  useEffect(() => {
    if (props.modalOpen) checkApproval()
  }, [currentCollection, props.modalOpen])

  const checkApproval = () => {
    if (currentCollection) {
      const contract = new Contract(currentCollection, BEP721_ABI, provider)
      contract.isApprovedForAll(account, NFT_FACTORY).then((result) => {
        setApproved(result)
      })
    }
  }
  const approveNftContract = async () => {
    const signer = getSigner(provider, account)
    const contract = new Contract(currentCollection, BEP721_ABI, signer)
    contract.setApprovalForAll(NFT_FACTORY, true).then((transactionResponse) => {
      transactionResponse.wait().then((receipt) => {
        if (receipt && receipt.blockNumber) {
          Toastify({
            text: 'Successfully Approved NFT Contract!',
            duration: 1500,
            newWindow: true,
            close: true,
            gravity: 'top', // `top` or `bottom`
            position: 'right', // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: 'linear-gradient(to right, #00b09b, #96c93d)',
            },
            onClick: function () {}, // Callback after click
          }).showToast()
          setApproved(true)
        }
      })
    })
  }

  const executeListing = () => {
    const signer = getSigner(provider, account)
    const contract = new Contract(NFT_FACTORY, FACTORY_ABI, signer)
    let nftIds = []

    for (const nft of currentNftData) {
      nftIds.push(nft.tokenId)
    }

    let priceBefore = +startPrice

    if (startPrice >= delta) {
      priceBefore = +startPrice - +delta
    }

    contract
      .createPairETH(
        currentCollection,
        LINEAR_CURVE,
        account,
        1,
        Web3.utils.toWei(String(delta)),
        0,
        Web3.utils.toWei(String(priceBefore)),
        nftIds
      )
      .then((transactionResponse) => {
        transactionResponse.wait().then((receipt) => {
          if (receipt && receipt.blockNumber) {
            Toastify({
              text: 'Successfully listed ' + nftIds.length + ' NFTs.',
              duration: 1500,
              newWindow: true,
              close: true,
              gravity: 'top', // `top` or `bottom`
              position: 'right', // `left`, `center` or `right`
              stopOnFocus: true, // Prevents dismissing of toast on hover
              style: {
                background: 'linear-gradient(to right, #00b09b, #96c93d)',
              },
              onClick: function () {}, // Callback after click
            }).showToast()
            props.setModalOpen(false)
            props.refreshData()
            //success
          }
        })
      })
  }

  useEffect(() => {
    setCanSubmit(+startPrice > 0 && delta !== '')
  }, [startPrice, delta])

  const Collections = (
    <div id="collections-list" className="flex flex-col w-full pl-[.1rem] bg-black">
      <div id="heading" className="text-center">
        Collections
      </div>
      <Filters
        collections={collections}
        currentCollection={currentCollection}
        setCollection={setCurrentCollection}
        setSearchString={setSearchString}
        searchString={searchString}
      />
    </div>
  )

  const ManagerControls = (
    <div id="manager-controls" className="flex flex-col h-full p-3 bg-dark-900">
      <div id="heading" className="w-full text-left text-[20px] font-bold mb-4">
        {currentNftData?.length > 0 && (
          <>
            You are listing {currentNftData.length} {currentNftData[0].name}{' '}
          </>
        )}
      </div>
      <div id="filters-toggle" className="flex items-center gap-2 text-[15px] px-1 py-[0.375rem]">
        <div className="ts-[thin]">Show Filters</div>
        <Toggle isActive={showFilters} toggle={toggleShowFilters} />
      </div>
      <NftListBox
        nfts={currentNftData}
        selectedNfts={props.selectedNfts} // the nfts selected from the inventory page
        setSelectedNfts={props.setSelectedNfts} // for removing nfts selected from inventory
        listStyle="row"
        mode="listing"
        selectEnabled
      />
      <div id="price-settings" className="flex flex-col p-[6px]">
        <PriceControls startPrice={startPrice} setStartPrice={setStartPrice} validateKeyDown={validateKeyDown} />
        <DeltaControls delta={delta} setDelta={setDelta} validateKeyDown={validateKeyDown} />
        <ApproveListing
          executeListing={executeListing}
          approveNftContract={approveNftContract}
          canSubmit={canSubmit}
          currentNftData={currentNftData}
          approved={approved}
        />
      </div>
    </div>
  )

  return (
    <>
      {props.modalOpen && (
        <Modal
          isOpen={props.modalOpen}
          onDismiss={() => props.setModalOpen(false)}
          padding={0}
          maxWidth={820}
          height={900}
        >
          <div className="flex flex-col h-full">
            <ModalHeader closeModal={() => props.setModalOpen(false)} />
            <div className="flex w-full h-full overflow-auto">
              <SplitPane
                left={Collections}
                showLeft={showFilters}
                right={ManagerControls}
                rightStyles="w-auto"
                leftStyles="bg-black"
                split="left"
                container="flex h-full lg:flex-row justify-between overflow-auto bg-black"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

const ModalHeader = ({ closeModal }) => {
  return (
    <div id="header" className="relative flex items-center justify-center px-6 py-4 border-b border-b-dark-500">
      <div id="title" className="text-[20px] w-[full] text-center font-bold ">
        Listing Manager
      </div>
      <div
        id="close-modal-btn"
        className="absolute top-0 right-0 p-4 text-gray-500 cursor-pointer hover:text-white"
        onClick={() => closeModal()}
      >
        <X size={30} />
      </div>
    </div>
  )
}

const PriceControls = ({ startPrice, setStartPrice, validateKeyDown }) => {
  return (
    <div id="start-price">
      <div className="text-[17px] font-bold mb-3">Start Price</div>
      <div className="text-[15px] text-secondary">All NFTs will first be listed at this price.</div>
      <div id="price-input" className="flex flex-col justify-between w-[20rem] my-3">
        <div
          id="input-group"
          className="flex items-center overflow-hidden w-full border relative h-[2.8rem] border-gray-600 rounded-[.25rem]"
        >
          <input
            type="number"
            placeholder="Enter price"
            value={startPrice || ''}
            min={0}
            step={0.001}
            onKeyDown={(e) => validateKeyDown(e, 'decimal')}
            onChange={(e) => setStartPrice(e.target.value)}
            className="pl-3 py-2 bg-black leading-[1.5] w-full h-full"
          ></input>
          <div id="currency-display" className="flex items-center px-3 border-l border-l-[#161522] h-full">
            <div id="icon-container" className="w-[20px] h-[20px]">
              <img src="/images/tokens/bnb-icon.png" width={20} height={20}></img>
            </div>
            <div className="ml-1 font-bold">BNB</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const DeltaControls = ({ delta, setDelta, validateKeyDown }) => {
  return (
    <div id="delta">
      <div className="text-[17px] font-bold mb-3">Price Increase</div>
      <div className="text-[15px] text-secondary">
        Each time an NFT is sold, all remaining NFTs will increase their price this much.
      </div>

      <div id="delta-input" className="flex flex-col justify-between w-[20rem] my-3">
        <div
          id="input-group"
          className="flex items-center w-full overflow-hidden border relative h-[2.8rem] border-gray-600 rounded-[.25rem]"
        >
          <input
            type="number"
            placeholder="Enter increase amount"
            value={delta || ''}
            min={0}
            step={0.001}
            onKeyDown={(e) => validateKeyDown(e, 'decimal')}
            onChange={(e) => setDelta(e.target.value)}
            className="pl-3 py-2 bg-black leading-[1.5] w-full h-full"
          ></input>
          <div id="currency-display" className="flex items-center px-3 border-l border-l-[#161522] h-full">
            <div id="icon-container" className="w-[20px] h-[20px]">
              <img src="/images/tokens/bnb-icon.png" width={20} height={20}></img>
            </div>
            <div className="ml-1 font-bold">BNB</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ApproveListing = ({ executeListing, approveNftContract, canSubmit, currentNftData, approved }) => {
  return (
    <>
      <div id="notification" className="text-[15px] text-secondary m-3 tracking-tighter">
        Note: Listing these NFTs will deposit them into a pool contract that you own.
        <br />
        They will no longer be in your wallet, but you can withdraw them at any time by going to Your Pools.
      </div>
      <div id="approve-btn" className="flex m-3">
        {approved ? (
          <button
            onClick={() => {
              executeListing()
            }}
            disabled={!canSubmit}
            className={buttonBaseStyle + (canSubmit ? buttonEnabled : buttonDisbaled)}
          >
            List NFTs
          </button>
        ) : (
          <button
            onClick={() => {
              approveNftContract()
            }}
            disabled={!canSubmit}
            className={buttonBaseStyle + (canSubmit ? buttonEnabled : buttonDisbaled)}
          >
            Approve {currentNftData[0]?.name ? currentNftData[0].name : ''}
          </button>
        )}
      </div>
    </>
  )
}

export default ListingManager
