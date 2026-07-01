import { Contract } from '@ethersproject/contracts'
import { useEffect, useState } from 'react'
import { NFT_ROUTER } from '../../../config/contracts'
import { getSigner } from '../../../functions'
import { useActiveWeb3React } from '../../../hooks'
import { BEP721_ABI, NFT_ROUTER_ABI } from '../../../web3/abi'
import Web3 from 'web3'
import { ethers } from 'ethers'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import { clearCartItems, clearItemsToSell, setCartIsOpen } from '../../../state/cart'
import { useDispatch } from 'react-redux'
import { setNeedsUpdate } from '../../../state/nftMarket'
import { useWeb3React } from '@web3-react/core'

const btnBase = ' w-[90%] px-3 py-2 rounded-md ts-5 tracking-wider border-2 mx-auto '
const btnEnabled = ' border-cyan-blue bg-blue hover:bg-cyan-blue cursor-pointer '
const btnDisabled = ' bg-gray-800 border-gray-600 pointer-events-none cursor-default '
const cost = 'flex flex-wrap w-full h-full px-[5%] items-center justify-between whitespace-nowrap gap-x-1 mt-2'
const checkoutContainer =
  'bg-gray-900 border-t-[1px] border-indigo-400 px-2 flex flex-col justify-end text-[16px] font-bold'

