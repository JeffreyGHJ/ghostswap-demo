import { useCallback, useEffect, useState } from 'react'

import { useActiveWeb3React } from './useActiveWeb3React'
import { usePancakeProfileContract } from './useContract'

const usePancakeProfile = () => {
  const { account, chainId } = useActiveWeb3React()
  const pancakeProfileContract = usePancakeProfileContract()
  const [registered, setRegistered] = useState(false)

  const fetchHasRegistered = useCallback(async () => {
    if (account) {
      try {
        const registered: boolean = await pancakeProfileContract?.hasRegistered(account)
        setRegistered(registered)
      } catch (error) {
        setRegistered(false)
        throw error
      }
    } else {
      setRegistered(false)
    }
  }, [account, pancakeProfileContract])

  useEffect(() => {
    fetchHasRegistered()
  }, [account])

  return { registered }
}

export default usePancakeProfile
