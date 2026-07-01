import router from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import About from './About'
import EditPoolModal from './EditPoolModal'
import PoolAssets from './PoolAssets'
import PoolHeader from './PoolHeader'
import PoolLinks from './PoolLinks'
import PoolNotFoundNotification from '../PoolNotFoundNotification'
import PoolPricing from './PoolPricing'
import PriceGraph from './PriceGraph'
import SwapHistory from './SwapHistory'
import axios from 'axios'
import useDefinedApi from '../../hooks/useDefinedApi'
import { getCollectionDetailsFromPool, getNftDataFromPool } from './functions'
import Web3 from 'web3'
import useCollectionApi from '../../hooks/useCollectionApi'
import { useWeb3React } from '@web3-react/core'

const controlsContainer = ' w-full mx-auto xs:max-w-[540px] md:max-w-[720px] md2:max-w-[960px] lg3:max-w-[1140px] '

const PoolViewer = () => {
  const { address: poolAddress } = router.query
  const { fetchNftsOwnedInCollection } = useCollectionApi()
  const { getNftPool } = useDefinedApi()
  const { account, chainId } = useWeb3React()

  const [nfts, setNfts] = useState([])
  const [avatar, setAvatar] = useState(null)
  const [canEdit, setCanEdit] = useState(false)
  const [ownedNfts, setOwnedNfts] = useState([])
  const [poolDetails, setPoolDetails] = useState(null)
  const [modalState, setModalState] = useState('closed')
  const [collectionName, setCollectionName] = useState('')

  const collections = useSelector((state: any) => state.nftMarket.collections)

  useEffect(() => {
    getNftPool(poolAddress, setPoolDetails, axios.CancelToken.source())
  }, [poolAddress])

  useEffect(() => {
    getCollectionDetailsFromPool(collections, poolDetails, setCollectionName, setAvatar)
    setNfts(getNftDataFromPool(poolDetails))
  }, [poolDetails])

  useEffect(() => {
    if (poolDetails && account)
      fetchNftsOwnedInCollection(account, poolDetails.collectionAddress, setOwnedNfts, chainId)
  }, [account, poolDetails, chainId])

  useEffect(() => {
    setCanEdit(Web3.utils.toChecksumAddress(account) === Web3.utils.toChecksumAddress(poolDetails?.owner))
  }, [account, poolDetails])

  return !poolDetails ? (
    <PoolNotFoundNotification poolAddress={poolAddress} />
  ) : (
    <>
      <EditPoolModal
        modalState={modalState}
        closeModal={() => setModalState('closed')}
        poolDetails={poolDetails}
        nfts={nfts}
        ownedNfts={ownedNfts}
        canEdit={canEdit}
        account={account}
        poolAddress={poolAddress}
      />
      <div id="view-pool-page" className="w-full mt-6">
        <PoolHeader poolAddress={poolAddress} poolDetails={poolDetails} avatar={avatar} shortName={'NFT'} />
        <div id="pool-controls" className={'px-3 mt-6 mb-[8rem] lg:mb-[4rem] min-h-[50rem] ' + controlsContainer}>
          <PoolLinks
            collectionAddress={poolDetails?.collectionAddress}
            poolAddress={poolAddress}
            name={collectionName || 'Collection'}
            avatar={avatar}
          />
          <div id="controls-outter-flex-col" className="flex flex-col gap-3 mt-3">
            <div id="controls-inner-dynamic-flex" className="flex flex-col gap-3 md2:flex-row">
              <PoolAssets poolDetails={poolDetails} nfts={nfts} canEdit={canEdit} setModalState={setModalState} />
              <div id="controls-inner-flex-col" className="flex flex-col w-full h-auto gap-3">
                <PoolPricing poolDetails={poolDetails} canEdit={canEdit} setModalState={setModalState} />
                <About poolDetails={poolDetails} avatar={avatar} />
              </div>
            </div>
            <PriceGraph poolDetails={poolDetails} />
            <SwapHistory poolDetails={poolDetails} poolAddress={poolAddress} />
          </div>
        </div>
      </div>
    </>
  )
}

export default PoolViewer
