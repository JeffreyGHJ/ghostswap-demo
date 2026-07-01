import { Currency, NATIVE, SOUL_ADDRESS } from '@ghostlabsweb3/sdk'
import { Feature, featureEnabled } from '../../functions/feature'
import React, { useEffect, useState } from 'react'

import { ANALYTICS_URL } from '../../constants'
import Buy from '../../features/on-ramp/ramp'
import ExternalLink from '../ExternalLink'
import Image from 'next/image'
import LanguageSwitch from '../LanguageSwitch'
import Link from 'next/link'
import More from './More'
import NavLink from '../NavLink'
import { Menu, Popover, Transition } from '@headlessui/react'
import QuestionHelper from '../QuestionHelper'
import Web3Network from '../Web3Network'
import Web3Status from '../Web3Status'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { useLingui } from '@lingui/react'
import { isMobile } from 'react-device-detect'
import AddToken from '../AddToken'
import CartButton from '../CartButton'
import ConditionalPortal from '../Portal/ConditionalPortal'
import InventoryButton from './InventoryButton'
import PoolButton from './PoolButton'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveCollections, setCollections } from '../../state/nftMarket'
import useDefinedApi from '../../hooks/useDefinedApi'
import { assembleCollectionsWithActivity, rankCollections } from './functions'
import { useWeb3React } from '@web3-react/core'
import useCollectionApi from '../../hooks/useCollectionApi'
import NetworkSwitch from './NetworkSwitch'

