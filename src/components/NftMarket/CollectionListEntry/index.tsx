import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import router from 'next/router'
import { formatNumber } from '../functions'
import Web3 from 'web3'

const bnbIcon = <img id="bnb-icon" className="flex items-center w-4 h-4 mr-2" src={'/images/tokens/bnb-icon.png'} />

const CollectionListEntry = (props) => {
  return (
    <tr
      id="collection-info"
      className="w-full font-bold text-right cursor-pointer hover:bg-dark-850"
      onClick={async (e) => {
        e.preventDefault()
        await router.push(router.pathname + `/collection/${props.address}`)
      }}
    >
      {/* <Link
        href={{
          pathname: router.pathname + `/collection/[address]`,
          query: {
            address: props.address,
          },
        }}
      > */}
      <td id="collection-name" className="py-1 pl-2 text-left sm:pl-6 ">
        <div className="flex items-center justify-start">
          <div id="collection-index" className="text-[14px] text-center font-normal w-7">
            <div className="flex items-center justify-center w-full h-full">
              {props.showAggregateVolume && (
                <>
                  {props.rank === 1 && <div className="text-[24px]">&#129351;</div>}
                  {props.rank === 2 && <div className="text-[22px]">&#129352;</div>}
                  {props.rank === 3 && <div className="text-[20px]">&#129353;</div>}
                </>
              )}
              {!props.showAggregateVolume && (
                <>
                  {props.rank_def === 1 && <div className="text-[24px]">&#129351;</div>}
                  {props.rank_def === 2 && <div className="text-[22px]">&#129352;</div>}
                  {props.rank_def === 3 && <div className="text-[20px]">&#129353;</div>}
                </>
              )}
            </div>
            {props.showAggregateVolume && props.rank > 3 && <>{props.rank}</>}
            {!props.showAggregateVolume && props.rank_def > 3 && <>{props.rank_def}</>}
          </div>
          <div className="flex items-center justify-start py-[14px] pl-2">
            <div id="collection-logo" className="w-9 h-9">
              <img
                src={!props.avatar || props.avatar == 'null' ? './question.png' : props.avatar}
                className="rounded-full"
              ></img>
            </div>
            <div id="name" style={{ letterSpacing: '-.02em' }} className="ml-2">
              {props.name || 'Name'}
            </div>
            {props.verified && (
              <div id="verification-badge" className="flex items-center justify-center w-5 h-5 ml-1">
                <div className="w-3 h-3 p-1 bg-white rounded-full"></div>
                <CheckBadgeIcon width={18} height={18} color={'#2b8dfc'} className="absolute" />
              </div>
            )}
          </div>
        </div>
      </td>
      {props.showAggregateVolume && (
        <td id="collection-volume-over-time" className="py-1 pr-5 sm:pr-0">
          <>
            {props.timeFilter === '1d' && (
              <>
                {props.currencyFilter === 'BNB' && (
                  <div className="flex items-center justify-end">
                    {bnbIcon}
                    {formatNumber(props.volumeBNB_last24h?.toFixed(2)) ||
                      formatNumber(props.volumeBNB_24h?.toFixed(2)) ||
                      '-'}
                  </div>
                )}
                {props.currencyFilter === 'USD' && (
                  <div className="flex items-center justify-end">
                    <div className="mr-1 text-green text-[22px] font-normal">$</div>
                    {formatNumber(props.volumeUSD_last24h?.toFixed(2)) ||
                      formatNumber(props.volumeUSD_24h?.toFixed(2)) ||
                      '-'}
                  </div>
                )}
              </>
            )}
            {props.timeFilter === '1w' && (
              <>
                {props.currencyFilter === 'BNB' && (
                  <div className="flex items-center justify-end">
                    {bnbIcon}
                    {formatNumber(props.volumeBNB_7d?.toFixed(2)) ||
                      formatNumber(props.volumeBNB_last7d?.toFixed(2)) ||
                      '-'}
                  </div>
                )}
                {props.currencyFilter === 'USD' && (
                  <div className="flex items-center justify-end">
                    <div className="mr-1 text-green text-[22px] font-normal">$</div>
                    {formatNumber(props.volumeUSD_7d?.toFixed(2)) ||
                      formatNumber(props.volumeUSD_last7d?.toFixed(2)) ||
                      '-'}
                  </div>
                )}
              </>
            )}
            {props.timeFilter === '1m' && (
              <>
                {props.currencyFilter === 'BNB' && (
                  <div className="flex items-center justify-end">
                    {bnbIcon}
                    {formatNumber(props.volumeBNB_30d?.toFixed(2)) ||
                      formatNumber(props.volumeBNB_last30d?.toFixed(2)) ||
                      '-'}
                  </div>
                )}
                {props.currencyFilter === 'USD' && (
                  <div className="flex items-center justify-end">
                    <div className="mr-1 text-green text-[22px] font-normal">$</div>
                    {formatNumber(props.volumeUSD_30d?.toFixed(2)) ||
                      formatNumber(props.volumeUSD_last30d?.toFixed(2)) ||
                      '-'}
                  </div>
                )}
              </>
            )}
            {props.timeFilter === 'All' && (
              <>
                {props.currencyFilter === 'BNB' && (
                  <div className="flex items-center justify-end">
                    {bnbIcon}
                    {props.volumeBNB ? formatNumber(Number(props.volumeBNB).toFixed(2)) : '-'}
                  </div>
                )}
                {props.currencyFilter === 'USD' && (
                  <div className="flex items-center justify-end">
                    <div className="mr-1 text-green text-[22px] font-normal">$</div>
                    {formatNumber(props.volumeUSD?.toFixed(2)) || '-'}
                  </div>
                )}
              </>
            )}
          </>
        </td>
      )}
      {!props.showAggregateVolume && (
        <td id="volume" className="py-1 pr-5 sm:pr-0">
          <div className="flex items-center justify-end">
            {props.volumeBNB_def > 0 && bnbIcon}
            {props.volumeBNB_def
              ? formatNumber(Number(props.volumeBNB_def)) === 0
                ? '-'
                : formatNumber(Number(props.volumeBNB_def)) >= 1
                ? formatNumber(Number(props.volumeBNB_def).toFixed(2))
                : formatNumber(Number(props.volumeBNB_def).toFixed(3))
              : '-'}
          </div>
        </td>
      )}

      {props.showAggregateVolume && (
        <td id="collection-trades-over-time" className="hidden py-1 md:table-cell">
          <>
            {props.timeFilter === '1d' && <>{props.trades_last24h || props.trades_24h || '-'}</>}
            {props.timeFilter === '1w' && <>{props.trades_last7d || props.trades_7d || '-'}</>}
            {props.timeFilter === '1m' && <>{props.trades_last30d || props.trades_30d || '-'}</>}
            {props.timeFilter === 'All' && <>{props.trades || '-'}</>}
          </>
        </td>
      )}
      {!props.showAggregateVolume && (
        <td id="highest-offer" className="hidden py-1 md:table-cell">
          <div className="flex items-center justify-end">
            {props.offerNBT && +Web3.utils.fromWei(props.offerNBT) > 0 && bnbIcon}
            {props.offerNBT ? formatNumber((+Web3.utils.fromWei(props.offerNBT)).toFixed(4)) : '-'}
          </div>
        </td>
      )}
      <td id="collection-volume" className="hidden py-1 pr-5 md:pr-0 sm:table-cell">
        {props.showAggregateVolume && (
          <>
            {props.currencyFilter === 'BNB' && (
              <div className="flex items-center justify-end">
                {bnbIcon}
                {props.volumeBNB ? formatNumber(Number(props.volumeBNB).toFixed(2)) : '-'}
              </div>
            )}
            {props.currencyFilter === 'USD' && (
              <div className="flex items-center justify-end">
                <div className="mr-1 text-green text-[22px] font-normal">$</div>
                {formatNumber(props.volumeUSD?.toFixed(2)) || '-'}
              </div>
            )}
          </>
        )}
        {!props.showAggregateVolume && (
          <>
            <div className="flex items-center justify-end">
              {props.floorNBT && +Web3.utils.fromWei(props.floorNBT) > 0 && bnbIcon}
              {props.floorNBT ? formatNumber(+Web3.utils.fromWei(props.floorNBT)).toFixed(4) : '-'}
            </div>
          </>
        )}
      </td>
      <td id="collection-trades" className="hidden py-1 pr-5 md:table-cell lg:pr-0">
        {props.showAggregateVolume && (props.trades || '-')}
        {!props.showAggregateVolume && (props.trades_def || '-')}
      </td>
      <td id="collection-holders" className="hidden py-1 pr-5 lg:table-cell">
        {props.holders || '-'}
      </td>
      {/* </Link> */}
    </tr>
  )
}

export default CollectionListEntry
