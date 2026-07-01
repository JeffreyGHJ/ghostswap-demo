import axios from 'axios'
import { useDispatch } from 'react-redux'
import littleGhostRanks from '../constants/little-ghosts-ranks/little-ghosts-ranks.json'
import ectoSkeletonsMeta from '../constants/ecto-skeletons-ranks-and-buffs/ecto-skeletons-ranks-and-buffs.json'
import useDefinedApi from './useDefinedApi'

const littleGhostsCollectionAddress = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48'
const ectoSkeletonsCollectionAddress = '0x0fa48f20dddcf6ed724a36381f66c3e905fe7988'

const buffs = ['+8 Every Bonus', '+6 Every Bonus', '+5 Every Bonus', '+4 Every Bonus']

function getGhostBuffs(rank) {
  if (rank <= 100) {
    return buffs[0]
  } else if (rank <= 1000) {
    return buffs[1]
  } else if (rank <= 3000) {
    return buffs[2]
  }
  return buffs[3]
}

function useCollectionApi() {
  const dispatch = useDispatch()
  const { getNftPoolCollection } = useDefinedApi()

  const fetchFullQualityImage = async (address, id, setImageSource) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/image/full/` + address + '/' + id)
      .then((response) => {
        setImageSource(response.data.imageURL)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const fetchScrapedTradeData = async (rankCollections, setLastRank, setCollections) => {
    fetch(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/collectionTrades`)
      .then((res) => res.json())
      .then((data) => {
        let rank = rankCollections(data)
        setLastRank(rank)
        dispatch(setCollections(data))
      })
  }

  const fetchNftMetadata = async (
    address,
    id,
    setTraitIds = null,
    setTraitNames = null,
    setTraitValues = null,
    setName = null,
    setMetadata = null,
    cancelSource = null
  ) => {
    let results = {
      traitIds: null,
      traitNames: null,
      traitValues: null,
      name: null,
      metadata: null,
      nftId: id,
    }
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/details/` + address + '/short/' + id, {
        cancelToken: cancelSource?.token,
      })
      .then(async (response) => {
        if (response.data.metadataIds) {
          results.traitIds = response.data.metadataIds[0].metadataIds[0].values[0].split(',').map(Number)
          if (setTraitIds) setTraitIds(results.traitIds)
        }
        if (response.data.traits) {
          results.traitNames = response.data.traits
          if (setTraitNames) setTraitNames(results.traitNames)
        }
        if (response.data.traitValues) {
          results.traitValues = response.data.traitValues
          if (setTraitValues) setTraitValues(results.traitValues)
        }
        if (response.data.name) {
          results.name = response.data.name
          if (setName) setName(results.name)
        }

        if (response.data.rawData) {
          results.metadata = response.data.metadata.attributes
          if (setMetadata) setMetadata(results.metadata)
        }
      })
      .catch(async (error) => {
        if (axios.isCancel(error)) {
          console.log('fetchData() aborted')
        }
      })

    return results
  }

  const fetchNftMetadataById = async (address, id) => {
    let res = null
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/details/` + address + '/meta/' + id)
      .then((response) => {
        // console.log(response.data)
        res = response.data
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('fetchData() aborted')
        } else {
          console.log(error?.response?.data)
        }
      })

    return res
  }

  const fetchNftsOwnedInCollection = async (account, collectionAddress, setOwnedNfts = null, chainId) => {
    let nfts = []
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_AWS_URL}api/collection/account/` +
          account +
          '/moralis/assets/collection/' +
          collectionAddress +
          `/${chainId}`
      )
      .then((response) => {
        if (collectionAddress.toLowerCase() === littleGhostsCollectionAddress) {
          for (let nft of response.data) {
            nfts.push({
              name: nft.name,
              symbol: nft.symbol,
              tokenAddress: nft.tokenAddress,
              tokenId: nft.tokenId,
              id: nft.tokenId,
              owner: account,
              rank: littleGhostRanks[nft.tokenId].rank,
              rarity_score: littleGhostRanks[nft.tokenId].rarity_score,
              trait_count: littleGhostRanks[nft.tokenId].trait_count,
            })
          }
        } else if (collectionAddress.toLowerCase() === ectoSkeletonsCollectionAddress) {
          for (let nft of response.data) {
            nfts.push({
              name: nft.name,
              symbol: nft.symbol,
              tokenAddress: nft.tokenAddress,
              tokenId: nft.tokenId,
              id: nft.tokenId,
              owner: account,
              rank: ectoSkeletonsMeta[nft.tokenId].rank,
              buffs: ectoSkeletonsMeta[nft.tokenId].buffs,
            })
          }
        } else {
          for (let nft of response.data) {
            nfts.push({
              name: nft.name,
              symbol: nft.symbol,
              tokenAddress: nft.tokenAddress,
              tokenId: nft.tokenId,
              id: nft.tokenId,
              owner: account,
              rank: null,
              rarity_score: null,
              trait_count: null,
            })
          }
        }
        if (setOwnedNfts !== null) setOwnedNfts(nfts)
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('fetchData() aborted')
        } else {
          console.log(error)
          console.log(error?.response)
          console.log(error?.response?.data)
        }
      })
    return nfts
  }

  const fetchOwnedCollections = async (account, setOwnedCollections) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/account/` + account + '/moralis/collections')
      .then((response) => {
        setOwnedCollections(response.data)
        // console.log(response.data)
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('fetchData() aborted')
        } else {
          console.log(error?.response?.data)
        }
      })
  }

  const fetchCollectionDetailsShort = async (address, setDetails) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/details/` + address + '/short')
      .then((response) => {
        console.log(response)
        if (!response?.data?.address) {
          console.log('collection api failed')
          // setDetails(null)
          getNftPoolCollection(address, setDetails)
        } else setDetails(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const fetchOwnedNftAssets = async (account, setNftData) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/account/` + account + '/moralis/assets')
      .then((response) => {
        // setNftData(response.data)
        // console.log(response.data)
        let nfts = []

        for (let nft of response.data) {
          if (nft.tokenAddress.toLowerCase() === littleGhostsCollectionAddress) {
            // GHOSTS
            nfts.push({
              ...nft,
              rank: littleGhostRanks[nft.tokenId].rank,
              rarity_score: littleGhostRanks[nft.tokenId].rarity_score,
              trait_count: littleGhostRanks[nft.tokenId].trait_count,
              buffs: getGhostBuffs(littleGhostRanks[nft.tokenId].rank),
            })
          } else if (nft.tokenAddress.toLowerCase() === ectoSkeletonsCollectionAddress) {
            // ECTO SKELETONS
            nfts.push({
              ...nft,
              rank: ectoSkeletonsMeta[nft.tokenId].rank,
              buffs: ectoSkeletonsMeta[nft.tokenId].buffs,
            })
          } else {
            // ANYTHING ELSE
            nfts.push({ ...nft })
          }
        }
        setNftData(nfts)
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('fetchData() aborted')
        } else {
          console.log(error?.response?.data)
        }
      })
  }

  return {
    fetchFullQualityImage,
    fetchNftMetadata,
    fetchScrapedTradeData,
    fetchNftMetadataById,
    fetchNftsOwnedInCollection,
    fetchOwnedCollections,
    fetchCollectionDetailsShort,
    fetchOwnedNftAssets,
  }
}

export default useCollectionApi
