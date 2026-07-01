import BondingCurveBadge from '../../BondingCurveBadge'
import CollectionAvatar from '../CollectionAvatar'
import PoolCardBuyDetails from './PoolCardBuyDetails'
import PoolCardSaleDetails from './PoolCardSaleDetails'
import PoolCardTradeDetails from './PoolCardTradeDetails'
import Web3 from 'web3'
import nft from '../../../../public/nft.png'

const PoolCardDetails = (props) => {
  return (
    <div
      id="pool-details"
      className="rounded-md bg-[rgba(80,130,210,.2)] p-4 mt-[6px] leading-[1.5] font-bold text-gray-400 text-[15px]"
    >
      {props.poolType === 'BUY_AND_SELL' && <PoolCardTradeDetails {...props} />}
      {props.poolType === 'BUY' && <PoolCardSaleDetails {...props} />}
      {props.poolType === 'SELL' && <PoolCardBuyDetails {...props} />}
      <div id="separator" className="border-b-2 border-b-[#3b5587] mt-3 w-full" />

      <div id="delta" className="w-full mt-6">
        <div className="flex items-center justify-between">
          {props.bondingCurveType !== 'XYK' && <div>Delta</div>}
          {props.bondingCurveType === 'XYK' && <div>Reserves</div>}
          <div id="group-right" className="flex items-center">
            <div id="badge">
              {props.bondingCurveType === 'EXPONENTIAL' && <BondingCurveBadge bondingCurveType={'EXPONENTIAL'} />}
              {props.bondingCurveType === 'LINEAR' && <BondingCurveBadge bondingCurveType={'LINEAR'} />}
              {props.bondingCurveType === 'XYK' && <BondingCurveBadge bondingCurveType={'XYK'} />}
            </div>
            {props.bondingCurveType === 'LINEAR' && (
              <div id="bnb-value" className="flex items-center">
                <img src={'/images/tokens/bnb-icon.png'} className="w-4 h-4 ml-3 mr-1"></img>
                <div id="value">{+Web3.utils.fromWei(props.delta) || '-'}</div>
              </div>
            )}
            {props.bondingCurveType === 'EXPONENTIAL' && (
              <div id="percentage" className="ml-3">
                {((+Web3.utils.fromWei(props.delta)-1)*100).toFixed(2) || '-'}%
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="balance" className="w-full mt-3">
        <div className="flex items-center justify-between">
          <div>Balance</div>
          <div id="group-right" className="flex items-center">
            {props.poolType === 'BUY' && (
              <>
                <div id="nft-amount" className="flex items-center">
                  <CollectionAvatar avatar={nft.src} height={16} width={16} />
                  <div id="value">{props.nftBalance || '-'}</div>
                </div>
              </>
            )}
            {props.poolType === 'SELL' && (
              <div id="currency-amount" className="flex items-center">
                <img src={'/images/tokens/bnb-icon.png'} className="w-4 h-4 ml-3 mr-1"></img>
                <div id="value">{(+Web3.utils.fromWei(props.balanceNBT)).toFixed(3)|| '-'}</div>
              </div>
            )}

            {props.poolType === 'BUY_AND_SELL' && (
              <>
                <div id="nft-amount" className="flex items-center">
                  <CollectionAvatar avatar={nft.src} height={16} width={16} />
                  <div id="value">{props.nftBalance || '-'}</div>
                </div>
                <div id="currency-amount" className="flex items-center">
                  <img src={'/images/tokens/bnb-icon.png'} className="w-4 h-4 ml-3 mr-1"></img>
                  <div id="value">{(+Web3.utils.fromWei(props.balanceNBT)).toFixed(3) || '-'}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoolCardDetails
