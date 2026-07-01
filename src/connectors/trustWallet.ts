import { initializeConnector } from '@web3-react/core'
import { TrustWallet } from '@trustwallet/web3-react-trust-wallet'

export const [trustWallet, hooks] = initializeConnector<TrustWallet>((actions) => new TrustWallet({ actions }))
