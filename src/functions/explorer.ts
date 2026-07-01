import { ChainId } from '@ghostlabsweb3/sdk'

const enum ChainIdExt {
  ETH = 1,
  MATIC = 137,
}

// Multichain Explorer
const builders = {
  //TODO: Might wanna remove this
  smartscan: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://smartscan.cash`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  sonar: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://bscscan.com`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  sonaramber: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://testnet.bscscan.com`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  etherscan: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://etherscan.io/`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  polygonscan: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://polygonscan.com/`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
}

interface ChainObject {
  [chainId: number]: {
    chainName: string
    builder: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => string
  }
}

const chains: ChainObject = {
  [ChainId.BSC]: {
    chainName: '',
    builder: builders.sonar,
  },
  [ChainId.BSC_TEST]: {
    chainName: 'amber', //TODO: Change this
    builder: builders.sonaramber,
  },
}

const chainsExt: ChainObject = {
  [ChainIdExt.ETH]: {
    chainName: 'ethereum',
    builder: builders.etherscan,
  },
  [ChainIdExt.MATIC]: {
    chainName: 'polygon',
    builder: builders.polygonscan,
  },
}

export function getExplorerLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  let chain = chains[chainId]
  if (chain !== undefined) return chain.builder(chain.chainName, data, type)
  chain = chainsExt[chainId]
  if (chain === undefined) return null
  return chain.builder(chain.chainName, data, type)
}
