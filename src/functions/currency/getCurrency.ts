import { AddressZero } from '@ethersproject/constants'
import { ChainId, BUSD_ADDRESS } from '@ghostlabsweb3/sdk'

type Currency = { address: string; decimals: number }

// Pricing currency
// TODO: Check decimals and finish table
export const USD_CURRENCY: { [chainId in ChainId]?: Currency } = {
  [ChainId.BSC]: {
    address: BUSD_ADDRESS[ChainId.BSC],
    decimals: 18,
  },
  [ChainId.BSC_TEST]: {
    address: BUSD_ADDRESS[ChainId.BSC_TEST],
    decimals: 18,
  },
}

export function getCurrency(chainId: ChainId): Currency {
  return (
    USD_CURRENCY[chainId] || {
      address: AddressZero,
      decimals: 18,
    }
  )
}
