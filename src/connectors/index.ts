import { BscConnector } from '@binance-chain/bsc-connector'
import { ChainId } from '@ghostlabsweb3/sdk'
import { FortmaticConnector } from '../entities/FortmaticConnector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { TrustWallet } from '@trustwallet/web3-react-trust-wallet'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { Web3Provider } from '@ethersproject/providers'
import RPC from '../config/rpc'



let networkLibrary: Web3Provider | undefined



const supportedChainIds = ['BSC', 'BSC_TEST', 56, 97, 1, 137] as number[]

export const injected = new InjectedConnector({
  supportedChainIds,
})



// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: process.env.NEXT_PUBLIC_FORTMATIC_API_KEY ?? '',
  chainId: ChainId.BSC,
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: process.env.NEXT_PUBLIC_PORTIS_ID ?? '',
  networks: [ChainId.BSC],
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: RPC[ChainId.BSC],
  appName: 'GhostSwap',
  appLogoUrl: 'https://www.ghostswap.finance/_next/image?url=%2Flogo.png&w=64&q=75',
})

// mainnet only
export const torus = new TorusConnector({
  chainId: ChainId.BSC,
})

// binance only
export const binance = new BscConnector({ supportedChainIds: [56] })
