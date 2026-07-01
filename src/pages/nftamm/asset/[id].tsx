import Container from '../../../components/Container'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import useDefinedApi from '../../../hooks/useDefinedApi'
import Web3 from 'web3'
import { useActiveWeb3React } from '../../../hooks'
import { getSigner } from '../../../functions'
import { Contract } from '@ethersproject/contracts'
import { NFT_ROUTER } from '../../../config/contracts'
import { NFT_ROUTER_ABI } from '../../../web3/abi'
import { ethers } from 'ethers'
import { getGhostBuffs } from '../../../config/functions'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import dynamic from 'next/dynamic'
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })
import skeletonLoadSquare from '../../../animation/skeleton-load-square.json'

import NftMetadata from './NftMetadata'
import Properties from './Properties'
import PriceDetails from './PriceDetails'
import PoolAddresses from './PoolAddresses'
import useCollectionApi from '../../../hooks/useCollectionApi'
import ContractAddressLink from './ContractAddressLink'

import littleGhostRanks from '../../../constants/little-ghosts-ranks/little-ghosts-ranks.json'
import ectoSkeletonsRanks from '../../../constants/ecto-skeletons-ranks-and-buffs/ecto-skeletons-ranks-and-buffs.json'
import { useWeb3React } from '@web3-react/core'
import ForceBnbSwitch from '../../../components/ForceBnbSwitch'
const littleGhostsCollectionAddress = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48'
const ectoSkeletonsCollectionAddress = '0x0fa48f20dddcf6ed724a36381f66c3e905fe7988'

const responsivePage = ' max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] h-full w-full'

export default function ItemDetails(props: any) {
  const router = useRouter()
  const { id, address } = router.query
  const [poolData, setPoolData] = useState(null)
  const [price, setPrice] = useState(null)
  const [liqPools, setLiqPools] = useState([])
  const [traitValues, setTraitValues] = useState('')
  const [traitIds, setTraitIds] = useState('')
  const [traitNames, setTraitNames] = useState('')
  const [name, setName] = useState('')
  const [metadata, setMetadata] = useState(null)
  const [imageSource, setImageSource] = useState(null)
  const [rank, setRank] = useState(null)
  const [maxRank, setMaxRank] = useState(null)
  const [buffsAdded, setBuffsAdded] = useState(false)
  const { getNftPoolsByCollectionAndExchange } = useDefinedApi()
  //   const { account, library } = useActiveWeb3React()
  const { account, provider } = useWeb3React()
  const { fetchFullQualityImage, fetchNftMetadata } = useCollectionApi()

  useEffect(() => {
    const cancelSource = axios.CancelToken.source()
    fetchFullQualityImage(address, id, setImageSource)
    fetchNftMetadata(address, id, setTraitIds, setTraitNames, setTraitValues, setName, setMetadata, cancelSource)
    return () => {
      cancelSource.cancel()
    }
  }, [])

  // set ranks
  useEffect(() => {
    if (address.toString().toLowerCase() === littleGhostsCollectionAddress) {
      setRank(littleGhostRanks[id.toString()].rank)
      setMaxRank(10000)
    }
    if (address.toString().toLowerCase() === ectoSkeletonsCollectionAddress) {
      setRank(ectoSkeletonsRanks[id.toString()].rank)
      setMaxRank(2500)
    }
  }, [])

  // add buffs to metadata
  useEffect(() => {
    // do not add to metadata until after the metadata has been fetched
    if (buffsAdded || !rank || !Array.isArray(metadata) || metadata.length < 1) return

    let updatedMeta = [...metadata]

    if (address.toString().toLowerCase() === littleGhostsCollectionAddress) {
      let buffs = { value: getGhostBuffs(rank), trait_type: 'Buffs' }
      updatedMeta.push(buffs)
      setMetadata(updatedMeta)
    }
    if (address.toString().toLowerCase() === ectoSkeletonsCollectionAddress) {
      let buffs = ectoSkeletonsRanks[id.toString()].buffs
      for (let buff of Array.from(Object.entries(buffs))) {
        if (buff[1] !== 'None') updatedMeta.push({ value: buff[1], trait_type: buff[0] })
      }
      setMetadata(updatedMeta)
    }

    setBuffsAdded(true)
  }, [metadata, rank])

  useEffect(() => {
    const cancelSource = axios.CancelToken.source()
    getNftPoolsByCollectionAndExchange(address, setLiqPools, cancelSource)
    return () => {
      cancelSource.cancel()
    }
  }, [address])

  useEffect(() => {
    if (liqPools) {
      for (const pool of liqPools) {
        if (pool.nftAssets) {
          for (const nft of pool.nftAssets) {
            if (nft.tokenId === id) {
              setPrice(Web3.utils.fromWei(pool.floorNBT))
              setPoolData(pool)
            }
          }
        }
      }
    }
  }, [liqPools])

  const handleCheckout = () => {
    if (account) {
      const signer = getSigner(provider, account)
      const contract = new Contract(NFT_ROUTER, NFT_ROUTER_ABI, signer)
      const swapList = new Map()
      swapList.set(poolData.poolAddress, [id])

      const tuple = Array.from(swapList)

      contract
        .swapETHForSpecificNFTs(tuple, account, account, Date.now() + 100, { value: ethers.parseEther(price) })
        .then((transactionResponse) => {
          transactionResponse.wait().then((receipt) => {
            if (receipt && receipt.blockNumber) {
              Toastify({
                text: 'Successfully Bought NFT!',
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
              setPrice(0)
            }
          })
        })
    }
  }

  return (
    <ForceBnbSwitch>
      <Container className="flex items-center justify-center w-full py-4 mb-[8rem] md:mb-0" maxWidth="full">
        <Head>
          <title>{name} | GhostSwap</title>
          <meta key="description" name="description" content="NFT item details." />
        </Head>

        <div
          id="details"
          className={'flex flex-col md:flex-row justify-center items-center px-2 py-2' + responsivePage}
        >
          <div id="details-1" className="flex-col items-center justify-center w-full px-3 md:max-w-[42%] h-[inherit]">
            <div className="block md:hidden">
              <ContractAddressLink name={name} id={id} address={address} rank={rank} maxRank={maxRank} />
            </div>

            <div id="nft-image" className="flex overflow-hidden rounded-md transition-all ease-in duration-[1s]">
              {imageSource && <img className="relative overflow-hidden" src={imageSource} alt={name + ' #' + id} />}
              {!imageSource && <Lottie animationData={skeletonLoadSquare} autoplay loop className="overflow-hidden" />}
            </div>

            <div className="hidden md:block">
              <NftMetadata address={address} id={id} />
            </div>
          </div>

          <div id="details-2" className="flex-col items-center justify-center w-full px-3 md:max-w-[58%] h-[inherit]">
            <div className="hidden md:block">
              <ContractAddressLink name={name} id={id} address={address} rank={rank} maxRank={maxRank} />
            </div>

            {price && (
              <div id="purchasing-details" className="px-6 py-3 mt-6 bg-gray-900 rounded-md">
                <PriceDetails price={price} handleCheckout={handleCheckout} />
                <hr className="my-3 border-gray-600 opacity-50" />
                {poolData && <PoolAddresses poolAddress={poolData.poolAddress} ownerAddress={poolData.owner} />}
              </div>
            )}

            <Properties traitValues={traitValues} traitIds={traitIds} traitNames={traitNames} metadata={metadata} />

            <div className="block md:hidden">
              <NftMetadata address={address} id={id} />
            </div>
          </div>
        </div>
      </Container>
    </ForceBnbSwitch>
  )
}
