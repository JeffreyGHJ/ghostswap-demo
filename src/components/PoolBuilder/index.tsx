import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import ConfigurePool from './ConfigurePool'
import FinalizeDeposit from './FinalizeDeposit'
import { getSpotPricesBuy, getSpotPricesSell } from './functions'
import PoolBuilderNav from './PoolBuilderNav'
import SelectAssets from './SelectAssets'
import SelectPoolType from './SelectPoolType'
import { Contract } from '@ethersproject/contracts'
import { EXPONENTIAL_CURVE, LINEAR_CURVE, NFT_FACTORY, XYK_CURVE, ZERO_ADDRESS } from '../../config/contracts'
import Web3 from 'web3'
import { BEP721_ABI, FACTORY_ABI } from '../../web3/abi'
import { getSigner } from '../../functions'
import { ethers } from 'ethers'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import router from 'next/router'
import { useWeb3React } from '@web3-react/core'

const TOTAL_STEPS = 4

const PoolBuilder = () => {
  // Select Pool Type
  const [currentStep, setCurrentStep] = useState(1)
  const [poolType, setPoolType] = useState(null) // 'BUY' | 'SELL' | 'BUY_AND_SELL' | 'null'

  // Select Assets
  const [nftCollection, setNftCollection] = useState(null)
  const [token, setToken] = useState(null)

  // Pool Pricing
  const [feeAmount, setFeeAmount] = useState('0')
  const [startPrice, setStartPrice] = useState('0')
  const [bondingCurve, setBondingCurve] = useState('linear')
  const [delta, setDelta] = useState('0')
  const [concentration, setConcentration] = useState('0')

  // Asset Amounts
  const [amountToBuy, setAmountToBuy] = useState('0')
  const [amountToSell, setAmountToSell] = useState('0')
  const [depositedNfts, setDepositedNfts] = useState([])

  // Computed Values
  const [spotPricesBuy, setSpotPricesBuy] = useState([])
  const [spotPricesSell, setSpotPricesSell] = useState([])
  const [totalPurchasePrice, setTotalPurchasePrice] = useState('0')
  const [totalSalesPrice, setTotalSalesPrice] = useState('0')
  const [isConfigValid, setIsConfigValid] = useState(false)
  const [approved, setApproved] = useState(false)
  //   const { account, library } = useActiveWeb3React()
  const { account, provider } = useWeb3React()

  const incrementCurrentStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const decrementCurrentStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const clampFeeAmount = (value) => {
    if (+value > 90) setFeeAmount('90')
  }

  useEffect(() => {
    if (poolType === 'BUY') setSpotPricesBuy(getSpotPricesBuy(startPrice, delta, amountToBuy, bondingCurve))
  }, [poolType, startPrice, delta, amountToBuy, bondingCurve])

  useEffect(() => {
    if (poolType === 'SELL') setSpotPricesSell(getSpotPricesSell(startPrice, delta, amountToSell, bondingCurve))
  }, [poolType, startPrice, delta, amountToSell, bondingCurve])

  useEffect(() => {
    if (poolType === 'BUY_AND_SELL') {
      const max = Math.max(+amountToBuy, +amountToSell)
      setSpotPricesSell(getSpotPricesSell(startPrice, delta, +amountToSell, bondingCurve, max))
      setSpotPricesBuy(getSpotPricesBuy(startPrice, delta, +amountToBuy, bondingCurve, max).reverse())
    }
  }, [poolType, startPrice, delta, amountToSell, amountToBuy, bondingCurve])

  useEffect(() => {
    setTotalPurchasePrice(spotPricesBuy.reduce((sum, price) => +sum + +price, 0).toString())
  }, [spotPricesBuy])

  useEffect(() => {
    setTotalSalesPrice(spotPricesSell.reduce((sum, price) => +sum + +price, 0).toString())
  }, [spotPricesSell])

  useEffect(() => {
    console.log('fee amount: ' + feeAmount)
    clampFeeAmount(feeAmount)
  }, [feeAmount])

  useEffect(() => {
    if (provider && account && nftCollection && nftCollection.address) {
      checkApproval()
    }
  }, [provider, account, nftCollection])

  const checkApproval = () => {
    const contract = new Contract(nftCollection.address, BEP721_ABI, provider)
    contract.isApprovedForAll(account, NFT_FACTORY).then((result) => {
      setApproved(result)
    })
  }

  const approveNftContract = async () => {
    const signer = getSigner(provider, account)
    const contract = new Contract(nftCollection.address, BEP721_ABI, signer)
    contract.setApprovalForAll(NFT_FACTORY, true).then((transactionResponse) => {
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

  function add(A, B) {
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
  const executePoolCreation = () => {
    let config
    if (poolType === 'BUY') {
      config = {
        poolType: 0,
        bondingCurve: bondingCurve,
        amountToBuy: +amountToBuy,
        buyPrice: Web3.utils.toWei(startPrice),
        sellPrice: Web3.utils.toWei(startPrice),
        delta: bondingCurve === 'xyk' ? null : +delta,
        concentration: bondingCurve === 'xyk' ? +concentration + 1 : null,
        balanceCurrency: +totalPurchasePrice,
        ownerAddress: account,
        assetRecipient: account,
        feeAmount: 0,
        purchasePrice: totalPurchasePrice,
      }
    }
    if (poolType === 'SELL') {
      config = {
        poolType: 1,
        bondingCurve: bondingCurve,
        balanceNft: +amountToSell,
        buyPrice: Web3.utils.toWei(startPrice),
        sellPrice: Web3.utils.toWei(startPrice),
        delta: bondingCurve === 'xyk' ? null : +delta,
        concentration: bondingCurve === 'xyk' ? +concentration + 1 : null,
        balanceCurrency: +totalSalesPrice,
        ownerAddress: account,
        assetRecipient: account,
        feeAmount: 0,
        purchasePrice: 0,
      }
    }
    if (poolType === 'BUY_AND_SELL') {
      config = {
        poolType: 2,
        bondingCurve: bondingCurve,
        amountToBuy: +amountToBuy,
        balanceNft: +amountToSell,
        buyPrice: Web3.utils.toWei(startPrice),
        sellPrice: Web3.utils.toWei(startPrice),
        delta: bondingCurve === 'xyk' ? null : +delta,
        concentration: bondingCurve === 'xyk' ? +concentration + 1 : null,
        feeAmount: Web3.utils.toWei(String(+feeAmount / 100)),
        balanceCurrency: +totalPurchasePrice,
        totalSalesPrice: +totalSalesPrice,
        ownerAddress: account,
        assetRecipient: ethers.ZeroAddress,
        purchasePrice: totalPurchasePrice,
      }
    }
    //
    const signer = getSigner(provider, account)
    const contract = new Contract(NFT_FACTORY, FACTORY_ABI, signer)
    if (contract != null) {
      const depositedIds = depositedNfts.map((t) => t.tokenId)
      let xykPrice =
        +config.amountToBuy > +config.amountToSell
          ? +config.amountToBuy * +config.startPrice
          : +config.amountToSell * +config.startPrice

      if (bondingCurve == 'linear') {
        let priceBefore = +startPrice

        if (startPrice >= delta) {
          priceBefore = +startPrice - config.delta
        }

        contract
          .createPairETH(
            nftCollection.address,
            LINEAR_CURVE,
            config.assetRecipient,
            config.poolType,
            Web3.utils.toWei(String(config.delta)),
            config.feeAmount,
            poolType === 'SELL' ? Web3.utils.toWei(String(priceBefore)) : config.buyPrice,
            depositedIds,
            { value: config.purchasePrice > 0 ? ethers.parseEther(config.purchasePrice) : 0 }
          )
          .then((transactionResponse) => {
            transactionResponse.wait().then((receipt) => {
              if (receipt && receipt.blockNumber) {
                Toastify({
                  text: 'Successfully created Linear Pool!',
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
                router.push('/pools')
              }
            })
          })
      }
      if (bondingCurve == 'exponential') {
        contract
          .createPairETH(
            nftCollection.address,
            EXPONENTIAL_CURVE,
            config.assetRecipient,
            config.poolType,
            add(Web3.utils.toWei(String(config.delta / 100)), Web3.utils.toWei('1')),
            config.feeAmount,
            config.buyPrice,
            depositedIds,
            { value: config.purchasePrice > 0 ? ethers.parseEther(config.purchasePrice) : 0 }
          )
          .then((transactionResponse) => {
            transactionResponse.wait().then((receipt) => {
              if (receipt && receipt.blockNumber) {
                Toastify({
                  text: 'Successfully created Exponential pool!',
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
                router.push('/pools')
              }
            })
          })
      }
      if (bondingCurve == 'xyk') {
        contract
          .createPairETH(
            nftCollection.address,
            XYK_CURVE,
            config.assetRecipient,
            config.poolType,
            config.depositedNfts + 1,
            config.feeAmount,
            String(xykPrice),
            depositedIds,
            { value: config.purchasePrice > 0 ? ethers.parseEther(config.purchasePrice) : 0 }
          )
          .then((transactionResponse) => {
            transactionResponse.wait().then((receipt) => {
              if (receipt && receipt.blockNumber) {
                Toastify({
                  text: 'Successfully created XYK pool!',
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
                router.push('/pools')
              }
            })
          })
      }
    }
    // console.log('creating pool with config: ')
    // console.log(config)
    // dispatch(addPool(config))
    // router.replace('/pools')
  }

  // if user changes pooltype, reset selections
  useEffect(() => {
    setNftCollection(null)
    setToken(null)
    // setStartPrice('0')
    // setBondingCurve('linear')
    // setDelta('0')
    // setAmountToBuy('0')
    // setAmountToSell('0')
    // setFeeAmount('0')
  }, [poolType])

  // DEBUG OUTPUT
  useEffect(() => {
    console.log(nftCollection)
  }, [nftCollection])
  useEffect(() => {
    console.log(token)
  }, [token])
  useEffect(() => {
    console.log(spotPricesBuy)
  }, [spotPricesBuy])
  useEffect(() => {
    console.log(spotPricesSell)
  }, [spotPricesSell])
  useEffect(() => {
    console.log('isConfigValid: ' + isConfigValid)
  }, [isConfigValid])
  useEffect(() => {
    console.log('currentStep: ' + currentStep)
  }, [currentStep])
  useEffect(() => {
    console.log('concentration: ' + concentration)
  }, [concentration])
  useEffect(() => {
    console.log('depositedNfts: ' + depositedNfts)
  }, [depositedNfts])

  return (
    <div id="step-container" className="w-full">
      {
        [
          // eslint-disable-next-line react/jsx-key
          <SelectPoolType
            description={'Selecting Pool Type'}
            currentStep={currentStep}
            incrementCurrentStep={incrementCurrentStep}
            setPoolType={setPoolType}
            TOTAL_STEPS={TOTAL_STEPS}
          />,
          // eslint-disable-next-line react/jsx-key
          <SelectAssets
            description={'Selecting Assets'}
            currentStep={currentStep}
            nftCollection={nftCollection}
            token={token}
            setNftCollection={setNftCollection}
            setToken={setToken}
            incrementCurrentStep={incrementCurrentStep}
            decrementCurrentStep={decrementCurrentStep}
            poolType={poolType}
            TOTAL_STEPS={TOTAL_STEPS}
            account={account}
          />,
          // eslint-disable-next-line react/jsx-key
          <ConfigurePool
            description={'Configuring Pool Parameters'}
            currentStep={currentStep}
            nftCollection={nftCollection}
            token={token}
            startPrice={startPrice}
            setStartPrice={setStartPrice}
            bondingCurve={bondingCurve}
            setBondingCurve={setBondingCurve}
            delta={delta}
            setDelta={setDelta}
            concentration={concentration}
            setConcentration={setConcentration}
            totalPurchasePrice={totalPurchasePrice}
            setTotalPurchasePrice={setTotalPurchasePrice}
            totalSalesPrice={totalSalesPrice}
            setTotalSalesPrice={setTotalSalesPrice}
            incrementCurrentStep={incrementCurrentStep}
            decrementCurrentStep={decrementCurrentStep}
            poolType={poolType}
            TOTAL_STEPS={TOTAL_STEPS}
            setIsConfigValid={setIsConfigValid}
            feeAmount={feeAmount}
            setFeeAmount={setFeeAmount}
            amountToBuy={amountToBuy}
            setAmountToBuy={setAmountToBuy}
            amountToSell={amountToSell}
            setAmountToSell={setAmountToSell}
            spotPricesBuy={spotPricesBuy}
            spotPricesSell={spotPricesSell}
          />,
          // eslint-disable-next-line react/jsx-key
          <FinalizeDeposit
            description={'Finalizing Deposit'}
            currentStep={currentStep}
            nftCollection={nftCollection}
            token={token}
            amountToBuy={amountToBuy}
            amountToSell={amountToSell}
            feeAmount={feeAmount}
            startPrice={startPrice}
            totalPurchasePrice={totalPurchasePrice}
            totalSalesPrice={totalSalesPrice}
            bondingCurve={bondingCurve}
            delta={delta}
            poolType={poolType}
            TOTAL_STEPS={TOTAL_STEPS}
            approved={approved}
            approveNftContract={approveNftContract}
            executePoolCreation={executePoolCreation}
            setDepositedNfts={setDepositedNfts}
          />,
        ][currentStep - 1]
      }
      <PoolBuilderNav
        currentStep={currentStep}
        TOTAL_STEPS={TOTAL_STEPS}
        poolType={poolType}
        nftCollection={nftCollection}
        token={token}
        incrementCurrentStep={incrementCurrentStep}
        decrementCurrentStep={decrementCurrentStep}
        isConfigValid={isConfigValid}
      />
    </div>
  )
}

export default PoolBuilder
