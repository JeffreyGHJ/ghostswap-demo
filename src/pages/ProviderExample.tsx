import type { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'
import type { Network } from '@web3-react/network'
import type { WalletConnect } from '@web3-react/walletconnect'
import type { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { TrustWallet } from '@trustwallet/web3-react-trust-wallet'

import { coinbaseWallet, hooks as coinbaseWalletHooks } from '../connectors/coinbaseWallet'
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'
import { hooks as networkHooks, network } from '../connectors/network'
import { hooks as walletConnectHooks, walletConnect } from '../connectors/walletConnect'
import { hooks as walletConnectV2Hooks, walletConnectV2 } from '../connectors/walletConnectV2'
import { hooks as trustWalletHooks, trustWallet } from '../connectors/trustWallet'
import { getName } from '../constants/walletconnectupdate'
import { useEffect } from 'react'

const connectors: [MetaMask | WalletConnectV2 | CoinbaseWallet | Network | TrustWallet, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
  [trustWallet, trustWalletHooks],
]

function Child() {
  const { connector } = useWeb3React()
  useEffect(() => {
    console.log(`Priority Connector is: ${getName(connector)}`)
  }, [connector])

  return null
}

export default function ProviderExample(props) {
  return (
    <Web3ReactProvider connectors={connectors}>
      <Child />
      {props.children}
    </Web3ReactProvider>
  )
}
