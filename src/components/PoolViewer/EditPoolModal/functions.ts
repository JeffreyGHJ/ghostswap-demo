import Web3 from 'web3'
import { ethers } from 'ethers'

export function add(A, B) {
  const AL = A.length
  const BL = B.length
  const ML = Math.max(AL, BL)

  let carry = 0,
    sum = ''

  for (let i = 1; i <= ML; i++) {
    let a = +A.charAt(AL - i)
    let b = +B.charAt(BL - i)

    let t = carry + a + b
    carry = (t / 10) | 0
    t %= 10

    sum = i === ML && carry ? carry * 10 + t + sum : t + sum
  }

  return sum
}

export function modalStateToTitle(modalState) {
  if (modalState !== 'closed') {
    return modalState
      .split('-')
      .map((word) => word[0].toUpperCase() + word.substring(1))
      .join(' ')
  }
}

export function editPricing(
  poolDetails,
  delta,
  price,
  currentDelta,
  fee,
  contract,
  toastSuccess,
  toastError,
  closeModal
) {
  let calls = []
  let formattedDelta = delta
  let formattedPrice = +price

  if (poolDetails.bondingCurveType === 'LINEAR') {
    if (formattedDelta) {
      formattedDelta = Web3.utils.toWei(String(delta))
    }
    if (price) {
      if (delta) {
        if (formattedPrice >= +delta) {
          formattedPrice = +formattedPrice - +delta
        }
      } else {
        if (formattedPrice >= +Web3.utils.fromWei(currentDelta, 'ether')) {
          formattedPrice = +formattedPrice - +Web3.utils.fromWei(currentDelta, 'ether')
        }
      }
    }
  }

  if (poolDetails.bondingCurveType === 'EXPONENTIAL') {
    if (formattedDelta) {
      formattedDelta = add(Web3.utils.toWei(String(+delta / 100)), Web3.utils.toWei('1'))
    }
  }

  if (poolDetails.bondingCurveType !== 'XYK') {
    if (price) {
      console.log('price ' + Web3.utils.toWei(price))
      calls.push(contract.interface.encodeFunctionData('changeSpotPrice', [Web3.utils.toWei(String(formattedPrice))]))
    }
    if (formattedDelta) {
      console.log('delta ' + String(formattedDelta))
      calls.push(contract.interface.encodeFunctionData('changeDelta', [String(formattedDelta)]))
    }
  }
  if (poolDetails.poolType === 'BUY_AND_SELL') {
    if (fee) {
      calls.push(contract.interface.encodeFunctionData('changeFee', [Web3.utils.toWei(String(+fee / 100))]))
      console.log('fee ' + Web3.utils.toWei(String(+fee / 100)))
    }
  }

  // put modal into pending state
  if (calls.length > 1) {
    contract
      .multicall(calls, true)
      .then((transactionResponse) => {
        transactionResponse.wait().then((receipt) => {
          if (receipt && receipt.blockNumber) {
            toastSuccess('Price edit was successful!')
            closeModal()
          } else toastError('Error occurred while editing Price.')
        })
      })
      .catch((error) => {
        if (error?.code && error.code === 'ACTION_REJECTED') toastError('User rejected transaction')
        console.log(error)
      })
  } else {
    if (fee) {
      contract
        .changeFee(Web3.utils.toWei(String(+fee / 100)))
        .then((transactionResponse) => {
          transactionResponse.wait().then((receipt) => {
            if (receipt && receipt.blockNumber) {
              toastSuccess('Fee edit was successful!')
              closeModal()
            } else toastError('Error occurred while editing Fee.')
          })
        })
        .catch((error) => {
          if (error?.code && error.code === 'ACTION_REJECTED') toastError('User rejected transaction')
          console.log(error)
        })
    }
    if (formattedDelta) {
      contract.changeDelta(String(formattedDelta)).then((transactionResponse) => {
        transactionResponse
          .wait()
          .then((receipt) => {
            if (receipt && receipt.blockNumber) {
              toastSuccess('Delta edit was successful!')
              closeModal()
            } else toastError('Error occurred while editing Delta.')
          })
          .catch((error) => {
            if (error?.code && error.code === 'ACTION_REJECTED') toastError('User rejected transaction')
            console.log(error)
          })
      })
    }
    if (price) {
      contract.changeSpotPrice(Web3.utils.toWei(String(formattedPrice))).then((transactionResponse) => {
        transactionResponse
          .wait()
          .then((receipt) => {
            if (receipt && receipt.blockNumber) {
              closeModal()
              toastSuccess('Price edit was successful!')
            } else toastError('Error occurred while editing Price.')
          })
          .catch((error) => {
            if (error?.code && error.code === 'ACTION_REJECTED') toastError('User rejected transaction')
            console.log(error)
          })
      })
    }
  }

  console.log(`executeUpdatePoolPrice(Price: ${+price}, Delta: ${+delta}, Fee: ${+fee})`)
}

