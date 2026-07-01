import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Web3Connect from '../Web3Connect'
import { shortenAddress } from '../../functions/format'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import WalletModalV2 from '../../modals/WalletModalV2'
import Web3ConnectionOptions from '../Web3ConnectionOptions'
import BnbIconSvg from '../../../public/icons/BnbIconSvg'
import MaticIcon from '../../../public/icons/MaticIconSvg'
import { useDispatch, useSelector } from 'react-redux'
import { showConnections, hideConnections } from '../../state/web3Connections'

const SUPPORTED_CHAINS = ['56', '137']

const avatarSrc = '/ghosts.png'

const BAD_AVATAR_SRCS: { [tokenAddress: string]: true } = {}

// toggleModal was for before walletConnectV2 (leaving it here in case we need to revert)
// setModalOopen is for current implementation of walletConnectV2
function Web3StatusInner({ name, toggleModal, setModalOpen }) {
  //   const { i18n } = useLingui()
  const { account, chainId } = useWeb3React()
  const [, avatarRefresh] = useState<number>(0)

  if (account && chainId !== undefined && SUPPORTED_CHAINS.includes(chainId.toString())) {
    return (
      <div
        id="web3-status-connected"
        className="flex items-center h-full px-1 py-2 text-sm rounded-lg xxs:px-2 xs:px-3 bg-dark-1000 text-secondary"
        onClick={toggleModal}
      >
        <div className="flex items-center h-full gap-2">
          <div className="overflow-ellipsis overflow-hidden max-w-[200px]">{name || shortenAddress(account)}</div>
          <div>
            {chainId !== 56 && chainId !== 137 && (
              <Image
                src={avatarSrc}
                onError={() => {
                  if (avatarSrc) BAD_AVATAR_SRCS[avatarSrc] = true
                  avatarRefresh((i) => i + 1)
                }}
                alt="Ghost"
                width={20}
                height={20}
              />
            )}
            {chainId === 56 && <BnbIconSvg width={16} height={16} />}
            {chainId === 137 && <MaticIcon width={16} height={16} />}
          </div>
        </div>
      </div>
    )
  } else {
    return <Web3Connect setModalOpen={setModalOpen} />
  }
}

export default function Web3Status() {
  const { isActive, account, chainId } = useWeb3React()
  const dispatch = useDispatch()
  const contextNetwork = useWeb3React()
  const [name, setName] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const connectionsVisible = useSelector((state: any) => state.web3Connections.connectionsVisible)

  const { connector, provider } = useWeb3React()

  useEffect(() => {
    console.log('connector: ', connector, '\nchainId: ', chainId, '\nisActive: ', isActive, '\nprovider: ', provider)
  }, [connector, chainId, isActive, provider])

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const getName = async (address) => {
    if (chainId === 56) {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/spaceid/${address}`)
        setName(response.data.name)
      } catch (error) {
        console.error(error)
      }
    } else {
      setName('')
    }
  }

  const showConnectionOptions = () => {
    dispatch(showConnections())
    setModalOpen(false)
  }

  const hideConnectionOptions = () => {
    dispatch(hideConnections())
  }

  useEffect(() => {
    getName(account)
  }, [account, chainId])

  //   if (!contextNetwork.isActive && !isActive) {
  //     return <div className="flex items-center justify-center w-12 h-12 px-1 bg-red">ERROR</div>
  //   }

  return (
    <>
      <Web3StatusInner name={name} toggleModal={toggleModal} setModalOpen={setModalOpen} />
      <WalletModalV2
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        ENSName={name ?? undefined}
        account={account}
        chainId={chainId}
        showConnectionOptions={showConnectionOptions}
      />
      <Web3ConnectionOptions isVisible={connectionsVisible} hide={hideConnectionOptions} />
    </>
  )
}
