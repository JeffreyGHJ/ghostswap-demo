import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import ThreePartModal from '../../../Modal/ThreePartModal'
import Image from 'next/image'
import bnbIcon from '../../../../../public/images/tokens/bnb-icon.png'
import { useEffect, useState } from 'react'
import { calculateTotalCost, countValidTrades } from './functions'
import { getSigner } from '../../../../functions'
import { Contract } from '@ethersproject/contracts'
import { EXPONENTIAL_CURVE, LINEAR_CURVE, NFT_FACTORY } from '../../../../config/contracts'
import { FACTORY_ABI } from '../../../../web3/abi'
import Web3 from 'web3'
import { useActiveWeb3React } from '../../../../hooks'
import { ethers } from 'ethers'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import { ArrowTooltipBordered as Tooltip } from '../../../Tooltip'
import { useWeb3React } from '@web3-react/core'

export const CollectionOfferModal = (props: any) => {
  const allowedKeysInteger = [...'0123456789', 'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
  const allowedKeysDecimal = [...allowedKeysInteger, '.']
  const [numTradesDesired, setNumTradesDesired] = useState(1)
  const [numValidTrades, setNumValidTrades] = useState(0)
  const [price, setPrice] = useState(0)
  const [decrease, setDecrease] = useState(0)
  const [decreaseMode, setDecreaseMode] = useState('bnb')
  const [total, setTotal] = useState('0')
  const [isInvalid, setIsInvalid] = useState(false)
  //   const { account, library } = useActiveWeb3React()
  const { account, provider } = useWeb3React()

  const incrementNumTradesDesired = () => {
    setNumTradesDesired(numTradesDesired + 1)
  }

  const decrementNumTradesDesired = () => {
    if (numTradesDesired > 0) setNumTradesDesired(numTradesDesired - 1)
  }

  const validate = (numValid) => {
    if (!numTradesDesired) setIsInvalid(false)
    else if (!price) setIsInvalid(false)
    else if (!decrease) setIsInvalid(false)
    else numValid !== numTradesDesired ? setIsInvalid(true) : setIsInvalid(false)
  }
  const add = (A, B) => {
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

  const blockInvalidInput = (e, type) => {
    let allowedKeys
    if (type === 'integer') allowedKeys = allowedKeysInteger
    if (type === 'decimal') allowedKeys = allowedKeysDecimal
    if (!allowedKeys.includes(e.key)) e.preventDefault()
  }

  function executeListing() {
    const signer = getSigner(provider, account)
    const contract = new Contract(NFT_FACTORY, FACTORY_ABI, signer)

    if (decreaseMode === 'bnb') {
      contract
        .createPairETH(
          props.details.address,
          LINEAR_CURVE,
          account,
          0,
          Web3.utils.toWei(String(decrease)),
          0,
          Web3.utils.toWei(price + ''),
          [],
          { value: ethers.parseEther(total) }
        )
        .then((transactionResponse) => {
          transactionResponse.wait().then((receipt) => {
            if (receipt && receipt.blockNumber) {
              Toastify({
                text: 'Successfully created Buy Offer on a Linear curve!',
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
              props.closeModal()
              //success
            }
          })
        })
    } else {
      //percentage
      contract
        .createPairETH(
          props.details.address,
          EXPONENTIAL_CURVE,
          account,
          0,
          add(Web3.utils.toWei(String(decrease / 1000)), Web3.utils.toWei('1')),
          0,
          Web3.utils.toWei(price + ''),
          [],
          { value: ethers.parseEther(total) }
        )
        .then((transactionResponse) => {
          transactionResponse.wait().then((receipt) => {
            if (receipt && receipt.blockNumber) {
              Toastify({
                text: 'Successfully created Buy Offer on a Exponential curve!',
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
              props.closeModal()
              //success
            }
          })
        })
    }
  }

  useEffect(() => {
    let numValid = countValidTrades(price, decrease, numTradesDesired, decreaseMode)
    validate(numValid)
    setNumValidTrades(numValid)
    setTotal(calculateTotalCost(price, decrease, numTradesDesired, decreaseMode).toString())
  }, [numTradesDesired, price, decrease, decreaseMode])

  return (
    <ThreePartModal
      isOpen={props.isOpen}
      closeModal={props.closeModal}
      header={<ModalHeader />}
      body={
        <ModalBody
          details={props.details}
          numTradesDesired={numTradesDesired}
          setNumTradesDesired={setNumTradesDesired}
          incrementNumTradesDesired={incrementNumTradesDesired}
          decrementNumTradesDesired={decrementNumTradesDesired}
          price={price}
          setPrice={setPrice}
          highestOffer={Number(props.highestOffer).toFixed(3)}
          lowestFloor={Number(props.lowestFloor).toFixed(3)}
          decrease={decrease}
          setDecrease={setDecrease}
          decreaseMode={decreaseMode}
          setDecreaseMode={setDecreaseMode}
          isInvalid={isInvalid}
          numValidTrades={numValidTrades}
          blockInvalidInput={blockInvalidInput}
          total={total}
        />
      }
      footer={<ModalFooter executeListing={executeListing} />}
    />
  )
}

const ModalHeader = () => {
  const [show, setShow] = useState(false)

  return (
    <div
      id="title"
      style={{ lineHeight: '1.1', letterSpacing: '-.02em', fontSize: '1.25rem' }}
      className="flex flex-row items-center justify-center mt-1 font-semibold text-center"
    >
      Bulk Collection Offer
      <Tooltip show={show} content={'Deposit tokens to buy any NFT(s) from this collection'} placement="top">
        <QuestionMarkCircleIcon
          role="button"
          width={22}
          className="ml-1"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        />
      </Tooltip>
    </div>
  )
}

const ModalBody = (props: any) => {
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)

  return (
    <>
      <div id="header" className="flex flex-row px-3">
        <div id="logo-container" className="flex items-center justify-center w-1/4 px-[.375rem]">
          <img src={props.details.avatar} alt="Ghost" width="100px" height="100px" className="rounded-md" />
        </div>
        <div id="collection-details" className="flex flex-col w-3/4 px-3">
          <div id="collection-name" className="text-[2rem] leading-[1.1] tracking-[-.02em] font-bold">
            {props.details.name}
          </div>
          <div id="collection-lowest" className="mt-3 mb-2 ml-1 font-medium text-[1rem] leading-[1.1]">
            Lowest floor: {props.lowestFloor} BNB
          </div>
          <div id="collection-highest" className="mb-2 ml-1 font-medium text-[1rem] leading-[1.1]">
            Highest offer: {props.highestOffer} BNB
          </div>
        </div>
      </div>

      <div id="inputs" className="mt-9">
        <div id="nft-amount-group" className="mb-3">
          <label id="input-label" className="flex flex-row items-center pl-1 mb-[.375rem]">
            <span>NFT amount</span>
            <Tooltip
              show={show}
              content={<div className="w-[14rem] text-center">The maximum number of items you wish to buy</div>}
              placement="top"
            >
              <QuestionMarkCircleIcon
                role="button"
                width={18}
                className="ml-1"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
              />
            </Tooltip>
          </label>
          <div id="input-group" className="relative flex flex-row items-center w-full rounded-md">
            <input
              id="amount-input"
              type="number"
              min={0}
              value={props.numTradesDesired || ''}
              onKeyDown={(e) => props.blockInvalidInput(e, 'integer')}
              onChange={(e) => props.setNumTradesDesired(+e.target.value)}
              style={{ border: props.isInvalid ? 'solid red 1px' : 'solid black 1px' }}
              className="w-full px-3 py-2 pr-0 text-white bg-black rounded-md"
            ></input>
            <div id="button-group" className="absolute right-0 flex">
              <button
                id="plus-button"
                onClick={() => props.incrementNumTradesDesired()}
                className="px-3 mr-1 text-xl bg-gray-900 border border-black rounded-md cursor-pointer hover:bg-gray-800 hover:border-gray-800 leading-[1.5]"
              >
                +
              </button>
              <button
                id="minus-button"
                onClick={() => props.decrementNumTradesDesired()}
                className="px-3 mr-1 text-xl bg-gray-900 border border-black rounded-md cursor-pointer hover:bg-gray-800 hover:border-gray-800 leading-[1.5]"
              >
                -
              </button>
            </div>
          </div>
        </div>

        <div id="price-input-group" className="mb-3">
          <label id="input-label" className="flex pl-1 mb-[.375rem]">
            <span>Price</span>
          </label>
          <div id="input-group" className="relative flex flex-row items-center w-full">
            <input
              id="price-input"
              value={props.price || ''}
              min={0.01}
              step={0.01}
              type="number"
              onKeyDown={(e) => props.blockInvalidInput(e, 'decimal')}
              onChange={(e) => props.setPrice(e.target.value)}
              className="w-full px-3 py-2 pr-0 text-white bg-black border border-black rounded-md"
            ></input>
            <div
              id="bnb-label"
              className="absolute right-0 py-[.1875rem] flex items-center px-2 mr-1 text-[1rem] bg-gray-900 border border-black rounded-md "
            >
              <div id="bnb-icon" className="flex items-center w-5 h-5 mr-[0.2rem]">
                <Image src={bnbIcon} alt={'BNB'} />
              </div>
              <span style={{ lineHeight: '1.5rem' }}>BNB</span>
            </div>
          </div>
        </div>

        <div id="decrease-input-group" className="mb-3">
          <label id="input-label" className="flex items-center mb-[.375rem] flex-row pl-1">
            <span>Decrease by</span>
            <Tooltip
              show={show2}
              content={
                <div className="w-[14rem] text-center">
                  Your price will decrease by this amount each time someone sells you an NFT
                </div>
              }
              placement="top"
            >
              <QuestionMarkCircleIcon
                role="button"
                width={18}
                className="ml-1"
                onMouseEnter={() => setShow2(true)}
                onMouseLeave={() => setShow2(false)}
              />
            </Tooltip>
          </label>
          <div id="input-group" className="relative flex flex-row items-center w-full">
            <input
              id="price-decrease-input"
              type="number"
              value={props.decrease}
              min={0.001}
              step={0.001}
              onKeyDown={(e) => props.blockInvalidInput(e, 'decimal')}
              onChange={(e) => props.setDecrease(e.target.value)}
              className="w-full px-3 py-2 pr-0 text-white bg-black border border-black rounded-md"
            ></input>
            <div id="switch" className="absolute right-0 flex items-center mr-1 text-xl text-[1rem] leading-[1.5]">
              <button
                className="bg-gray-700 cursor-pointer py-[.1875rem] px-[.75rem] rounded-l-[6px]"
                style={{
                  backgroundColor: `${props.decreaseMode}` === 'bnb' ? 'rgb(55, 65, 81)' : 'rgb(17, 24, 39)',
                }}
                onClick={() => props.setDecreaseMode('bnb')}
              >
                BNB
              </button>
              <button
                className="bg-gray-900 cursor-pointer py-[.1875rem] px-[.75rem] rounded-r-[6px]"
                style={{
                  backgroundColor: `${props.decreaseMode}` === 'percent' ? 'rgb(55, 65, 81)' : 'rgb(17, 24, 39)',
                }}
                onClick={() => props.setDecreaseMode('percent')}
              >
                %
              </button>
            </div>
          </div>
        </div>

        <div id="footer" className="mt-9">
          <div id="total-row" className="flex justify-between">
            <p id="total" className="font-semibold leading-[1.1] text-[1.25rem] tracking-[-0.02em]">
              Total
            </p>
            <div id="total" className="flex items-center justify-center">
              <div id="bnb-icon" className="flex items-center w-5 h-5 mr-[0.375rem]">
                <Image src={bnbIcon} alt={'BNB'} />
              </div>
              <p style={{ fontWeight: 600, lineHeight: '1.1', fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
                {props.total}
              </p>
            </div>
          </div>
          {props.isInvalid && (
            <div id="invalid-notification" className="w-full text-center text-red">
              You can only buy up to {props.numValidTrades} Nfts at the current price curve.
            </div>
          )}

          <div id="description" className="mt-3">
            <p style={{ fontSize: '0.9375rem', fontWeight: 400, lineHeight: '1.5', letterSpacing: '-0.02em' }}>
              Your tokens will be escrowed into a pool contract you own. You can withdraw at any time by going to Your
              Pools.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

const ModalFooter = (props: any) => {
  return (
    <div id="create-offer-btn" className="m-1">
      <button
        onClick={() => props.executeListing()}
        className="w-full px-3 py-2 border border-black rounded-md hover:bg-gray-800 hover:border-gray-800"
      >
        Create Offer
      </button>
    </div>
  )
}
