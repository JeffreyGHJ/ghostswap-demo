import { Contract } from '@ethersproject/contracts'
import SE_ABI from '../../constants/abis/soul-eaters-contract.json'
import LG_ABI_POLYGON from '../../constants/abis/little-ghosts-polygon-contract.json'
import { getSigner } from '../../functions'
import SoulEatersMintConfigs from './SoulEatersMintConfigs'
const littleGhostsPolygon = '0x5337B9E543cB80fFafeB08bf3D564fa11e28202B'
const littleGhostsBinance = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48'
const soulEatersContractAddress = '0x9B8E46BEC8AE1839d1f5F7E959756c53A8d27E0D'

// see if LG is approved for SE
export const checkApproval = async (account, provider, setIsApproved) => {
  let result = null
  const callContract = async () => {
    console.log(account)
    try {
      // const contract = new Contract(soulEatersContractAddress, SE_ABI, signer)
      console.log('checking approval of SE on LG...')
      const contract = new Contract(littleGhostsPolygon, LG_ABI_POLYGON, provider)
      result = await contract.isApprovedForAll(account, soulEatersContractAddress).then((res) => {
        setIsApproved(res)
      })
      return result
    } catch (error) {
      if (error?.code === 'NETWORK_ERROR') {
        console.log('Error: must be connected to Polygon network')
        return
      }
      console.log(error)
      setTimeout(() => {
        console.log('retrying...')
        callContract()
      }, 3000)
    }
  }
  await callContract()
  return result
}

export const approveSoulEaters = async (account, provider, setIsApproved, setApprovalPending, setApprovalRejected) => {
  const callContract = async () => {
    try {
      const signer = getSigner(provider, account)
      const contract = new Contract(littleGhostsPolygon, LG_ABI_POLYGON, signer)
      const transactionResponse = await contract.setApprovalForAll(soulEatersContractAddress, true)
      const receipt = await transactionResponse.wait()
      if (receipt && receipt.blockNumber) {
        console.log('setting approval true!')
        checkApproval(account, provider, setIsApproved)
        return true
      }
      console.log('setting approval false...')
      setApprovalPending(false)
      return false
    } catch (error) {
      console.log(error)
      if (error?.code && error.code === 'ACTION_REJECTED') {
        setApprovalRejected(true)
        return
      }
      if (error?.code === 'NETWORK_ERROR') {
        console.log('Error: must be connected to Polygon network')
        return
      }
      if (error?.toString() && error.toString().toLowerCase().includes('user rejected the request')) {
        setApprovalRejected(true)
      }
      //   setTimeout(() => {
      //     console.log('retrying...')
      //     callContract()
      //   }, 3000)
    }
  }
  await callContract()
}

export const checkAndApproveSoulEaters = async (
  account,
  provider,
  setIsApproved,
  setApprovalPending,
  setApprovalRejected
) => {
  console.log('x: ', account)
  setApprovalRejected(false)
  setApprovalPending(true)
  const isApproved = await checkApproval(account, provider, setIsApproved)
  if (!isApproved) {
    console.log('SE was not approved yet.')
    await approveSoulEaters(account, provider, setIsApproved, setApprovalPending, setApprovalRejected)
  }
  setApprovalPending(false)
}

export const getTotalSupply = async (provider, setTotalSupply) => {
  const callContract = async () => {
    try {
      const contract = new Contract(soulEatersContractAddress, SE_ABI, provider)
      const result = await contract.totalSupply()
      setTotalSupply(+result)
    } catch (error) {
      if (error?.code === 'NETWORK_ERROR') {
        console.log('Error: must be connected to Polygon network')
        return
      }
      console.log(error)
      setTimeout(() => {
        console.log('retrying...')
        callContract()
      }, 3000)
    }
  }
  callContract()
}

