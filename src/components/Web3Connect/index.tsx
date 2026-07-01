import Button, { ButtonProps } from '../Button'
import * as deviceInfo from 'react-device-detect'
import { useWeb3React } from '@web3-react/core'

import { Activity } from 'react-feather'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useWalletModalToggle } from '../../state/application/hooks'

import { getName } from '../../constants/walletconnectupdate'
import { Network } from 'mainnet-js'

const btn =
  'h-full flex items-center px-2 bg-dark-700 bg-opacity-20 text-gray hover:bg-opacity-40 disabled:bg-opacity-20 rounded-none'

const SUPPORTED_WALLETS = ['WalletConnect', 'Coinbase Wallet', 'Gnosis Safe', 'TrustWallet', 'MetaMask']
const SUPPORTED_CHAINS = ['56', '137']

export default function Web3Connect({ color = 'gray', size = 'sm', className = '', setModalOpen, ...rest }) {
  const { i18n } = useLingui()
  const toggleWalletModal = useWalletModalToggle()
  const [connectorName, setConnectorName] = useState('')
  const { chainId, connector, account } = useWeb3React()

  useEffect(() => {
    setConnectorName(getName(connector))
  }, [connector])


  const handleConnectBtnClick = useCallback(() => {
    toggleWalletModal()
  }, [ toggleWalletModal])

  const pluginSupportInfo = useMemo(() => {
    if (!deviceInfo.isDesktop) {
      return null
    }
    if (deviceInfo.isFirefox) {
      return { url: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/' }
    }
    if (deviceInfo.isChrome) {
      return { url: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn' }
    }
    if (deviceInfo.isEdge) {
      return { url: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm' }
    }
    return null
  }, [])

  return (
    <>
      {(!SUPPORTED_WALLETS.includes(connectorName) || account === undefined) && (
        <>
          <Button
            id="connect-wallet"
            onClick={() => setModalOpen(true)}
            variant="outlined"
            color={'gray'}
            className={className || btn}
            size={'none'}
            {...rest}
          >
            {i18n._(t`Connect Wallet`)}
          </Button>
        </>
      )}
      {chainId !== undefined &&
        SUPPORTED_WALLETS.includes(connectorName) &&
        !SUPPORTED_CHAINS.includes(chainId.toString()) && (
          <div
            className="flex items-center justify-center h-full px-4 py-2 font-semibold text-white border rounded bg-opacity-80 border-red bg-red hover:bg-opacity-100"
            onClick={() => setModalOpen(true)}
          >
            <div className="mr-1">
              <Activity className="w-4 h-4" />
            </div>
            {/* {error instanceof UnsupportedChainIdError ? i18n._(t`You are on the wrong network`) : i18n._(t`Error`)} */}
            {`You are on the wrong network`}
          </div>
        )}
    </>
  )

  //   return chainId !== 56 && chainId !== undefined ? (
  //     <div
  //       className="flex items-center justify-center h-full px-4 py-2 font-semibold text-white border rounded bg-opacity-80 border-red bg-red hover:bg-opacity-100"
  //       //   onClick={toggleWalletModal}
  //       onClick={() => setModalOpen(true)}
  //     >
  //       <div className="mr-1">
  //         <Activity className="w-4 h-4" />
  //       </div>
  //       {/* {error instanceof UnsupportedChainIdError ? i18n._(t`You are on the wrong network`) : i18n._(t`Error`)} */}
  //       {`You are on the wrong network`}
  //     </div>
  //   ) : (
  //     <>
  //       <Button
  //         id="connect-wallet"
  //         onClick={() => setModalOpen(true)}
  //         variant="outlined"
  //         color={'gray'}
  //         className={
  //           className ||
  //           'h-full flex items-center px-2 bg-dark-700 bg-opacity-20 text-gray hover:bg-opacity-40 disabled:bg-opacity-20 rounded-none'
  //         }
  //         size={'none'}
  //         {...rest}
  //       >
  //         {/* {i18n._(t`Connect Wallet`)} */}
  //         {`Connect Wallet`}
  //       </Button>
  //       <InstructionModal
  //         isOpen={isInstructionModalOpen}
  //         onDismiss={onInstructionModalDismiss}
  //         instruction={
  //           <div>
  //             {pluginSupportInfo ? (
  //               <>
  //                 <p>
  //                   {/* {i18n._(t`Your browser is supported, but first you need to install`)} */}
  //                   {`Your browser is supported, but first you need to install`}
  //                   <a className="text-blue" href={pluginSupportInfo.url}>
  //                     {' '}
  //                     {/* {i18n._(t`MetaMask extension`)} */}
  //                     {`MetaMask extension`}
  //                   </a>
  //                 </p>
  //               </>
  //             ) : (
  //               <>
  //                 {/* {i18n._(t`Your browser is not supported, please install`)} */}
  //                 {`Your browser is not supported, please install`}
  //                 <a className="text-blue" href="https://metamask.io/">
  //                   {' '}
  //                   {/* {i18n._(t`MetaMask`)} */}
  //                   {`MetaMask`}
  //                 </a>
  //               </>
  //             )}
  //           </div>
  //         }
  //       />
  //     </>
  //   )
}
