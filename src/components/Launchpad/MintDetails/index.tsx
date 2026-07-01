import { useState } from 'react'
import { Globe, Twitter } from 'react-feather'
import { MouseoverArrowTooltipFlat as Tooltip } from '../../Tooltip'
import WhitelistOption from '../WhitelistOption'
import ExternalLink from '../../ExternalLink'
import { useWeb3React } from '@web3-react/core'
import useWeb3ConnectionOptions from '../../../hooks/useWeb3ConnectionOptions'
import useSwitchChain from '../../../hooks/useSwitchChain'

const expandBtn = 'text-[14px] text-[#2181e7] cursor-pointer'
const badge = 'rounded-md border px-2 py-1 text-[12px] border-[#2181e7] text-[#2181e7] whitespace-nowrap mr-2'
const totalItems = 'w-1/2 p-2 tracking-tight flex justify-between rounded-md bg-dark-900 text-[12px]'
const connectBtn =
  'px-2 py-2 m-auto text-base border-2 rounded cursor-pointer bg-dark-800 border-blue w-fit hover:border-cyan-blue'
const spinner = 'w-5 h-5 rounded-full border-[3px] border-dark-800 border-b-[#2181e7] animate-spin'

const MintDetails = ({ maxSupply, selectedOption, setSelectedOption, whitelistConfigs = null, account, now }) => {
  //   console.log(whitelistConfigs)

  const { chainId } = useWeb3React()
  const { showConnectionOptions } = useWeb3ConnectionOptions()
  const { switchChain } = useSwitchChain()

  return (
    <div id="mint-details" className="flex flex-col w-full gap-4 md:max-w-[40%]">
      <div id="info-and-links" className="flex flex-wrap items-center gap-2">
        <div id="launchpad-badge" className={badge}>
          GHOSTSWAP LAUNCHPAD
        </div>
        <LaunchpadLinks />
      </div>

      <div id="collection-title" className="text-[58px] font-bold ts-3 tracking-tighter leading-[1]">
        SoulEaters {'(MATIC)'}
      </div>

      <CollectionDescription />

      {account && chainId === 137 && (
        <>
          {maxSupply && (
            <div className={totalItems}>
              <div className="text-gray-400">TOTAL ITEMS</div>
              <div>{maxSupply.toLocaleString()}</div>
            </div>
          )}
          {whitelistConfigs === null && (
            <div className="flex items-center justify-center gap-2 px-6 py-16 text-center border-2 rounded border-cyan-blue">
              <div className="text-[20px] font-bold ts-3 text-pink">Loading Mint Data </div>
              <div className={spinner} />
            </div>
          )}

          {whitelistConfigs !== null && (
            <div id="whitelist-data" className="flex flex-col gap-4 ">
              {whitelistConfigs.map((config, index) => {
                return (
                  <WhitelistOption
                    key={config.optionName + ':' + index}
                    {...config}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    account={account}
                    now={now}
                  />
                )
              })}
            </div>
          )}
        </>
      )}
      {account && chainId !== 137 && (
        <div className="px-6 py-16 text-center border-2 rounded border-cyan-blue">
          <div className="text-[20px] font-bold ts-3 text-pink mb-4">Please Connect to Polygon Network</div>
          <div className={connectBtn} onClick={() => switchChain(137)}>
            Switch to Polygon
          </div>
        </div>
      )}
      {!account && (
        <div className="px-6 py-16 text-center border-2 rounded border-cyan-blue">
          <div className="text-[20px] font-bold ts-3 text-pink mb-4">Please Connect to a Wallet</div>
          <div className={connectBtn} onClick={() => showConnectionOptions()}>
            Connect Wallet
          </div>
        </div>
      )}
    </div>
  )
}

const iconLink = 'flex items-center justify-center w-[18px] h-[18px] cursor-pointer text-white hover:text-white'
const LaunchpadLinks = () => {
  return (
    <>
      <Tooltip placement="top" content={'Discord'}>
        <ExternalLink href={'https://discord.gg/ghostlabs'} className={iconLink}>
          <img src={'/discord-mark-white.png'} className="h-[12px]" />
        </ExternalLink>
      </Tooltip>

      <Tooltip placement="top" content={'Twitter'}>
        <ExternalLink href={'https://twitter.com/SoulEatersXyz'} className={iconLink}>
          <Twitter fill="White" height={16} />
        </ExternalLink>
      </Tooltip>

      <Tooltip placement="top" content={'Website'}>
        <ExternalLink href={'https://souleaters.xyz/'} className={iconLink}>
          <Globe width={16} />
        </ExternalLink>
      </Tooltip>
    </>
  )
}

const CollectionDescription = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div id="collection-description" className="ts-1">
      <div
        id="description"
        style={
          !expanded ? { WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', display: '-webkit-box', height: '4.5rem' } : {}
        }
        className="overflow-hidden text-pink ts-1"
      >
        SoulEaters, an engaging NFT collection, is soon to be launched on Polygon by GhostLabs, the creators of
        GhostSwap and Phantasma MMO. With over two years of experience in the crypto scene, GhostLabs is expanding their
        collection to push the boundaries of Polygon's NFTs. The collection is based on the Etherworld realm in
        Phantasma's MMO, where a horde of destructive creatures are coming through the portal to wreak havoc. Get ready
        to be a part of an immersive story as it unfolds in the Etherworld, with SoulEaters bringing a thrilling new
        dimension to the platform.
      </div>
      {!expanded && (
        <div id="expand-btn" className={expandBtn} onClick={() => setExpanded(!expanded)}>
          more
        </div>
      )}
      {expanded && (
        <div id="collapse-btn" className={expandBtn} onClick={() => setExpanded(!expanded)}>
          less
        </div>
      )}
    </div>
  )
}

export default MintDetails
