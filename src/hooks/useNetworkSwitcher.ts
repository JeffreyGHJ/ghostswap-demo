function useNetworkSwitcher() {
  const switchToSmartChain = async (chainId) => {
    // `library` context here is invalid, we use the direct communiaction with Metamask via window.ethereum
    const ethereum = window.ethereum as any
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(chainId).toString(16)}` }],
      })
    } catch (switchError: any) {
      console.log(switchError)
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [`0x${Number(chainId).toString(16)}`],
          })
        } catch (addError) {
          console.log(addError)
          // handle adding network error
          throw addError
        }
      } else {
        // handle other "switch" errors
        throw switchError
      }
    }
  }

  return { switchToSmartChain }
}

export default useNetworkSwitcher
