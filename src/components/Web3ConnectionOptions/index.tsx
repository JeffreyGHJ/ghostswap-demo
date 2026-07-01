import { XMarkIcon } from '@heroicons/react/24/outline'
import CoinbaseWalletCard from '../WalletConnectComponents/ConnectorCards/CoinbaseWalletCard'
import GnosisSafeCard from '../WalletConnectComponents/ConnectorCards/GnosisSafeCard'
import MetaMaskCard from '../WalletConnectComponents/ConnectorCards/MetaMaskCard'
import NetworkCard from '../WalletConnectComponents/ConnectorCards/NetworkCard'
import WalletConnectV2Card from '../WalletConnectComponents/ConnectorCards/WalletConnectV2Card'
import TrustWalletCard from '../WalletConnectComponents/ConnectorCards/TrustWalletCard'
import Portal from '../Portal'
import Typography from '../Typography'

import { GnosisSafe } from '@web3-react/gnosis-safe'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

import BnbIconSvg from '../../../public/icons/BnbIconSvg'
import MaticIcon from '../../../public/icons/MaticIconSvg'
import { useCallback, useState } from 'react'
import { getAddChainParameters } from '../../constants/chains'
import { useWeb3React } from '@web3-react/core'

const transition = 'transition-all ease-in duration-300 '
const fixedBackdrop = 'fixed top-0 h-[100vh] w-[100vw] bg-black opacity-70'
const hidden = ' pointer-events-none opacity-0 '
const visible = ' opacity-100 '
const fixedGradientBorderContainer =
  'fixed top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] p-px rounded bg-gradient-to-r from-blue to-pink cursor-default overflow-hidden '
const modalContent = 'flex flex-col gap-3 p-5 pb-10 rounded bg-dark-900'
const header = 'flex items-center justify-between w-full px-1 pb-2 text-primary '
const btn =
  'flex items-center justify-center w-10 h-10 border-2 border-gray-700 rounded bg-dark-850 hover:border-blue cursor-pointer'
const btnActive =
  'flex items-center justify-center w-10 h-10 border-2 border-cyan-blue rounded bg-blue bg-opacity-30 cursor-pointer'

const Web3ConnectionOptions = ({ isVisible, hide }) => {
  const { chainId } = useWeb3React()
  const [desiredChainId, setDesiredChainId] = useState<number>(undefined)

  return (
    <Portal selector="#app-tooltip-portal">
      <div id="transition" className={transition + (isVisible ? visible : hidden)}>
        <div className={fixedBackdrop} />
        <div className={fixedGradientBorderContainer}>
          <div className={modalContent}>
            <div className={header}>
              <Typography component="h2" variant="h3" className="font-bold text-white">
                {'Connections'}
              </Typography>
              <XMarkIcon
                width={24}
                height={24}
                onClick={() => hide()}
                className="cursor-pointer hover:text-high-emphesis"
              />
            </div>

            <div id="network-select" className="flex gap-3">
              <div className={chainId === 56 ? btnActive : btn} onClick={() => setDesiredChainId(56)}>
                <BnbIconSvg />
              </div>
              <div className={chainId === 137 ? btnActive : btn} onClick={() => setDesiredChainId(137)}>
                <MaticIcon width={24} height={24} />
              </div>
            </div>

            <MetaMaskCard desiredChainId={desiredChainId} setDesiredChainId={setDesiredChainId} />
            <WalletConnectV2Card desiredChainId={desiredChainId} setDesiredChainId={setDesiredChainId} />
            <TrustWalletCard desiredChainId={desiredChainId} setDesiredChainId={setDesiredChainId} />
            <CoinbaseWalletCard desiredChainId={desiredChainId} setDesiredChainId={setDesiredChainId} />
            {/* <NetworkCard desiredChainId={desiredChainId} setDesiredChainId={setDesiredChainId} />
            <GnosisSafeCard desiredChainId={desiredChainId} setDesiredChainId={setDesiredChainId} /> */}
          </div>
        </div>
      </div>
    </Portal>
  )
}

export default Web3ConnectionOptions