function AppBar(): JSX.Element {
  const { i18n } = useLingui()
  const { width } = useWindowSize()
  const dispatch = useDispatch()
  const { account, chainId } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const cartIsOpen = useSelector((state: any) => state.cart.cartIsOpen)
  const collections = useSelector((state: any) => state.nftMarket.collections)
  const [lastRank, setLastRank] = useState(null)
  const [definedApiCollections, setDefinedApiCollections] = useState(null)
  const { getNftPoolCollectionsByExchange, searchNfts } = useDefinedApi()

  const { fetchScrapedTradeData } = useCollectionApi()

  useEffect(() => {
    getNftPoolCollectionsByExchange(setDefinedApiCollections)
    // searchNfts('[56]', '0xdda875C4700384895c13aDdec3BFb574f374A359', 999)
  }, [])

  useEffect(() => {
    fetchScrapedTradeData(rankCollections, setLastRank, setCollections)
  }, [])

  useEffect(() => {
    if (collections && definedApiCollections && lastRank) {
      let collectionsWithActivity = assembleCollectionsWithActivity(collections, definedApiCollections, lastRank)
      dispatch(setActiveCollections(collectionsWithActivity))
    }
  }, [collections.length, definedApiCollections, lastRank])

  return (
    // <header className="flex flex-row justify-between w-screen flex-nowrap">
    <header className="w-full h-[3.5rem]">
      <Popover as="nav" className="z-10 w-full h-[3.5rem] bg-primary header-border-b">
        {({ open }) => (
          <>
            <div className="w-full h-full px-4">
              <div className="flex justify-between h-full">
                <div className="flex items-center h-full">
                  <Link href={'/'}>
                    <div className="flex items-center hover:cursor-pointer">
                      <Image src="/logo.png" alt="Ghost" width={32} height={32} />
                      <div className="font-bold text-[1rem] hidden xxs:block">
                        <b>GhostSwap</b>
                      </div>
                    </div>
                  </Link>

                  <div className={' sm:ml-4 ' + (cartIsOpen ? ' hidden lg5:block ' : ' hidden xl:block ')}>
                    <div className="flex space-x-2 leading-[1]">
                      {/* {chainId && ( */}
                      <NavLink href={'/nftamm'}>
                        <div
                          id={`nftamm-nav-link`}
                          className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                        >
                          {i18n._(t`NFTs`)}
                        </div>
                      </NavLink>
                      {/* )} */}
                      {/* {chainId && ( */}
                      <NavLink href={'/launchpad'}>
                        <div
                          id={`launchpad-nav-link`}
                          className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                        >
                          {i18n._(t`Launchpad`)}
                        </div>
                      </NavLink>
                      {/* )} */}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 sm:gap-2">
                  <ConditionalPortal condition={width < 1024} selector={'#mobile-header-portal'}>
                    <div className="fixed bottom-0 left-0 z-10 flex items-center justify-center w-full h-[3.5rem] px-4 lg:w-auto bg-dark-1000 lg:relative lg:p-0 lg:bg-transparent">
                      <div className={'flex items-center w-full h-full space-x-2 justify-start'}>
                        {account ? (
                          <>
                            <InventoryButton />
                            <PoolButton />
                          </>
                        ) : (
                          <></>
                        )}
                        {/* {library && library.provider.isMetaMask && <div className="hidden sm:inline-block"></div>} */}
                        {/* <div className="items-center hidden h-full md:flex sm:flex">
                        <LanguageSwitch />
                      </div> */}
                      </div>
                    </div>
                  </ConditionalPortal>

                  {/* {account && <NetworkSwitch chainId={chainId} />} */}

                  <div className="z-10 flex items-center justify-center w-full space-x-2 sm:justify-end h-[3.5rem] lg:w-auto lg:relative lg:p-0 lg:bg-transparent">
                    <div className="flex items-center w-auto h-10 overflow-hidden text-sm font-bold border-2 rounded cursor-pointer pointer-events-auto select-none border-dark-900 bg-dark-1000 hover:bg-dark-800 whitespace-nowrap">
                      {account && chainId && userEthBalance && (
                        <>
                          <div className="px-3 py-2 text-primary text-bold">{userEthBalance?.toSignificant(4)} BNB</div>
                        </>
                      )}
                      <Web3Status />
                    </div>
                  </div>

                  <ConditionalPortal condition={width < 1024} selector={'#mobile-header-portal'}>
                    <div className="fixed bottom-0 right-0 z-10 flex items-center justify-center h-[3.5rem] px-4 lg:w-auto bg-transparent lg:relative lg:p-0 lg:bg-transparent">
                      <div className="flex items-center justify-end w-full h-full space-x-2">
                        <More />
                        <CartButton inHeader={true} />
                      </div>
                    </div>
                  </ConditionalPortal>

                  <div
                    className={
                      'flex items-center h-full -mr-2 ' + (cartIsOpen ? ' block lg5:hidden ' : ' block xl:hidden ')
                    }
                  >
                    {/* Mobile language switch */}
                    {/* {isMobile && (
                    <>
                      <div className="inline-flex items-center h-full">
                        <LanguageSwitch />
                      </div>
                    </>
                  )} */}

                    {/* Mobile menu button */}

                    <Popover.Button className="inline-flex items-center justify-center h-full px-2 rounded-md text-primary hover:text-high-emphesis focus:outline-none">
                      {/* <span className="sr-only">{i18n._(t`Open main menu`)}</span> */}
                      {open ? (
                        <svg
                          className="block w-6 h-6"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        // <X title="Close" className="block w-6 h-6" aria-hidden="true" />
                        <svg
                          className="block w-6 h-6"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                        // <Burger title="Burger" className="block w-6 h-6" aria-hidden="true" />
                      )}
                    </Popover.Button>
                  </div>
                </div>
              </div>
            </div>

            <Popover.Panel className="relative z-50 bg-gray-900 xl:hidden">
              {({ close }) => (
                <div className="flex flex-col px-4 pt-2 pb-3 space-y-1">
                  {/* {chainId && ( */}
                  <NavLink href={'/nftamm'}>
                    <div
                      id={`nftamm-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                      onClick={() => close()}
                    >
                      {i18n._(t`NFTs`)}
                    </div>
                  </NavLink>
                  {/* )} */}
                  {/* {chainId && ( */}
                  <NavLink href={'/launchpad'}>
                    <div
                      id={`launchpad-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                      onClick={() => close()}
                    >
                      {i18n._(t`Launchpad`)}
                    </div>
                  </NavLink>
                  {/* )} */}
                </div>
              )}
            </Popover.Panel>
          </>
        )}
      </Popover>
    </header>
  )
}

export default AppBar
