import Web3 from 'web3'
import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import router, { useRouter } from 'next/router'
import useCollectionApi from '../../hooks/useCollectionApi'
import useDefinedApi from '../../hooks/useDefinedApi'
import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsToSell } from '../../state/cart'
import { setNeedsUpdate } from '../../state/nftMarket'
import { filterNfts } from '../../functions/filtering'
import { byIdAsc, filter, getCollectionDescription } from './functions'
import {
  getNftsToBuyFromPools,
  getSpotPrices,
  mapCartItemsToPools,
  processNftMetadatas,
  repriceListingsAndItemsToBuy,
  setSpotPricesOnNfts,
} from '../../config/functions'
import { mapOwnedNfts } from './SellTab/functions'
import CollectionBanner from './CollectionBanner'
import CollectionMetadata from './CollectionMetadata'
import CollectionOffer from './CollectionOffer'
import { Tab } from '@headlessui/react'
import TabButton from './TabButton'
import BuyTab from './BuyTab'
import SellTab from './SellTab'
import ActivityTab from './ActivityTab'
import PoolsTab from './PoolsTab'
import { useWeb3React } from '@web3-react/core'

const NftCollection = () => {
  // hooks
  const dispatch = useDispatch()
  const { getNftPoolsByCollectionAndExchange, getAllNftPoolEvents, getNftPoolCollection } = useDefinedApi()
  const { fetchNftMetadata, fetchNftMetadataById, fetchNftsOwnedInCollection, fetchCollectionDetailsShort } =
    useCollectionApi()
  const { address } = router.query
  const { account, chainId } = useWeb3React()

  //redux slices
  const cartItemsToSell = useSelector((state: any) => state.cart.itemsToSell)
  const cartItemsToBuy = useSelector((state: any) => state.cart.cartItems)
  const needsUpdate = useSelector((state: any) => state.nftMarket.needsUpdate)

  // fetched data
  const [details, setDetails] = useState(null)
  const [stats, setStats] = useState(null)
  const [collectionActivity, setCollectionActivity] = useState([])
  const [liqPools, setLiqPools] = useState(null) // pools where we get offers from
  const [assets, setAssets] = useState([]) // your wallet asset data
  const [description, setDescription] = useState(null)

  // booleans
  const [canInitializeMetadata, setCanInitializeMetadata] = useState(false)
  const [metadataInitialized, setMetadataInitialized] = useState(false)
  const [canInitSellTabMetadata, setCanInitSellTabMetadata] = useState(false)
  const [sellTabMetaInitialized, setSellTabMetaInitialized] = useState(false)

  // arrays of calculated values
  const [purchasableNfts, setPurchasableNfts] = useState(null) // raw, unordered, nft list from pools
  const [pricedNfts, setPricedNfts] = useState(null) // nft list + pricing
  const [filteredNftsToBuy, setFilteredNftsToBuy] = useState(null) // nft list + pricing + filters
  const [pricedNftsToSell, setPricedNftsToSell] = useState(null)
  const [filteredNftsToSell, setFilteredNftsToSell] = useState(null)

  // maps
  const [purchasableNftMap, setPurchasableNftMap] = useState(null) // fast lookup nftData in Buy Tab by tokenId
  const [assetsMap, setAssetsMap] = useState(null) // fast lookup nftData in Sell Tab by tokenId

  //TO-DO: merge isFiltered flag into traitsMap so that traitFilters can be removed
  const [traitsMap, setTraitsMap] = useState(null) // map of maps, outer = trait types (hat), inner = trait values (red)
  const [traitFilters, setTraitFilters] = useState(new Map()) // map of which trait values are currently filtered
  const [assetTraitsMap, setAssetTraitsMap] = useState(new Map()) // same but for sell tab
  const [assetTraitFilters, setAssetTraitFilters] = useState(new Map()) // same but for sell tab

  const [cartPoolMap, setCartPoolMap] = useState(new Map()) // fast lookup if nft is in cart and which pool its from

  //component state
  const [tabIndex, setTabIndex] = useState(null)

  // useEffect(() => {
  //   console.log(assets)
  // }, [assets])

  // useEffect(() => {
  //   console.log(filteredNftsToSell)
  // }, [filteredNftsToSell])

  //   useEffect(() => {
  //     console.log(purchasableNfts)
  //   }, [purchasableNfts])

  //   useEffect(() => {
  //     console.log(traitFilters)
  //   }, [traitFilters])

  //   useEffect(() => {
  //     console.log(traitsMap)
  //   }, [traitsMap])

  //   useEffect(() => {
  //     console.log(filteredNftsToBuy)
  //   }, [filteredNftsToBuy])

  useEffect(() => {
    console.log(details)
  }, [details])

  // (optional): Get nfts you own from this collection if wallet connected
  useEffect(() => {
    setAssets([])
    fetchNftsOwnedInCollection(account, address, setAssets, chainId)
  }, [account, address, chainId])

  // 1: Get details, activity, stats, and all liquidity pools for this collection address (on mount)
  useEffect(() => {
    const cancelSource = axios.CancelToken.source()
    fetchCollectionDetailsShort(address, setDetails)
    getNftPoolCollection(address, setStats, cancelSource)
    getCollectionDescription(address, fetchNftMetadataById, setDescription)
    getAllNftPoolEvents(address, setCollectionActivity, filter, cancelSource)
    getNftPoolsByCollectionAndExchange(address, setLiqPools, cancelSource)
    return () => cancelSource.cancel()
  }, [])

  // 2: Get all nfts that can be bought from the liqPools
  useEffect(() => {
    if (liqPools === null) return
    let { purchasableNfts, purchasableNftMap } = getNftsToBuyFromPools(liqPools)
    setPurchasableNfts(purchasableNfts)
    setPurchasableNftMap(purchasableNftMap)
  }, [liqPools])

  // 3: price the nfts so they can be ready for display
  // will be called once when purchasableNfts are set without metadatas
  // will be called again after metadatas are added causing state of purchasableNfts to update
  useEffect(() => {
    if (purchasableNfts === null) return
    let repricedNfts = repriceListingsAndItemsToBuy(purchasableNfts, cartPoolMap)
    setPricedNfts(repricedNfts)
  }, [purchasableNfts, cartPoolMap])

  // 4: add metadatas to purchasableNfts so that we can use filters
  useEffect(() => {
    // only do this if !metadataInitialized to avoid infinite loop setting purchasableNfts
    if (purchasableNftMap?.size && !metadataInitialized && canInitializeMetadata) {
      processNftMetadatas(address, purchasableNftMap, fetchNftMetadata, setTraitsMap, setPurchasableNfts)
      setMetadataInitialized(true)
    }
  }, [purchasableNftMap, metadataInitialized, canInitializeMetadata])

  // 5: after nfts have been repriced set them, also handle filtering (if filters available)
  useEffect(() => {
    traitFilters.size === 0
      ? setFilteredNftsToBuy(pricedNfts)
      : setFilteredNftsToBuy(filterNfts(pricedNfts, traitFilters, address))
  }, [traitFilters, pricedNfts])

  // (cart-dependent): once details loaded, map cart items to pools in this collection address
  useEffect(() => {
    if (details) setCartPoolMap(mapCartItemsToPools(cartItemsToBuy, details))
  }, [cartItemsToBuy, details])

  // (tx-dependent): update liquidity pool data on tx confirmations
  useEffect(() => {
    if (!needsUpdate) return
    const cancelSource = axios.CancelToken.source()
    getNftPoolsByCollectionAndExchange(address, setLiqPools, cancelSource)
    dispatch(setNeedsUpdate(false))
    return () => cancelSource.cancel()
  }, [needsUpdate])

  // (cart/asset-dependent): set offers for your nfts to sell based on available pools and nfts in cart
  useEffect(() => {
    if (!assets || assets.length === 0) {
      setPricedNftsToSell([])
    } else if (assets?.length > 0) {
      let poolsWithOffers = liqPools?.filter((pool) => pool.poolType === 'SELL' || pool.poolType === 'BUY_AND_SELL')
      let highestOffer = stats?.offerNBT ? +Web3.utils.fromWei(String(stats.offerNBT)) : '0'
      let spotPrices = poolsWithOffers !== undefined ? getSpotPrices(poolsWithOffers, highestOffer) : []
      let { updatedCartItems, listings } = setSpotPricesOnNfts(assets, cartItemsToSell, spotPrices, account, address)
      // console.log('setting nfts to sell 1: ', listings)
      setPricedNftsToSell(listings)
      if (updatedCartItems) dispatch(setItemsToSell(updatedCartItems))
    }
  }, [assets, liqPools, cartItemsToSell.length])

  useEffect(() => {
    if (assets?.length > 0) setAssetsMap(mapOwnedNfts(assets))
  }, [assets.length])

  useEffect(() => {
    if (assetsMap?.size && !sellTabMetaInitialized && canInitSellTabMetadata) {
      processNftMetadatas(address, assetsMap, fetchNftMetadata, setAssetTraitsMap, setAssets)
      setSellTabMetaInitialized(true)
    }
  }, [assetsMap, sellTabMetaInitialized, canInitSellTabMetadata])

  useEffect(() => {
    assetTraitFilters.size === 0
      ? setFilteredNftsToSell(pricedNftsToSell)
      : setFilteredNftsToSell(filterNfts(pricedNftsToSell, assetTraitFilters, address))
  }, [assetTraitFilters, pricedNftsToSell])

  // watch tabIndex and set the url accordingly
  useEffect(() => {
    if (tabIndex === 0) router.replace('/nftamm/collection/' + address + '#buy')
    else if (tabIndex === 1) router.replace('/nftamm/collection/' + address + '#sell')
    else if (tabIndex === 2) router.replace('/nftamm/collection/' + address + '#pools')
    else if (tabIndex === 3) router.replace('/nftamm/collection/' + address + '#activity')
  }, [tabIndex])

  // watch the url to see which tab should be rendered
  useEffect(() => {
    if (router.asPath.includes('#buy')) setTabIndex(0)
    else if (router.asPath.includes('#sell')) setTabIndex(1)
    else if (router.asPath.includes('#pools')) setTabIndex(2)
    else if (router.asPath.includes('#activity')) setTabIndex(3)
  }, [router.asPath])

  return (
    <>
      <Head>
        <title>{details?.name ? details.name : 'Nft Collection'} | GhostSwap</title>
        <meta key="description" name="description" content="Explore..." />
      </Head>
      {details && (
        <div className="pb-[2rem] w-full">
          <CollectionBanner
            details={details}
            liqPools={liqPools}
            assets={assets}
            floorPrice={stats && stats.floorNBT ? Web3.utils.fromWei(stats.floorNBT, 'ether') : '0'}
            bestOffer={stats && stats.offerNBT ? Web3.utils.fromWei(stats.offerNBT, 'ether') : '0'}
            offerTvl={stats && stats.balanceNBT ? Web3.utils.fromWei(stats.balanceNBT, 'ether') : '0'}
            volume={stats && stats.volumeAllTimeNBT ? Web3.utils.fromWei(stats.volumeAllTimeNBT, 'ether') : '0'}
          />

          <CollectionMetadata details={details} description={description} />

          <CollectionOffer
            account={account}
            liqPools={liqPools}
            details={details}
            bestOffer={stats && stats.offerNBT ? Web3.utils.fromWei(stats.offerNBT, 'ether') : '0'}
            floorPrice={stats && stats.floorNBT ? Web3.utils.fromWei(stats.floorNBT, 'ether') : '0'}
          />

          <Tab.Group defaultIndex={0} selectedIndex={tabIndex} onChange={setTabIndex}>
            <Tab.List className="flex items-center justify-center pt-4 pb-2">
              <TabButton text="Buy" index={0} tabIndex={tabIndex} badgeValue={filteredNftsToBuy?.length || '0'} />
              <TabButton text="Sell" index={1} tabIndex={tabIndex} badgeValue={filteredNftsToSell?.length || '0'} />
              <TabButton text="Pools" index={2} tabIndex={tabIndex} badgeValue={liqPools?.length || '0'} />
              <TabButton text="Activity" index={3} tabIndex={tabIndex} />
            </Tab.List>
            <Tab.Panels id="panels" className={'overflow-hidden h-full'}>
              <BuyTab
                details={details}
                purchasableNfts={purchasableNfts}
                filteredNftsToBuy={filteredNftsToBuy}
                pools={liqPools}
                traitsMap={traitsMap}
                setTraitsMap={setTraitsMap}
                traitFilters={traitFilters}
                setTraitFilters={setTraitFilters}
                setCanInitializeMetadata={setCanInitializeMetadata}
              />
              <SellTab
                details={details}
                filteredNftsToSell={filteredNftsToSell !== null ? filteredNftsToSell : []}
                assets={assets}
                assetTraitFilters={assetTraitFilters}
                setAssetTraitFilters={setAssetTraitFilters}
                assetTraitsMap={assetTraitsMap}
                setAssetTraitsMap={setAssetTraitsMap}
                setCanInitSellTabMetadata={setCanInitSellTabMetadata}
                sellTabMetaInitialized={sellTabMetaInitialized}
              />
              <PoolsTab details={details} liqPools={liqPools} />
              <ActivityTab details={details} collectionActivity={collectionActivity} />
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}
    </>
  )
}

export default React.memo(NftCollection)
