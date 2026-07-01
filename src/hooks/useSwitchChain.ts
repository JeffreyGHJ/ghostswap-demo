import { GnosisSafe } from '@web3-react/gnosis-safe'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { getAddChainParameters } from '../constants/chains'
import { useWeb3React } from '@web3-react/core'

function useSwitchChain() {
  const { chainId, connector } = useWeb3React()

  const switchChain = async (desiredChainId, setError = null) => {
    try {
      if (
        // If we're already connected to the desired chain, return
        desiredChainId === chainId ||
        // If they want to connect to the default chain and we're already connected, return
        (desiredChainId === -1 && chainId !== undefined)
      ) {
        console.log('case1:')
        if (setError) setError(undefined)
        return
      }

      if (desiredChainId === -1 || connector instanceof GnosisSafe) {
        console.log('case2:')
        await connector.activate()
      } else if (
        connector instanceof WalletConnectV2 ||
        connector instanceof WalletConnect ||
        connector instanceof Network
      ) {
        console.log('case3:')
        await connector.activate(desiredChainId)
      } else {
        console.log('case4: ', desiredChainId)
        await connector.activate(getAddChainParameters(desiredChainId))
      }

      if (setError) setError(undefined)
    } catch (error) {
      console.log(error)
      if (setError) setError(error)
    }
  }

  return {
    switchChain,
  }
}

export default useSwitchChain