const Checkout = ({ cartItems, itemsToSell, netCost, sellTotal, buyTotal }) => {
  const [cartEmpty, setCartEmpty] = useState(true)
  //   const { account, library } = useActiveWeb3React()
  const { account, provider } = useWeb3React()
  const [approvedCount, setApprovedCount] = useState(0)
  const [collectionCount, setCollectionCount] = useState(0)
  const [approvalPending, setApprovalPending] = useState(false)
  const [buyAndSellMode, setBuyAndSellMode] = useState(false)
  const dispatch = useDispatch()

  const checkApproval = async (contractAddress) => {
    const contract = new Contract(contractAddress, BEP721_ABI, provider)
    const result = await contract.isApprovedForAll(account, NFT_ROUTER)
    return result
  }
  const approveSwap = async (contractAddress) => {
    if (!cartEmpty) {
      const signer = getSigner(provider, account)
      const contract = new Contract(contractAddress, BEP721_ABI, signer)
      const transactionResponse = await contract.setApprovalForAll(NFT_ROUTER, true)
      const receipt = await transactionResponse.wait()
      if (receipt && receipt.blockNumber) {
        return true
      }
    }
    setApprovalPending(false)
    return false
  }

  const emptyCartAndUpdateListings = () => {
    dispatch(clearCartItems())
    dispatch(clearItemsToSell())

    setTimeout(() => {
      dispatch(setNeedsUpdate(true))
    }, 3000)
  }

  const checkAndApproveAll = async () => {
    for (const nft of itemsToSell) {
      setApprovalPending(true)
      const isApproved = await checkApproval(nft.collectionAddress)
      if (!isApproved) {
        await approveSwap(nft.collectionAddress)
      }
      setApprovalPending(false)
    }
  }

  const handleCheckout = async () => {
    const signer = getSigner(provider, account)
    const contract = new Contract(NFT_ROUTER, NFT_ROUTER_ABI, signer)

    //if buying and not selling
    //supports multiple nfts in the cart.
    if (cartItems.length > 0 && itemsToSell.length == 0) {
      const swapList = []

      for (const nft of cartItems) {
        swapList.push([nft.poolAddress, [nft.id]])
      }

      const tuple = swapList

      contract
        .swapETHForSpecificNFTs(tuple, account, account, Date.now() + 100, {
          value: ethers.parseEther(netCost + ''),
        })
        .then((transactionResponse) => {
          transactionResponse.wait().then((receipt) => {
            if (receipt && receipt.blockNumber) {
              Toastify({
                text: 'Success! Bought ' + cartItems.length + ' NFTs.',
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
              emptyCartAndUpdateListings()
            }
          })
        })
    }

    //if selling and not buying
    if (cartItems.length == 0 && itemsToSell.length > 0) {
      console.log('check')
      const swapList = []

      for (const nft of itemsToSell) {
        swapList.push([nft.offerAddress, [nft.id]])
      }

      const tuple = swapList

      const blockNumber = await provider.getBlockNumber()

      const price = Math.abs(netCost)

      //1% slippage
      let slippageAmount = +price * (1 / 100)
      let slippagePrice = +price - slippageAmount

      console.log(tuple, Web3.utils.toWei(String(slippagePrice)), account, Date.now() + 100)

      contract
        .swapNFTsForToken(tuple, Web3.utils.toWei(String(slippagePrice)), account, Date.now() + 100)
        .then((transactionResponse) => {
          transactionResponse.wait().then((receipt) => {
            if (receipt && receipt.blockNumber) {
              Toastify({
                text: 'Success! Sold ' + itemsToSell.length + ' NFTs.',
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
              emptyCartAndUpdateListings()
            }
          })
        })
    }

    //if buying and selling
    if (cartItems.length > 0 && itemsToSell.length > 0) {
      //swapNFTsForAnyNFTsThroughETH

      const sellSwapList = []

      for (const nft of itemsToSell) {
        sellSwapList.push([nft.offerAddress, [nft.id]])
      }

      const sellTuple = sellSwapList

      const buySwapList = []

      for (const nft of cartItems) {
        buySwapList.push([nft.poolAddress, [nft.id]])
      }

      const buyTuple = buySwapList

      let cost = netCost
      let sellAmount = sellTotal
      let buyAmount = buyTotal
      let refund = 0

      console.log(cost)

      //person gets some bnb back, doesnt need to transfer bnb
      if (cost < 0) {
        cost = 0

        refund = Math.abs(netCost)
        let refundSlippage = +refund * (1 / 100)
        // let refundSlippage = 0;
        refund = +refund - refundSlippage
      }

      //1% slippage
      let slippageAmount = +sellAmount * (1 / 100)
      // let slippageAmount = 0
      sellAmount = +sellAmount - slippageAmount

      console.log(
        sellTuple,
        buyTuple,
        Web3.utils.toWei(String(sellAmount)),
        Web3.utils.toWei(String(refund)),
        Date.now() + 100
      )

      //min amount back should be 0, since we are only transferring enough after selling
      contract
        .swapNFTsForSpecificNFTsThroughETH(
          [sellTuple, buyTuple],
          Web3.utils.toWei(String(sellAmount)),
          Web3.utils.toWei(String(refund)),
          account,
          account,
          Date.now() + 100,
          {
            value: ethers.parseEther(String(cost)),
          }
        )
        .then((transactionResponse) => {
          transactionResponse.wait().then((receipt, error) => {
            if (error) {
              console.log('error')
            }
            if (receipt && receipt.blockNumber) {
              Toastify({
                text: 'Success! Bought ' + cartItems.length + ' NFTs & Sold ' + itemsToSell.length + ' NFTs.',
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
              emptyCartAndUpdateListings()
            }
          })
        })
    }
  }
  useEffect(() => {
    setCartEmpty(!cartItems.length && !itemsToSell.length)
  }, [cartItems, itemsToSell])

  useEffect(() => {
    const checkAllApprovals = async () => {
      let approved = 0
      const uniqueCollectionAddresses = new Set()

      for (const nft of itemsToSell) {
        if (!uniqueCollectionAddresses.has(nft.collectionAddress)) {
          uniqueCollectionAddresses.add(nft.collectionAddress)
          const isApproved = await checkApproval(nft.collectionAddress)
          if (isApproved) {
            approved++
          }
        }
      }
      setApprovedCount(approved)
      setCollectionCount(uniqueCollectionAddresses.size)
      console.log('Unique collection addresses:', Array.from(uniqueCollectionAddresses))
    }

    if (itemsToSell) {
      if (cartItems.length > 0 && itemsToSell.length > 0) {
        setBuyAndSellMode(true)
        console.log(buyAndSellMode)
      } else {
        setBuyAndSellMode(false)
      }
      checkAllApprovals().then((r) => console.log('Finished checking approvals'))
    }
  }, [itemsToSell, cartItems, approvalPending])

  return (
    <div id="checkout" className={checkoutContainer}>
      <div className={cost}>
        Net Cost:
        <span className="flex items-center">
          <img id="bnb-icon" className="w-4 h-4 mr-2 " src={'/images/tokens/bnb-icon.png'} />
          {netCost.toFixed(6)}
        </span>
      </div>
      <div className="w-full mt-1 mb-3 text-center">
        {itemsToSell && approvedCount !== collectionCount ? (
          <div className={btnBase + (cartEmpty ? btnDisabled : btnEnabled)} onClick={() => checkAndApproveAll()}>
            {approvalPending ? 'Approve Pending...' : `Approved (${approvedCount}/${collectionCount})`}
          </div>
        ) : (
          <div className={btnBase + (cartEmpty ? btnDisabled : btnEnabled)} onClick={() => handleCheckout()}>
            {cartEmpty ? 'Cart Empty' : 'Confirm'}
          </div>
        )}
      </div>
    </div>
  )
}

export default Checkout
