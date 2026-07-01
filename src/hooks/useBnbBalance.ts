import { CurrencyAmount, JSBI, NATIVE } from '@ghostlabsweb3/sdk'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setBnbBalance } from '../state/walletAssets'
import useActiveWeb3React from './useActiveWeb3React'

function useBnbBalance(useRedux = false) {
  const dispatch = useDispatch()
  const { account, chainId, library } = useActiveWeb3React()
  const [balance, setBalance] = useState(undefined)

  const updateBalance = (value) => {
    setBalance(value)
    if (useRedux === true) dispatch(setBnbBalance(value))
  }

  useEffect(() => {
    if (account && library && chainId === 56) {
      library.getBalance(account).then((rawBalance) => {
        let balance = CurrencyAmount.fromRawAmount(NATIVE[chainId], JSBI.BigInt(rawBalance.toString())).toSignificant(3)
        updateBalance(balance)
      })
    } else {
      updateBalance(undefined)
    }
  }, [account, library, chainId])

  return balance
}

export default useBnbBalance
