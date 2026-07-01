import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { filterInventoryNfts, getNftsInPools, mapCollectionsFromNftData, setCollectionOffersOnNfts } from './functions'
import { Tab } from '@headlessui/react'
import useCollectionApi from '../../hooks/useCollectionApi'
import InventoryHeading from './InventoryHeading'
import ListingManagerModal from './ListingManagerModal'
import useDefinedApi from '../../hooks/useDefinedApi'
import AvailableNftsTab from './AvailableNftsTab'
import PooledNftsTab from './PooledNftsTab'
import TabButton from './TabButton'
import { useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core'

const PAGE_SIZE = 100
const NO_ACCOUNT = '0x00000000000000000000000000000000'

const Inventory = () => {
  const { fetchOwnedNftAssets } = useCollectionApi()
  const { getNftPoolsByOwner } = useDefinedApi()
  const { account, chainId } = useWeb3React()

  // Shared States
  const activeCollections = useSelector((state: any) => state.nftMarket.activeCollections)
  const [address, setAddress] = useState(account ? account : NO_ACCOUNT)
  const [tabIndex, setTabIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [offersAvailable, setOffersAvailable] = useState(false)

  // [AvailableNfts] Tab States
  const [availableNfts, setAvailableNfts] = useState([])
  const [availableNftFilters, setAvailableNftFilters] = useState(new Map())
  const [filteredAvailableNfts, setFilteredAvailableNfts] = useState([])
  const [selectedNfts, setSelectedNfts] = useState([])
  const [showOffers, setShowOffers] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  // [PooledNfts] Tab States
  const [ownedPools, setOwnedPools] = useState([])
  const [pooledNfts, setPooledNfts] = useState([])
  const [pooledNftFilters, setPooledNftFilters] = useState(new Map())
  const [filteredPooledNfts, setFilteredPooledNfts] = useState([])

  // use activeCollections slice from redux to set offers on availableNfts
  useEffect(() => {
    setOffersAvailable(activeCollections?.length > 0)
  }, [activeCollections])

  useEffect(() => {
    setCollectionOffersOnNfts(offersAvailable, activeCollections, availableNfts, setAvailableNfts)
  }, [availableNfts.length, offersAvailable])

  // if account change clear filter maps and update displayed address
  useEffect(() => {
    setAddress(account ? account : NO_ACCOUNT)
    setAvailableNftFilters(new Map())
    setPooledNftFilters(new Map())
  }, [account])

  // if account change get available account assets and your pools
  useEffect(() => {
    if (!account || chainId !== 56) {
      setAvailableNfts([])
      setOwnedPools([])
      return
    }
    fetchOwnedNftAssets(account, setAvailableNfts)
    getNftPoolsByOwner(account, setOwnedPools)
  }, [account])

  // after fetching account pools, extract nfts from them
  useEffect(() => {
    setPooledNfts(getNftsInPools(ownedPools))
  }, [ownedPools])

  // after fectching available nfts build filters by collection
  useEffect(() => {
    setAvailableNftFilters(mapCollectionsFromNftData(availableNfts, activeCollections))
  }, [availableNfts])

  // after fetching and extracting pooled nfts build filters by collection
  useEffect(() => {
    setPooledNftFilters(mapCollectionsFromNftData(pooledNfts, activeCollections, true))
  }, [pooledNfts])

  // if nfts change or selected filters change, re-apply filter functions
  useEffect(() => {
    setFilteredAvailableNfts(filterInventoryNfts(availableNfts, availableNftFilters))
  }, [availableNfts, availableNftFilters])

  useEffect(() => {
    setFilteredPooledNfts(filterInventoryNfts(pooledNfts, pooledNftFilters))
  }, [pooledNfts, pooledNftFilters])

  const getAvailableNfts = () => {
    if (account) fetchOwnedNftAssets(account, setAvailableNfts).then((r) => console.log('Finished fetching data'))
  }

  return (
    <div
      id="inventory-page"
      className={'flex flex-col w-full overflow-y-auto ' + (tabIndex === 0 ? ' h-[calc(100%-3.5rem)]' : ' h-full')}
    >
      <ListingManagerModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        refreshData={getAvailableNfts}
        selectedNfts={selectedNfts}
        setSelectedNfts={setSelectedNfts}
        account={account}
      />
      <InventoryHeading address={address} />
      <Tab.Group defaultIndex={0} selectedIndex={tabIndex} onChange={setTabIndex}>
        <Tab.List className="flex justify-between gap-[1.5rem] sm:gap-[6rem] mx-auto mb-2">
          <TabButton text="Available NFTs" index={0} tabIndex={tabIndex} badgeValue={availableNfts.length} />
          <TabButton text="Pooled Nfts" index={1} tabIndex={tabIndex} badgeValue={pooledNfts.length} />
        </Tab.List>
        <Tab.Panels id="panels">
          <AvailableNftsTab
            filteredAvailableNfts={filteredAvailableNfts}
            availableNftFilters={availableNftFilters}
            setAvailableNftFilters={setAvailableNftFilters}
            showOffers={showOffers}
            setShowOffers={setShowOffers}
            selectedNfts={selectedNfts}
            setSelectedNfts={setSelectedNfts}
            setModalOpen={setModalOpen}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            pageSize={PAGE_SIZE}
          />
          <PooledNftsTab
            filteredPooledNfts={filteredPooledNfts}
            pooledNftFilters={pooledNftFilters}
            setPooledNftFilters={setPooledNftFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            pageSize={PAGE_SIZE}
          />
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default Inventory
