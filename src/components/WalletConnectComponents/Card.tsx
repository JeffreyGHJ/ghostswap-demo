import { useWeb3React, type Web3ReactHooks } from '@web3-react/core'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import type { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import type { TrustWallet } from '@trustwallet/web3-react-trust-wallet'
import { getAddChainParameters } from '../../constants/chains'
import { getName } from '../../constants/walletconnectupdate'
import { Status } from './Status'
import { useCallback, useEffect, useState } from 'react'

const card = ' relative justify-center cursor-pointer bg-dark-800 hover:bg-dark-700 '

interface Props {
  connector: MetaMask | WalletConnect | WalletConnectV2 | CoinbaseWallet | Network | GnosisSafe | TrustWallet
  activeChainId: ReturnType<Web3ReactHooks['useChainId']>
  chainIds?: ReturnType<Web3ReactHooks['useChainId']>[]
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
  isActive: ReturnType<Web3ReactHooks['useIsActive']>
  error: Error | undefined
  setError: (error: Error | undefined) => void
  ENSNames: ReturnType<Web3ReactHooks['useENSNames']>
  provider?: ReturnType<Web3ReactHooks['useProvider']>
  accounts?: string[]
  iconSrc?: string
  name?: string
  desiredChainId: any
  setDesiredChainId: any
  //   switchChain: any
}

export function Card({
  connector,
  activeChainId,
  chainIds,
  isActivating,
  isActive,
  error,
  setError,
  ENSNames,
  accounts,
  provider,
  iconSrc,
  name,
  desiredChainId,
  setDesiredChainId,
}: //   switchChain,
Props) {
  //   const [desiredChainId, setDesiredChainId] = useState<number>(-1)
  const { connector: priorityConnector } = useWeb3React()

  //   useEffect(() => {
  //     console.log(name + ': activeChainId = ' + activeChainId)
  //   }, [activeChainId])

  //   useEffect(() => {
  //     console.log(name + ': isActive = ' + isActive)
  //   }, [isActive])

  //   useEffect(() => {
  //     console.log('desiredChainId: ' + desiredChainId)
  //   }, [desiredChainId])

  //   useEffect(() => {
  //     console.log('error: ' + error)
  //   }, [error])

  /**
   * When user connects eagerly (`desiredChainId` is undefined) or to the default chain (`desiredChainId` is -1),
   * update the `desiredChainId` value so that <select /> has the right selection.
   */
  useEffect(() => {
    console.log('desiredChainId: ', desiredChainId, 'activeChainId: ', activeChainId, ' - ', name)

    // if (activeChainId && desiredChainId === undefined /*|| desiredChainId === -1*/) {
    //   console.log('desiredChain undefined - setting to active chain: ', activeChainId)
    //   setDesiredChainId(activeChainId)
    // }
    // if (!!desiredChainId && desiredChainId !== -1 && activeChainId !== desiredChainId) {
    //   if (connector === priorityConnector) {
    //     switchChain(desiredChainId)
    //   }
    // }
  }, [desiredChainId, activeChainId])

  useEffect(() => {
    if (connector !== priorityConnector) return
    else console.log('activeChainId changed: ', activeChainId)

    if (activeChainId && desiredChainId !== activeChainId) {
      console.log('updating desiredChainId to: ', activeChainId)
      setDesiredChainId(activeChainId)
    }
  }, [activeChainId, connector, priorityConnector])

  useEffect(() => {
    if (connector !== priorityConnector) return
    else console.log('desiredChainId changed: ', desiredChainId)

    if (desiredChainId && desiredChainId !== -1 && activeChainId !== desiredChainId) {
      console.log(`calling switchChain(${desiredChainId})`)
      switchChain(desiredChainId)
    }
  }, [desiredChainId, connector, priorityConnector])

  const switchChain = useCallback(
    async (desiredChainId: number) => {
      //   setDesiredChainId(desiredChainId)
      //   setDesiredChainId(-1)

      try {
        if (
          // If we're already connected to the desired chain, return
          desiredChainId === activeChainId ||
          // If they want to connect to the default chain and we're already connected, return
          (desiredChainId === -1 && activeChainId !== undefined)
        ) {
          console.log('a')
          setError(undefined)
          return
        }

        if (desiredChainId === -1 || connector instanceof GnosisSafe) {
          console.log('b')
          await connector.activate()
        } else if (
          connector instanceof WalletConnectV2 ||
          connector instanceof WalletConnect ||
          connector instanceof Network
        ) {
          console.log('c')
          await connector.activate(desiredChainId)
        } else {
          console.log('d: ', desiredChainId)
          await connector.activate(getAddChainParameters(desiredChainId))
        }

        setError(undefined)
      } catch (error) {
        setError(error)
      }
    },
    [connector, activeChainId, setError]
  )

  const toggleConnection = useCallback(
    async (desiredChainId) => {
      console.log('desiredChainId: ', desiredChainId)
      if (desiredChainId === undefined) desiredChainId = 56
      console.log(connector)
      try {
        if (isActive) {
          if (connector?.deactivate) {
            void connector.deactivate()
          } else {
            connector.resetState()
          }
          setDesiredChainId(-1)
          return
        }

        if (desiredChainId === -1 || connector instanceof GnosisSafe || connector instanceof WalletConnectV2) {
          await connector.activate()
        } else if (
          // connector instanceof WalletConnectV2 ||
          connector instanceof WalletConnect ||
          connector instanceof Network
        ) {
          await connector.activate(desiredChainId)
        } else {
          await connector.activate(getAddChainParameters(desiredChainId))
        }

        setError(undefined)
      } catch (error) {
        setError(error)
      }
    },
    [connector, activeChainId, setError, isActive, desiredChainId]
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '20rem',
        height: '3.5rem',
        // padding: '.5rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        overflow: 'auto',
        borderRadius: '.5rem',
      }}
      className={card + (getName(priorityConnector) === name ? ' border border-cyan-blue ' : ' ')}
      onClick={() => toggleConnection(desiredChainId)}
    >
      <div className="absolute top-1 right-2">
        <Status isActivating={isActivating} isActive={isActive} error={error} />
      </div>
      <div className="flex items-center h-full gap-4">
        {iconSrc && <img src={iconSrc} alt={'wallet-icon'} className="w-9 h-9" />}
        <div className="flex items-center justify-between w-full text-[16px]">{name}</div>
      </div>

      {/* <div style={{ marginBottom: '1rem' }}>
        <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
      </div> */}

      {/* <Chain chainId={activeChainId} /> */}
    </div>
  )
}