export async function depositTokens(
  provider,
  signer,
  poolAddress,
  amountToDeposit,
  toastSuccess,
  toastError,
  closeModal
) {
  const gas_price = await provider.getGasPrice()

  // @ts-ignore
  signer
    .sendTransaction({ to: poolAddress, value: ethers.parseEther(amountToDeposit), gasPrice: gas_price })
    .then((transactionResponse) => {
      transactionResponse.wait().then((receipt) => {
        if (receipt && receipt.blockNumber) {
          toastSuccess('The deposit of tokens is successful!')
          closeModal()
        } else toastError('Error occurred while depositing tokens.')
      })
    })
    .catch((error) => {
      if (error?.code && error.code === 'ACTION_REJECTED') toastError('User rejected transaction')
      console.log(error)
    })

  console.log(`executeDepositPoolTokens(${+amountToDeposit})`)
}

export function withdrawTokens(contract, currentTokenBalance, amountToWithdraw, toastSuccess, toastError, closeModal) {
  console.log(+amountToWithdraw)

  if (+amountToWithdraw === currentTokenBalance) {
    console.log('Executing WithdrawAll variant')
    contract
      .withdrawAllETH()
      .then((transactionResponse) => {
        transactionResponse.wait().then((receipt) => {
          if (receipt && receipt.blockNumber) {
            toastSuccess('The withdraw of all tokens is successful!')
            closeModal()
          } else toastError('Error occurred while withdrawing all tokens.')
        })
      })
      .catch((error) => {
        if (error?.code && error.code === 'ACTION_REJECTED') toastError('User rejected transaction')
        console.log(error)
      })
  } else {
    contract
      .withdrawETH(Web3.utils.toWei(String(+amountToWithdraw)))
      .then((transactionResponse) => {
        transactionResponse.wait().then((receipt) => {
          if (receipt && receipt.blockNumber) {
            toastSuccess('The withdraw of tokens is successful!')
            closeModal()
          } else toastError('Error occurred while withdrawing tokens.')
        })
      })
      .catch((error) => {
        if (error?.code && error.code === 'ACTION_REJECTED') toastError('User rejected transaction')
        console.log(error)
      })
  }

  console.log(`executeWithdrawPoolTokens(${+amountToWithdraw})`)
}

export function depositNfts(nftsToDeposit, factory, poolDetails, poolAddress, toastSuccess, toastError, closeModal) {
  let nftIds = []

  for (const nft of nftsToDeposit) {
    nftIds.push(nft.tokenId)
  }

  factory
    .depositNFTs(poolDetails.collectionAddress, nftIds, poolAddress)
    .then((transactionResponse) => {
      transactionResponse.wait().then((receipt) => {
        if (receipt && receipt.blockNumber) {
          closeModal()
          toastSuccess('The deposit of nfts is successful!')
        } else toastError('Error occurred while depositing NFTs.')
      })
    })
    .catch((error) => {
      if (error?.code && error.code === 'ACTION_REJECTED') toastError('User rejected transaction')
      console.log(error)
    })

  console.log(`executeDepositPoolNfts(${nftsToDeposit})`)
}

export function withdrawNfts(nftsToWithdraw, contract, poolDetails, toastSuccess, toastError, closeModal) {
  let nftIds = []

  for (const nft of nftsToWithdraw) {
    nftIds.push(nft.tokenId)
  }

  contract
    .withdrawERC721(poolDetails.collectionAddress, nftIds)
    .then((transactionResponse) => {
      transactionResponse.wait().then((receipt) => {
        if (receipt && receipt.blockNumber) {
          toastSuccess('The withdraw of nfts is successful!')
          closeModal()
        } else toastError('Error occurred while withdrawing NFTs.')
      })
    })
    .catch((error) => {
      if (error?.code && error.code === 'ACTION_REJECTED') toastError('User rejected transaction')
      console.log(error)
    })

  console.log(`executeWithdrawPoolNfts(${nftsToWithdraw})`)
}

export function validateInputs(
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
) {
  console.log(poolDetails.poolType + ' ' + modalState + amountToWithdraw + ' can edit ' + canEdit)
  // Networks
  if (Web3.utils.toChecksumAddress(poolDetails.owner, 56) !== account) return false
  if (modalState === 'edit-pricing') {
    if (poolDetails.poolType === 'BUY_AND_SELL') {
      // trade pools have fee
      if (poolDetails.bondingCurveType === 'XYK' && !price && !fee) return false
      if (poolDetails.bondingCurveType !== 'XYK' && !price && !delta && !fee) return false
    } else {
      // non-trade pools dont have a fee
      if (poolDetails.bondingCurveType === 'XYK' && !price) return false
      if (poolDetails.bondingCurveType !== 'XYK' && !price && !delta) return false
    }
  }
  if (modalState === 'deposit-tokens' && !amountToDeposit) return false
  if (modalState === 'withdraw-tokens' && !amountToWithdraw) return false
  if (modalState === 'deposit-nfts' && nftsToDeposit.length < 1) return false
  if (modalState === 'withdraw-nfts' && nftsToWithdraw.length < 1) return false
  // console.log(updateIsValid + ' update valid')
  // setUpdateIsValid(true)
  return true
}
