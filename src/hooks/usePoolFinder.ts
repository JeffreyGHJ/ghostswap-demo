import useDefinedApi from './useDefinedApi'

function usePoolFinder() {
  const { getNftPoolsByOwner } = useDefinedApi()

  const findPoolsByOwnerAddress = (ownerAddress, setData = null) => {
    let pools = getNftPoolsByOwner(ownerAddress, setData)
    console.log(pools)
  }

  // const findPoolByNftId = (nftId) => {
  //   return pools.find((pool) => pool.nftIds?.includes(+nftId))
  // }

  return { findPoolsByOwnerAddress }
}

export default usePoolFinder
