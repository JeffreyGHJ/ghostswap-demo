import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NftListBox from '../NftListBox'
import PoolCard from '../PoolCard'
import PoolNotFoundNotification from '../PoolNotFoundNotification'
import Input from '../PoolViewer/Input'
import axios from 'axios'
import useDefinedApi from '../../hooks/useDefinedApi'
import { getNftDataFromPool } from '../PoolViewer/functions'
import { useActiveWeb3React } from '../../hooks'
import Web3 from 'web3'
import { ethers } from 'ethers'
import { getSigner } from '../../functions'
import { Contract } from '@ethersproject/contracts'
import { NFT_FACTORY, NFT_ROUTER } from '../../config/contracts'
import { BEP721_ABI, NFT_ROUTER_ABI } from '../../web3/abi'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import useCollectionApi from '../../hooks/useCollectionApi'
import { useWeb3React } from '@web3-react/core'

const inputContainerClass = 'flex items-center overflow-hidden border border-dark-850 rounded-md bg-black'
const inputClass = ' bg-black leading-[1.5] w-full h-[1rem] w-[3rem] text-[.8rem] p-[12px] px-[6px]'

const PoolSwap = () => {
  const router = useRouter()
  const { address: poolAddress } = router.query
  const [poolDetails, setPoolDetails] = useState(null)
  const [selectedForPurchase, setSelectedForPurchase] = useState([])
  const [selectedForSale, setSelectedForSale] = useState([])
  const [nfts, setNfts] = useState([])
  const [price, setPrice] = useState('?')
  //   const { account, library } = useActiveWeb3React()
  const { account, provider, chainId } = useWeb3React()
  const [ownedNfts, setOwnedNfts] = useState([])
  const [approved, setApproved] = useState(false)
  const dummyIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [slippage, setSlippage] = useState('')
  const [mode, setMode] = useState('BUY')
  const collections = useSelector((state: any) => state.nftMarket.collections)
  const { getNftPool } = useDefinedApi()
  const { fetchNftsOwnedInCollection } = useCollectionApi()

  useEffect(() => {
    getNftPool(poolAddress, setPoolDetails, axios.CancelToken.source())
  }, [poolAddress, collections])

  useEffect(() => {
    setNfts(getNftDataFromPool(poolDetails))
  }, [poolDetails])

  useEffect(() => {
    if (poolDetails) {
      if (poolDetails.poolType === 'SELL') {
        setMode('SELL')
      } else if (poolDetails.poolType === 'BUY') {
        setMode('BUY')
      }
    }
  }, [poolDetails])

  useEffect(() => {
    if (poolDetails && account) {
      fetchNftsOwnedInCollection(account, poolDetails.collectionAddress, setOwnedNfts, chainId)
    }
    checkApproval()
  }, [poolDetails, account, chainId])

  useEffect(() => {
    if (poolDetails) {
      calculatePrice()
    }
  }, [mode, slippage, poolDetails, selectedForPurchase, selectedForSale])

  const checkApproval = () => {
    if (poolDetails) {
      const contract = new Contract(poolDetails.collectionAddress, BEP721_ABI, provider)
      contract.isApprovedForAll(account, NFT_ROUTER).then((result) => {
        setApproved(result)
      })
    }
  }
  const approveSwap = async () => {
    if (poolDetails) {
      const signer = getSigner(provider, account)
      const contract = new Contract(poolDetails.collectionAddress, BEP721_ABI, signer)
      contract.setApprovalForAll(NFT_ROUTER, true).then((transactionResponse) => {
        transactionResponse.wait().then((receipt) => {
          if (receipt && receipt.blockNumber) {
            Toastify({
              text: 'Successfully Approved Collection!',
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
  }

  const handleSwap = async () => {
    const newPrice = await calculatePrice()

    const signer = getSigner(provider, account)
    const contract = new Contract(NFT_ROUTER, NFT_ROUTER_ABI, signer)

    if (mode === 'BUY') {
      const swapList = new Map()

      for (const nft of selectedForPurchase) {
        if (swapList.has(poolAddress)) {
          swapList.get(poolAddress).push(nft.tokenId)
        } else {
          swapList.set(poolAddress, [nft.tokenId])
        }
      }

      const tuple = Array.from(swapList)

      contract
        .swapETHForSpecificNFTs(tuple, account, account, Date.now() + 1000, { value: ethers.parseEther(price) })
        .then((transactionResponse, error) => {
          if (error) {
            console.log(error)
            return
          }
          transactionResponse.wait().then((receipt) => {
            if (receipt && receipt.blockNumber) {
              Toastify({
                text: 'Successfully bought ' + selectedForPurchase.length + ' NFTs.',
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
            }
          })
        })
    }
    if (mode === 'SELL') {
      const swapList = new Map()

      for (const nft of selectedForSale) {
        if (swapList.has(poolAddress)) {
          swapList.get(poolAddress).push(nft.tokenId)
        } else {
          swapList.set(poolAddress, [nft.tokenId])
        }
      }

      const tuple = Array.from(swapList)

      console.log(tuple, Web3.utils.toWei(String(price)), account, Date.now() + 100)

      contract
        .swapNFTsForToken(tuple, Web3.utils.toWei(String(price)), account, Date.now() + 100)
        .then((transactionResponse) => {
          transactionResponse.wait().then((receipt) => {
            if (receipt && receipt.blockNumber) {
              Toastify({
                text: 'Successfully sold ' + selectedForSale.length + ' NFTs.',
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
            }
          })
        })
    }
  }

  const calculatePrice = () => {
    if (mode === 'BUY' && selectedForPurchase.length === 0) {
      setPrice('0')
      return
    }
    if (mode === 'SELL' && selectedForSale.length === 0) {
      setPrice('0')
      return
    }
    let delta = poolDetails.delta

    let numberOfNfts =
      poolDetails.poolType === 'BUY' || mode === 'BUY' ? selectedForPurchase.length : selectedForSale.length
    let startPrice = poolDetails.poolType === 'BUY' || mode === 'BUY' ? poolDetails.floorNBT : poolDetails.offerNBT
    let finalPrice = Number(Web3.utils.fromWei(startPrice))
    let totalPrice = 0

    if (poolDetails.bondingCurveType === 'LINEAR') {
      delta = Number((+Web3.utils.fromWei(delta)).toFixed(6))

      let prices = []
      for (let k = 0; k < numberOfNfts; k++) {
        if (k != 0) {
          let change
          if (mode === 'BUY') {
            change = prices[k - 1] + delta
          }
          if (mode === 'SELL') {
            change = prices[k - 1] - delta
          }
          finalPrice = change
        }
        prices[k] = finalPrice
        totalPrice += finalPrice
      }

      let slippageAmount = totalPrice * (+slippage / 100)
      let slippagePrice

      if (mode == 'BUY') {
        slippagePrice = +totalPrice + slippageAmount
      }
      if (mode == 'SELL') {
        slippagePrice = +totalPrice - slippageAmount
      }

      setPrice(String(slippagePrice.toFixed(6)))
    }

    if (poolDetails.bondingCurveType == 'EXPONENTIAL') {
      delta = Number(+Web3.utils.fromWei(delta) - 1)

      let prices = []
      for (let k = 0; k < numberOfNfts; k++) {
        if (k != 0) {
          let change
          if (mode === 'BUY') {
            change = prices[k - 1] + +prices[k - 1] * delta
          }
          if (mode === 'SELL') {
            change = prices[k - 1] - +prices[k - 1] * delta
          }
          finalPrice = change
        }
        prices[k] = finalPrice
        totalPrice += finalPrice
      }
      let slippageAmount = totalPrice * (+slippage / 100)
      let slippagePrice

      if (mode == 'BUY') {
        slippagePrice = +totalPrice + slippageAmount
      }
      if (mode == 'SELL') {
        slippagePrice = +totalPrice - slippageAmount
      }

      setPrice(String(slippagePrice.toFixed(6)))
    }
  }

  return (
    <div className="max-w-[730px] w-full p-3 pt-1 mx-auto">
      {!poolDetails ? (
        <PoolNotFoundNotification poolAddress={poolAddress} />
      ) : (
        <>
          <Heading mode={poolDetails.poolType == 'BUY_AND_SELL' ? 'BUY_AND_SELL' : mode} />
          {poolDetails && poolDetails.poolType === 'BUY_AND_SELL' && (
            <OperationControls mode={mode} setMode={setMode} />
          )}
          <PoolDetails poolDetails={poolDetails} />
          <NftSelectionControls
            nfts={nfts}
            ownedNfts={ownedNfts}
            mode={mode}
            poolDetails={poolDetails}
            selectedForPurchase={selectedForPurchase}
            setSelectedForPurchase={setSelectedForPurchase}
            selectedForSale={selectedForSale}
            setSelectedForSale={setSelectedForSale}
          />
          <SlippageInput slippage={slippage} setSlippage={setSlippage} />
          <TotalPrice price={price} />
          <ConfirmSwap
            mode={mode}
            numToBuy={selectedForPurchase.length}
            numToSell={selectedForSale.length}
            handleSwap={handleSwap}
            calculatePrice={calculatePrice}
            approved={approved}
            approveSwap={approveSwap}
          />
        </>
      )}
    </div>
  )
}

const btn = 'px-3 py-2 border rounded-md text-center w-[15rem] '
const enabled = 'cursor-pointer text-white bg-opacity-80 border-opacity-80 '
const disabled = 'pointer-events-none bg-opacity-50 border-opacity-50 text-gray-400 '
const confirmDisabled = btn + disabled + 'border-cyan-blue bg-cyan-blue'
const confirmEnabled = btn + enabled + 'border-cyan-blue bg-cyan-blue'
const calculateDisabled = btn + disabled + 'bg-gray-500 border-gray-300 '
const calculateEnabled = btn + enabled + 'bg-gray-500 border-gray-300'

const ConfirmSwap = ({ mode, numToBuy, numToSell, handleSwap, calculatePrice, approved, approveSwap }) => {
  const [canSwap, setCanSwap] = useState(false)

  useEffect(() => {
    setCanSwap((mode === 'BUY' && numToBuy > 0) || (mode === 'SELL' && numToSell > 0))
  }, [mode, numToBuy, numToSell])

  return (
    <div id="btns" className="flex items-center justify-between text-[15px] gap-4 ts-1 mt-4 px-3 tracking-tighter">
      {/**<div id="calculate-btn" className={canSwap ? calculateEnabled : calculateDisabled } onClick={() => calculatePrice()}>
        {mode === 'BUY' && `Calculate Price for ${numToBuy} NFT` + (numToBuy === 1 ? '' : 's')}
        {mode === 'SELL' && `Calculate Price for ${numToSell} NFT` + (numToSell === 1 ? '' : 's')}
      </div>**/}
      {!approved && mode === 'SELL' ? (
        <div id="confirm-btn" className={canSwap ? confirmEnabled : confirmDisabled} onClick={() => approveSwap()}>
          Approve Contract
        </div>
      ) : (
        <div id="confirm-btn" className={canSwap ? confirmEnabled : confirmDisabled} onClick={() => handleSwap()}>
          Confirm Swap
        </div>
      )}
    </div>
  )
}

const NftSelectionControls = ({
  nfts,
  ownedNfts,
  mode,
  poolDetails,
  selectedForPurchase,
  setSelectedForPurchase,
  selectedForSale,
  setSelectedForSale,
}) => {
  return (
    <div id="nft-selection-controls">
      {mode === 'BUY' && (
        <>
          <div id="heading" className="text-[20px] mb-1 mt-4 ts-4">
            Select NFTs To Buy
          </div>
          <div className="px-3">
            <NftListBox
              nfts={nfts}
              selectedNfts={selectedForPurchase}
              setSelectedNfts={setSelectedForPurchase}
              listStyle="grid2"
              listClass="px-0 py-0"
              selectEnabled={true}
              className="max-h-[23rem]"
            />
          </div>
        </>
      )}
      {mode === 'SELL' && (
        <>
          <div id="heading" className="text-[20px] mb-2 mt-4 ts-4">
            Select NFTs To Sell
          </div>
          <div className="px-3">
            <NftListBox
              nfts={ownedNfts}
              selectedNfts={selectedForSale}
              setSelectedNfts={setSelectedForSale}
              listStyle="grid2"
              listClass="px-0 py-0"
              selectEnabled={true}
              className="max-h-[23rem]"
            />
          </div>
        </>
      )}
    </div>
  )
}

const Heading = ({ mode }) => {
  return (
    <div id="heading" className="w-full text-center">
      <div id="title" className="text-[32px] mb-1 font-bold ts-4">
        Swap
      </div>
      <div id="description" className="text-[15px] ts-1 mb-1">
        {mode === 'BUY_AND_SELL' && 'Buy or sell NFTs directly with the pool of your choice'}
        {mode === 'BUY' && 'Buy NFTs directly from the pool of your choice'}
        {mode === 'SELL' && 'Sell NFTs directly to the pool of your choice'}
      </div>
    </div>
  )
}

const PoolDetails = ({ poolDetails }) => {
  return (
    <>
      <div id="pool-address" className="mt-2">
        <div id="heading" className="text-[20px] mb-2 ts-4">
          Pool Details
        </div>
      </div>
      <div id="pool-card-container" className="w-full px-3">
        <PoolCard {...poolDetails} link={false} />
      </div>
    </>
  )
}

const opBase = 'flex-grow px-[10px] py-[6px] text-center rounded-md m-[6px] cursor-pointer border border-gray-600 '
const opActive = opBase + 'bg-gray-600'
const opInactive = opBase + 'bg-indigo-300 bg-opacity-30 hover:bg-opacity-70'
const OperationControls = ({ mode, setMode }) => {
  return (
    <div id="operation-controls" className="w-full">
      <div id="heading" className="text-[20px] mb-2 ts-4">
        Operation
      </div>
      <div id="opeation-select" className="flex gap-2 items-start text-[15px] px-3 w-full">
        <div className={(mode === 'BUY' ? opActive : opInactive) + ' ml-0 '} onClick={() => setMode('BUY')}>
          Buy
        </div>
        <div className={(mode === 'SELL' ? opActive : opInactive) + ' mr-0'} onClick={() => setMode('SELL')}>
          Sell
        </div>
      </div>
    </div>
  )
}

const SlippageInput = ({ slippage, setSlippage }) => {
  return (
    <div id="slippage" className="flex items-center gap-3 pl-3 my-2">
      <div id="label">Slippage</div>
      <div id="input" className="flex items-center">
        <Input
          placeholder={'0'}
          step={0.01}
          value={slippage}
          onUserInput={setSlippage}
          containerClass={inputContainerClass}
          inputClass={inputClass}
        />
        <div className="flex items-center justify-center px-3 border border-gray-800 rounded-md text-[.8rem] h-[26px]">
          %
        </div>
      </div>
    </div>
  )
}

const TotalPrice = (props) => {
  return (
    <div id="total-price-container" className="flex items-center mt-6 text-[20px] ts-4 pl-3">
      <div>Total Price:</div>
      <img src="/images/tokens/bnb-icon.png" className="w-4 h-4 ml-3 mr-1 mt-[2px]" />
      {props.price} BNB
    </div>
  )
}

export default PoolSwap