export const getBurnedMints = async (provider, setBurnedMints) => {
  const callContract = async () => {
    try {
      const contract = new Contract(soulEatersContractAddress, SE_ABI, provider)
      const result = await contract.burnedMints()
      setBurnedMints(+result)
    } catch (error) {
      if (error?.code === 'NETWORK_ERROR') {
        console.log('Error: must be connected to Polygon network')
        return
      }
      console.log(error)
      setTimeout(() => {
        console.log('retrying...')
        callContract()
      }, 3000)
    }
  }
  callContract()

  // DEBUG VALUE
  // setBurnedMints(500)
}

export const getBurnMintsPerAddress = async (account, provider, setBurnMintsPerAddress) => {
  const callContract = async () => {
    try {
      const contract = new Contract(soulEatersContractAddress, SE_ABI, provider)
      const result = await contract.burnMintsPerAddress(account)
      setBurnMintsPerAddress(+result)
    } catch (error) {
      if (error?.code === 'NETWORK_ERROR') {
        console.log('Error: must be connected to Polygon network')
        return
      }
      console.log(error)
      setTimeout(() => {
        console.log('retrying...')
        callContract()
      }, 3000)
    }
  }
  callContract()

  // DEBUG VALUE
  // setBurnMintsPerAddress(3)
}

export const executeMintWithBurn = async (account, provider, selectedGhosts, setModalOpen) => {
  const callContract = async () => {
    try {
      let ids = []
      for (let ghost of selectedGhosts) ids.push(ghost.tokenId)
      console.log('executingMintWithBurn using Ids: ', ids)
      const signer = getSigner(provider, account)
      const contract = new Contract(soulEatersContractAddress, SE_ABI, signer)
      await contract.mintWithBurn(ids).then((r) => {
        setModalOpen(false)
        console.log(r)
      })
    } catch (error) {
      if (error?.code === 'NETWORK_ERROR') {
        console.log('Error: must be connected to Polygon network')
        return
      }
      console.log(error)
      setTimeout(() => {
        console.log('retrying...')
        callContract()
      }, 3000)
    }
  }
  await callContract()
}

export const getMintConfigVariables = async (
  setMintConfigs,
  account,
  littleGhostsOwned,
  burnedMints,
  burnMintsPerAddress
) => {
  const presaleStartTime = new Date('6/29/23')
  const presaleEndTime = new Date(1688263250)
  const presaleMaxMints = 1000
  const presaleMints = 217
  const presaleMintPrice = 40000000000000000000
  //   const burnStartTime = new Date(Date.now() + 1000 * 5)
  const burnStartTime = new Date('Thu Jul 27 2023 12:00:00 GMT-0700')
  const burnEndTime = new Date('Thu Aug 3 2023 12:00:00 GMT-0700')
  const burnMaxMints = 500
  const burnMaxMintsPerWallet = 10
  setMintConfigs(
    SoulEatersMintConfigs(
      littleGhostsOwned,
      account,
      presaleStartTime,
      new Date(+presaleEndTime * 1000),
      +presaleMaxMints,
      +presaleMints,
      presaleMintPrice,
      burnStartTime,
      burnEndTime,
      +burnMaxMints,
      +burnMaxMintsPerWallet,
      +burnedMints,
      +burnMintsPerAddress
    )
  )
}

// hack: replace the token address of bridged polygon ghosts with the bnb address for image fetching
export const fetchPolygonGhostsAndSetAddress = async (account, fetchNftsOwnedInCollection, setLittleGhostsOwned) => {
  fetchNftsOwnedInCollection(account, littleGhostsPolygon, null, 137).then((ghosts) => {
    for (let ghost of ghosts) ghost.tokenAddress = littleGhostsBinance
    setLittleGhostsOwned(ghosts)
  })
}

export const getTimeRemaining = (startDate, endDate) => {
  let now = Date.now()
  let timeRemaining = startDate > now ? startDate - now : endDate - now
  let m = timeRemaining / (1000 * 60)
  let h = timeRemaining / (1000 * 60 * 60)
  let d = timeRemaining / (1000 * 60 * 60 * 24)

  let days = ~~d
  let hours = ~~((d - ~~d) * 24)
  let minutes = ~~((h - ~~h) * 60)
  let seconds = ~~((m - ~~m) * 60)

  return { days, hours, minutes, seconds }
}
