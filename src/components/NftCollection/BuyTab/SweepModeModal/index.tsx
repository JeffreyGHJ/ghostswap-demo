import ThreePartModal from '../../../Modal/ThreePartModal'
import { useEffect, useState } from 'react'
import {useSelector } from 'react-redux'
import useNftImageSources from '../../../../hooks/useNftImageSources'
import { buildOptimalSweepSequence } from '../functions'
import { useActiveWeb3React } from '../../../../hooks'
import useDefinedApi from '../../../../hooks/useDefinedApi'
import SweepModeModalHeader from './SweepModeModalHeader'
import SweepModeModalBody from './SweepModeModalBody'
import SweepModeModalFooter from './SweepModeModalFooter'

export const SweepModeModal = (props: any) => {
  const { account } = useActiveWeb3React()
  const { getNftImageSource } = useNftImageSources()
  const { getNftPoolsByOwner } = useDefinedApi()
  const [inputValue, setInputValue] = useState(0)
  const [nftsToSweep, setNftsToSweep] = useState([])
  const [currencySwitch, setCurrencySwitch] = useState('items')
  const cartItems = useSelector((state: any) => state.cart.cartItems)
  const nfts = props.nfts.sort((a, b) => +a.price - +b.price)

  const [poolsWithItemsInCart, setPoolsWithItemsInCart] = useState(new Map())
  const [collectionIdsInCart, setCollectionIdsInCart] = useState([])
  const [sweepSequence, setSweepSequence] = useState([])
  const [filteredSweep, setFilteredSweep] = useState([])
  const [ownedPools, setOwnedPools] = useState([])
  const [addressesToExclude, setAddressesToExclude] = useState(new Set())
  const [minPriceFilter, setMinPriceFilter] = useState('')
  const [maxPriceFilter, setMaxPriceFilter] = useState('')

  const byPriceFilters = (nftData) => {
    if (minPriceFilter && +nftData.price < +minPriceFilter) return
    if (maxPriceFilter && +nftData.price > +maxPriceFilter) return
    return nftData
  }

  useEffect(() => {
    setFilteredSweep(sweepSequence.filter(byPriceFilters))
  }, [sweepSequence, minPriceFilter, maxPriceFilter])

  useEffect(() => {
    let addresses = new Set(ownedPools.map((pool) => pool.poolAddress.toLowerCase()))
    setAddressesToExclude(addresses)
  }, [ownedPools])

  useEffect(() => {
    getNftPoolsByOwner(account, setOwnedPools)
  }, [account])

  useEffect(() => {
    let pools = new Map()
    let ids = []
    for (let cartItem of cartItems) {
      if (cartItem.collectionAddress === props.details.address) {
        ids.push(cartItem.id)
        let poolAddress = cartItem.poolAddress
        pools.set(poolAddress, pools.get(poolAddress) + 1 || 1)
      }
    }
    setCollectionIdsInCart(ids)
    setPoolsWithItemsInCart(pools)
  }, [props.pools, cartItems])

  useEffect(() => {
    // make optimal sweep sequence
    setSweepSequence(buildOptimalSweepSequence(nfts, addressesToExclude, poolsWithItemsInCart, collectionIdsInCart))
  }, [poolsWithItemsInCart, addressesToExclude])

  const updateCurrencySwitch = (value) => {
    if (value === 'items') setInputValue(~~inputValue)
    setCurrencySwitch(value)
  }

  useEffect(() => {
    if (props.isOpen === false) setInputValue(0)
  }, [props.isOpen])

  return (
    <ThreePartModal
      isOpen={props.isOpen}
      closeModal={props.closeModal}
      header={
        <SweepModeModalHeader
          totalNfts={filteredSweep.length}
          details={props.details}
          inputValue={inputValue}
          setInputValue={setInputValue}
          currencySwitch={currencySwitch}
          updateCurrencySwitch={updateCurrencySwitch}
          cartItems={cartItems}
          setMinPriceFilter={setMinPriceFilter}
          setMaxPriceFilter={setMaxPriceFilter}
        />
      }
      body={
        <SweepModeModalBody
          nfts={nfts}
          inputValue={inputValue}
          nftsToSweep={nftsToSweep}
          setNftsToSweep={setNftsToSweep}
          cartItems={cartItems}
          details={props.details}
          currencySwitch={currencySwitch}
          setInputValue={setInputValue}
          sweepSequence={filteredSweep}
        />
      }
      footer={
        <SweepModeModalFooter
          nfts={nfts}
          inputValue={inputValue}
          setInputValue={setInputValue}
          cartItems={cartItems}
          nftsToSweep={nftsToSweep}
          details={props.details}
          setNftsToSweep={setNftsToSweep}
          getNftImageSource={getNftImageSource}
        />
      }
    />
  )
}
