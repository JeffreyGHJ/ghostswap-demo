import { useEffect, useState } from 'react'
import { PoolPriceChart } from '../../../Charts/PoolPriceChart'
import { PoolTradeChart } from '../../../Charts/PoolTradeChart'

const PoolChart = (props) => {
  return (
    <>
      {props.poolType === 'BUY' && (
        <PriceChart
          amountToBuy={props.amountToBuy}
          spotPricesBuy={props.spotPricesBuy}
          selectedPurchases={props.selectedPurchases}
          nftCollection={props.nftCollection}
          token={props.token}
        />
      )}
      {props.poolType === 'SELL' && (
        <SalesChart
          amountToSell={props.amountToSell}
          spotPricesSell={props.spotPricesSell}
          selectedSales={props.selectedSales}
          nftCollection={props.nftCollection}
          token={props.token}
        />
      )}
      {props.poolType === 'BUY_AND_SELL' && (
        <TradesChart
          amountToBuy={props.amountToBuy}
          amountToSell={props.amountToSell}
          spotPricesBuy={props.spotPricesBuy}
          spotPricesSell={props.spotPricesSell}
          selectedPurchases={props.selectedPurchases}
          selectedSales={props.selectedSales}
          nftCollection={props.nftCollection}
          token={props.token}
        />
      )}
    </>
  )
}

const TradesChart = (props) => {
  return (
    <div id="chart-container" className="flex w-full p-3">
      <div
        id="chart"
        className="flex flex-col items-center justify-center w-full tracking-tight border-2 border-gray-600 rounded-md"
      >
        <div className="w-full p-3 pb-0">
          <div id="heading" className="text-[1.5rem] font-bold text-center w-full">
            BNB Price Per {props.nftCollection.name}
          </div>
          <div id="subheading" className="text-[15px] text-center mb-3 w-full">
            Displays how your buy price goes up with each {props.nftCollection.name} sold.
          </div>
        </div>
        <div className="w-full h-full">
          <PoolTradeChart
            amountToBuy={props.amountToBuy}
            amountToSell={props.amountToSell}
            spotPricesBuy={props.spotPricesBuy}
            spotPricesSell={props.spotPricesSell}
            selectedPurchases={props.selectedPurchases}
            selectedSales={props.selectedSales}
          />
        </div>
      </div>
    </div>
  )
}

const SalesChart = (props) => {
  return (
    <div id="chart-container" className="flex w-full p-3">
      <div
        id="chart"
        className="flex flex-col items-center justify-center w-full tracking-tight border-2 border-gray-600 rounded-md"
      >
        <div className="w-full p-3 pb-0">
          <div id="heading" className="text-[1.5rem] font-bold text-center w-full">
            BNB Price Per {props.nftCollection.name}
          </div>
          <div id="subheading" className="text-[15px] text-center mb-3 w-full">
            Displays how your buy price goes up with each {props.nftCollection.name} sold.
          </div>
        </div>
        <div className="w-full h-full">
          <PoolPriceChart
            amount={props.amountToSell}
            spotPrices={props.spotPricesSell}
            selectedPoints={props.selectedSales}
          />
        </div>
      </div>
    </div>
  )
}

const PriceChart = (props) => {
  return (
    <div id="chart-container" className="flex w-full p-3">
      <div
        id="chart"
        className="flex flex-col items-center justify-center w-full tracking-tight border-2 border-gray-600 rounded-md"
      >
        <div className="w-full p-3 pb-0">
          <div id="heading" className="text-[1.5rem] font-bold text-center w-full">
            BNB Price Per {props.nftCollection.name}
          </div>
          <div id="subheading" className="text-[15px] text-center mb-3 w-full">
            Displays how your buy price goes down with each {props.nftCollection.name} bought.
          </div>
        </div>
        <div className="w-full h-full">
          <PoolPriceChart
            amount={props.amountToBuy}
            spotPrices={props.spotPricesBuy}
            selectedPoints={props.selectedPurchases}
            nftCollection={props.nftCollection}
            token={props.token}
          />
        </div>
      </div>
    </div>
  )
}

export default PoolChart
