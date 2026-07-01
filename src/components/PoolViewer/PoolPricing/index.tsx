import BondingCurveBadge from '../../BondingCurveBadge'
import Button from '../Button'
import Web3 from 'web3'

const PoolPricing = ({ poolDetails, canEdit, setModalState }) => {
  const bondingCurveType = poolDetails?.bondingCurveType
  return (
    <div id="pricing" style={{ WebkitTextStrokeWidth: '.02rem' }} className="w-full h-full p-3 rounded-md bg-dark-800 ">
      <div id="heading" className="w-full text-[1.45rem] font-bold flex items-center justify-between">
        <div className="mb-3">Pricing</div>
        <Button enabled={canEdit} onClick={() => setModalState('edit-pricing')}>
          Edit
        </Button>
      </div>
      <div id="pricing-info-row" className="flex flex-wrap items-center gap-2 xs:flex-nowrap">
        <div id="current-price" className="flex flex-wrap w-full p-3 rounded-md bg-dark-900">
          <div id="heading" className="w-full h-12">
            Current Price
          </div>
          <div id="value" className="w-full md:h-[36px] flex items-center gap-1">
            <Bnb />
            {poolDetails.poolType === 'SELL' && (+Web3.utils.fromWei(poolDetails.offerNBT, 'ether')).toFixed(3)}
            {poolDetails.poolType === 'BUY' && (+Web3.utils.fromWei(poolDetails.floorNBT, 'ether')).toFixed(3)}
            {poolDetails.poolType === 'BUY_AND_SELL' &&
              String((+Web3.utils.fromWei(poolDetails.offerNBT, 'ether')).toFixed(3)) +
                '/' +
                String((+Web3.utils.fromWei(poolDetails.floorNBT, 'ether')).toFixed(3))}
          </div>
        </div>
        {poolDetails.bondingCurveType !== 'XYK' && (
          <div id="delta" className="flex flex-wrap w-full p-3 rounded-md bg-dark-900">
            <div className="h-12">
              <div id="heading" className="w-full">
                Delta
              </div>
              <div id="bonding-curve-info" className="flex items-center w-full text-[10px] h-4 mb-2 text-gray-400">
                <div className="flex items-center gap-1">
                  {bondingCurveType} <BondingCurveBadge bondingCurveType={bondingCurveType} size="xsmall" />
                </div>
              </div>
            </div>
            <div id="value" className="w-full md:text-[24px] flex gap-2">
              {poolDetails.bondingCurveType === 'LINEAR' && (
                <div className="flex items-center gap-1 ">
                  <Bnb />
                  {Web3.utils.fromWei(poolDetails.delta, 'ether')}{' '}
                </div>
              )}
              {poolDetails.bondingCurveType === 'EXPONENTIAL' && (
                <div> {((+Web3.utils.fromWei(poolDetails.delta) - 1) * 100).toFixed(2)} %</div>
              )}
            </div>
          </div>
        )}
        {poolDetails.poolType === 'BUY_AND_SELL' && (
          <div id="fee-amount" className="w-full p-3 rounded-md bg-dark-900">
            <div id="heading" className="w-full h-12">
              Swap Fee
            </div>
            <div id="value" className="w-full md:text-[24px] flex gap-2">
              {(+Web3.utils.fromWei(poolDetails.fee, 'ether') * 100).toFixed(3) + '%'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Bnb = () => {
  return <img src={'/images/tokens/bnb-icon.png'} className="w-4 h-4 md:w-6 md:h-6" />
}

export default PoolPricing
