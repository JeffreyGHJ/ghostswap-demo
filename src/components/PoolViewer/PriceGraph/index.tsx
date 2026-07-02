import { PoolPriceChart } from '../../Charts/PoolPriceChart'
import { PoolTradeChart } from '../../Charts/PoolTradeChart'
import { getSpotPricesBuy, getSpotPricesSell } from '../../PoolBuilder/functions'
import Web3 from 'web3'
import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

const PriceGraph = ({ poolDetails, price = null, delta = null }) => {
  const [selectedPurchases, setSelectedPurchases] = useState('0')
  const [selectedSales, setSelectedSales] = useState('0')
  const [partialPurchasePrice, setPartialPurchasePrice] = useState('0')
  const [partialSalesPrice, setPartialSalesPrice] = useState('0')
  let deltaValue = delta ? delta : poolDetails.delta
  const startPrice = price ? price : poolDetails.poolType === 'SELL' ? poolDetails.offerNBT : poolDetails.floorNBT

  const getMaxBought = (balanceNBT, offerNBT, delta, bondingCurveType) => {
    balanceNBT = Web3.utils.fromWei(balanceNBT)
    offerNBT = Web3.utils.fromWei(offerNBT)

    let maxBought

    if (bondingCurveType === 'EXPONENTIAL') {
      let priceSum = offerNBT

      delta = +Web3.utils.fromWei(deltaValue, 'ether') - 1
      let counter = 1
      if (+balanceNBT > 0) {
        while (+priceSum <= +balanceNBT && counter < 25) {
          price = +price * (100 - +delta)
          priceSum = +priceSum + +price
          counter++
        }
      }
      return counter
    }

    if (bondingCurveType === 'LINEAR') {
      delta = +Web3.utils.fromWei(deltaValue, 'ether')
      maxBought = balanceNBT / (offerNBT - offerNBT * delta)
    }
    return isNaN(maxBought) ? 0 : maxBought
  }

  useEffect(() => {
    if (poolDetails.poolType === 'SELL' || poolDetails.poolType === 'BUY_AND_SELL') {
      let spotPrices = getSpotPricesBuy(
        (+Web3.utils.fromWei(
          poolDetails.poolType === 'BUY_AND_SELL' ? poolDetails.offerNBT : startPrice,
          'ether'
        )).toFixed(6),
        poolDetails.bondingCurveType === 'EXPONENTIAL'
          ? ((+Web3.utils.fromWei(deltaValue, 'ether') - 1) * 100).toFixed(6)
          : (+Web3.utils.fromWei(deltaValue, 'ether')).toFixed(6),
        getMaxBought(poolDetails.balanceNBT, startPrice, deltaValue, poolDetails.bondingCurveType),
        poolDetails.bondingCurveType.toLowerCase()
      )
      setPartialPurchasePrice(
        spotPrices
          .slice(0, +selectedPurchases)
          .reduce((sum, price) => +sum + +price, 0)
          .toString()
      )
    }
  }, [poolDetails.pooltype, selectedPurchases])

  useEffect(() => {
    if (poolDetails.bondingCurveType === 'XYK') {
      deltaValue = '0'
    }
  }, [delta, poolDetails])

  useEffect(() => {
    if (poolDetails.poolType === 'BUY' || poolDetails.poolType === 'BUY_AND_SELL') {
      let spotPrices = getSpotPricesSell(
        (+Web3.utils.fromWei(startPrice, 'ether')).toFixed(6),
        poolDetails.bondingCurveType === 'EXPONENTIAL'
          ? ((+Web3.utils.fromWei(deltaValue, 'ether') - 1) * 100).toFixed(6)
          : (+Web3.utils.fromWei(deltaValue, 'ether')).toFixed(6),
        poolDetails.nftBalance,
        poolDetails.bondingCurveType.toLowerCase()
      )
      setPartialSalesPrice(
        spotPrices
          .slice(0, +selectedSales)
          .reduce((sum, price) => +sum + +price, 0)
          .toString()
      )
    }
  }, [selectedSales])

  return (
    <div id="price-graph" className="p-3 w-full rounded-md bg-dark-800">
      <div
        id="heading"
        style={{ WebkitTextStrokeWidth: '.02rem' }}
        className="w-full text-[1.45rem] text-center font-bold mb-3"
      >
        Price Graph
      </div>
      <div className="flex flex-col gap-2">
        <div id="graph-controls-flex-container" className="flex flex-wrap gap-2 justify-between">
          {poolDetails.poolType !== 'BUY' && (
            <div id="graph-controls-sell" className="min-w-[45%] flex-grow p-3 rounded-md bg-dark-900 text-[20px]">
              <div className="w-full text-center">Buying {selectedPurchases} NFTs...</div>
              <div id="slider-group" className="flex justify-center items-center">
                <div id="current-slider-value">0</div>
                <input
                  type="range"
                  style={{
                    accentColor: 'dimgray',
                    transform: poolDetails.poolType !== 'BUY_AND_SELL' ? '' : 'rotate(180deg)',
                  }}
                  className="w-3/5 max-w-[30rem] mx-3"
                  value={selectedPurchases || 0}
                  min={0}
                  max={getMaxBought(poolDetails.balanceNBT, startPrice, deltaValue, poolDetails.bondingCurveType)}
                  step={1}
                  onChange={(e) => setSelectedPurchases(e.target.value)}
                ></input>
                <div id="slider-max-value">
                  {parseInt(getMaxBought(poolDetails.balanceNBT, startPrice, deltaValue, poolDetails.bondingCurveType))}
                </div>
              </div>
              <div id="result" className="flex justify-center items-center">
                <div>will cost this pool</div>
                <div id="value" className="rounded-md bg-black p-[.375rem] px-3 mx-1">
                  {parseFloat((+partialPurchasePrice).toFixed(6))}
                </div>
                <div>BNB</div>
              </div>
            </div>
          )}
          {poolDetails.poolType !== 'SELL' && (
            <div id="graph-controls-buy" className="min-w-[45%] flex-grow p-3 rounded-md bg-dark-900 text-[20px]">
              <div className="w-full text-center">Selling {selectedSales} NFTs...</div>
              <div id="slider-group" className="flex justify-center items-center">
                <div id="current-slider-value">0</div>
                <input
                  type="range"
                  style={{ accentColor: 'dimgray' }}
                  className="w-3/5 max-w-[30rem] mx-3"
                  value={selectedSales || 0}
                  min={0}
                  max={poolDetails.nftBalance}
                  step={1}
                  onChange={(e) => setSelectedSales(e.target.value)}
                ></input>
                <div id="slider-max-value">{poolDetails.nftBalance}</div>
              </div>
              <div id="result" className="flex justify-center items-center">
                <div>will earn this pool</div>
                <div id="value" className="rounded-md bg-black p-[.375rem] px-3 mx-1">
                  {parseFloat((+partialSalesPrice).toFixed(6))}
                </div>
                <div>BNB</div>
              </div>
            </div>
          )}
        </div>
        <div id="graph-container" className="w-full p-3 rounded-md bg-dark-900 text-[20px]">
          {poolDetails.poolType === 'BUY' && poolDetails.bondingCurveType === 'EXPONENTIAL' && (
            <PoolPriceChart
              selectedPoints={selectedSales}
              amount={poolDetails.nftBalance}
              spotPrices={getSpotPricesSell(
                (+Web3.utils.fromWei(startPrice, 'ether')).toFixed(6),
                ((+Web3.utils.fromWei(deltaValue, 'ether') - 1) * 100).toFixed(6),
                poolDetails.nftBalance,
                poolDetails.bondingCurveType.toLowerCase()
              )}
            />
          )}
          {poolDetails.poolType === 'SELL' && poolDetails.bondingCurveType === 'EXPONENTIAL' && (
            <PoolPriceChart
              selectedPoints={selectedPurchases}
              amount={parseInt(
                getMaxBought(poolDetails.balanceNBT, startPrice, deltaValue, poolDetails.bondingCurveType)
              )}
              spotPrices={getSpotPricesBuy(
                (+Web3.utils.fromWei(startPrice, 'ether')).toFixed(6),
                ((+Web3.utils.fromWei(deltaValue, 'ether') - 1) * 100).toFixed(6),
                getMaxBought(poolDetails.balanceNBT, startPrice, deltaValue, poolDetails.bondingCurveType),
                poolDetails.bondingCurveType.toLowerCase()
              )}
            />
          )}
          {poolDetails.poolType === 'BUY' && poolDetails.bondingCurveType === 'LINEAR' && (
            <PoolPriceChart
              selectedPoints={selectedSales}
              amount={poolDetails.nftBalance}
              spotPrices={getSpotPricesSell(
                (+Web3.utils.fromWei(startPrice, 'ether')).toFixed(6),
                (+Web3.utils.fromWei(deltaValue, 'ether')).toFixed(6),
                poolDetails.nftBalance,
                poolDetails.bondingCurveType.toLowerCase()
              )}
            />
          )}
          {poolDetails.poolType === 'SELL' && poolDetails.bondingCurveType === 'LINEAR' && (
            <PoolPriceChart
              selectedPoints={selectedPurchases}
              amount={parseInt(
                getMaxBought(poolDetails.balanceNBT, startPrice, deltaValue, poolDetails.bondingCurveType)
              )}
              spotPrices={getSpotPricesBuy(
                (+Web3.utils.fromWei(startPrice, 'ether')).toFixed(6),
                (+Web3.utils.fromWei(deltaValue, 'ether')).toFixed(6),
                getMaxBought(poolDetails.balanceNBT, startPrice, deltaValue, poolDetails.bondingCurveType),
                poolDetails.bondingCurveType.toLowerCase()
              )}
            />
          )}

          {poolDetails.poolType === 'BUY_AND_SELL' && poolDetails.bondingCurveType === 'LINEAR' && (
            <PoolTradeChart
              selectedPurchases={selectedPurchases}
              selectedSales={selectedSales}
              amountToBuy={parseInt(
                getMaxBought(poolDetails.balanceNBT, startPrice, deltaValue, poolDetails.bondingCurveType)
              )}
              amountToSell={poolDetails.nftBalance}
              spotPricesBuy={getSpotPricesBuy(
                (+Web3.utils.fromWei(poolDetails.offerNBT, 'ether')).toFixed(6),
                (+Web3.utils.fromWei(deltaValue, 'ether')).toFixed(6),
                getMaxBought(poolDetails.balanceNBT, startPrice, deltaValue, poolDetails.bondingCurveType),
                poolDetails.bondingCurveType.toLowerCase()
              ).reverse()}
              spotPricesSell={getSpotPricesSell(
                (+Web3.utils.fromWei(poolDetails.floorNBT, 'ether')).toFixed(6),
                (+Web3.utils.fromWei(deltaValue, 'ether')).toFixed(6),
                poolDetails.nftBalance,
                poolDetails.bondingCurveType.toLowerCase()
              )}
            />
          )}
          {poolDetails.poolType === 'BUY_AND_SELL' && poolDetails.bondingCurveType === 'EXPONENTIAL' && (
            <PoolTradeChart
              selectedPurchases={selectedPurchases}
              selectedSales={selectedSales}
              amountToBuy={parseInt(
                getMaxBought(poolDetails.balanceNBT, startPrice, deltaValue, poolDetails.bondingCurveType)
              )}
              amountToSell={poolDetails.nftBalance}
              spotPricesBuy={getSpotPricesBuy(
                (+Web3.utils.fromWei(poolDetails.offerNBT, 'ether')).toFixed(6),
                ((+Web3.utils.fromWei(deltaValue, 'ether') - 1) * 100).toFixed(6),
                getMaxBought(poolDetails.balanceNBT, startPrice, deltaValue, poolDetails.bondingCurveType),
                poolDetails.bondingCurveType.toLowerCase()
              ).reverse()}
              spotPricesSell={getSpotPricesSell(
                (+Web3.utils.fromWei(poolDetails.floorNBT, 'ether')).toFixed(6),
                ((+Web3.utils.fromWei(deltaValue, 'ether') - 1) * 100).toFixed(6),
                poolDetails.nftBalance,
                poolDetails.bondingCurveType.toLowerCase()
              )}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default PriceGraph
