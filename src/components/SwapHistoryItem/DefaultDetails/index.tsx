import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Web3 from 'web3'
import Badge from '../../Badge'
import { getTimeSince } from '../functions'
import ExternalLinkSvg from '../../../../public/icons/ExternalLinkSvg'
import nftIcon from '../../../../public/nft.png'
import { Minus, Plus } from 'react-feather'
import ExternalLink from '../../ExternalLink'

const description =
  'flex items-center whitespace-nowrap gap-1 md:gap-3 text-[14px] md:text-[16px] font-bold  ts-2 md:ts-4'
const linkStyle =
  'flex items-center justify-between text-[.5rem] w-[3.7rem] sm:text-xs text-indigo-300 hover:text-indigo-400 border-b hover:border-b-indigo-400 border-indigo-300 sm:w-24 '
const badge = 'flex items-center justify-center w-10 sm:w-32'

const DefaultDetails = ({ item, width, setExpanded, expanded, setExpandAll }) => {
  return (
    <div id="default-details" className="flex w-full justify-between h-[3rem] gap-2 sm:gap-3">
      <div id="description" className={description}>
        {(item.eventType === 'SWAP_NFT_OUT_POOL' || item.eventType === 'SWAP_NFT_IN_POOL') && (
          <>
            <div id="pool-output" className="flex items-center whitespace-nowrap">
              {item.eventType === 'SWAP_NFT_OUT_POOL' && (
                <>
                  {item.data.nftsTransfered.length} <img src={nftIcon.src} height={17} width={17} className="ml-1" />
                </>
              )}
              {item.eventType === 'SWAP_NFT_IN_POOL' && (
                <>
                  {parseFloat((+Web3.utils.fromWei(String(item.data.amountT))).toFixed(width > 370 ? 6 : 4))}{' '}
                  <img src={'/images/tokens/bnb-icon.png'} className="w-4 h-4 ml-1" />
                </>
              )}
            </div>
            <ArrowRightIcon className="w-[12px] h-[12px] sm:w-[18px] sm:h-[18px]" />
            <div id="pool-input" className="flex items-center whitespace-nowrap">
              {item.eventType === 'SWAP_NFT_OUT_POOL' && (
                <>
                  {parseFloat((+Web3.utils.fromWei(String(item.data.amountT))).toFixed(width > 370 ? 6 : 4))}{' '}
                  <img src={'/images/tokens/bnb-icon.png'} className="w-4 h-4 ml-1" />
                </>
              )}
              {item.eventType === 'SWAP_NFT_IN_POOL' && (
                <>
                  {item.data.nftsTransfered.length} <img src={nftIcon.src} height={17} width={17} className="ml-1" />
                </>
              )}
            </div>
          </>
        )}
        {item.eventType === 'NEW_POOL' && <>{'Pool Created'}</>}
        {item.eventType === 'NFT_DEPOSIT' && <>{'NFT Deposit'}</>}
        {item.eventType === 'NFT_WITHDRAWAL' && <>{'NFT Withdraw'}</>}
        {item.eventType === 'TOKEN_DEPOSIT' && <>{'Token Deposit'}</>}
        {item.eventType === 'TOKEN_WITHDRAWAL' && <>{'Token Withdraw'}</>}
        {item.eventType === 'SPOT_PRICE_UPDATE' && <>{'Price Update'}</>}
        {item.eventType === 'DELTA_UPDATE' && <>{'Delta Update'}</>}
        {item.eventType === 'FEE_UPDATE' && <>{'Fee Update'}</>}
      </div>
      <div id="group-right" className="flex items-center justify-end gap-2 md:gap-4">
        <div id="item-badge" className="tracking-tight ts-1">
          {item.eventType === 'SWAP_NFT_IN_POOL' && (
            <Badge color="red" size={width < 640 ? 'small' : 'default'} className={badge}>
              {width < 640 ? 'SELL' : 'SELL TO POOL'}
            </Badge>
          )}
          {item.eventType === 'SWAP_NFT_OUT_POOL' && (
            <Badge color="green" size={width < 640 ? 'small' : 'default'} className={badge}>
              {width < 640 ? 'BUY' : 'BUY FROM POOL'}
            </Badge>
          )}
        </div>
        <div id="item-controls" className="flex flex-row items-center">
          <ExternalLink href={'https://bscscan.com/tx/' + item.transactionHash} className={linkStyle}>
            {item.timestamp ? getTimeSince(item.timestamp) : '? days ago'}
            <ExternalLinkSvg width="10" height="10" />
          </ExternalLink>
          <div
            id="expand-item-btn"
            className="flex items-center justify-center w-8 h-8 ml-1 text-sm cursor-pointer "
            onClick={() => {
              setExpanded(!expanded)
              if (setExpandAll) setExpandAll(null)
            }}
          >
            {!expanded && <Plus size={16} />}
            {expanded && <Minus size={16} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefaultDetails
