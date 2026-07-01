import { useEffect, useState } from 'react'
import { countValidTrades } from '../functions'
import AssetAmounts from './AssetAmounts'
import PoolChart from './PoolChart'
import PoolPricing from './PoolPricing'

const ConfigurePool = (props) => {
  const [numValidTrades, setNumValidTrades] = useState('0')
  const [isValidInputs, setIsValidInputs] = useState(true)
  const [canSubmit, setCanSubmit] = useState(false)

  const [selectedPurchases, setSelectedPurchases] = useState('0')
  const [selectedSales, setSelectedSales] = useState('0')
  const [partialPurchasePrice, setPartialPurchasePrice] = useState('0')
  const [partialSalesPrice, setPartialSalesPrice] = useState('0')

  const allowedKeysInteger = [...'0123456789', 'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
  const allowedKeysDecimal = [...allowedKeysInteger, '.']

  const blockInvalidInput = (e, type) => {
    let allowedKeys
    if (type === 'integer') allowedKeys = allowedKeysInteger
    if (type === 'decimal') allowedKeys = allowedKeysDecimal
    if (!allowedKeys.includes(e.key)) e.preventDefault()
  }

  useEffect(() => {
    let validTrades = countValidTrades(props.startPrice, +props.delta || 0, props.amountToBuy, props.bondingCurve)
    setNumValidTrades(validTrades)
    setIsValidInputs(props.poolType !== 'BUY' || +validTrades === +props.amountToBuy)
  }, [props.startPrice, props.delta, props.amountToBuy, props.bondingCurve])

  useEffect(() => {
    let spotPrices = [...props.spotPricesBuy]
    if (props.poolType === 'BUY_AND_SELL') spotPrices.reverse()
    setPartialPurchasePrice(
      spotPrices
        .slice(0, +selectedPurchases)
        .reduce((sum, price) => +sum + +price, 0)
        .toString()
    )
  }, [props.spotPricesBuy, props.pooltype, selectedPurchases])

  useEffect(() => {
    setPartialSalesPrice(
      props.spotPricesSell
        .slice(0, +selectedSales)
        .reduce((sum, price) => +sum + +price, 0)
        .toString()
    )
  }, [props.spotPricesSell, selectedSales])

  useEffect(() => {
    if (!props.startPrice || !props.delta) setIsValidInputs(true)
  }, [props.startPrice, props.delta])

  useEffect(() => {
    if (!(+props.startPrice > 0)) {
      console.log('needs price to submit')
      setCanSubmit(false)
    } else if (props.poolType !== 'SELL' && !(+props.amountToBuy > 0)) {
      console.log('needs amount to buy to submit')
      setCanSubmit(false)
    } else if (props.poolType !== 'BUY' && !(+props.amountToSell > 0)) {
      console.log('needs amount to sell to submit')
      setCanSubmit(false)
    } else {
      if (isValidInputs) console.log('READY TO SUBMIT!')
      setCanSubmit(isValidInputs)
    }
  }, [props.startPrice, props.delta, isValidInputs, props.amountToBuy, props.amountToSell, props.poolType])

  useEffect(() => {
    props.setIsConfigValid(canSubmit)
  }, [canSubmit])

  // DEBUG OUTPUT
  useEffect(() => {
    console.log('numValidTrades: ' + numValidTrades)
  }, [numValidTrades])
  useEffect(() => {
    console.log('isValidInputs: ' + isValidInputs)
  }, [isValidInputs])
  useEffect(() => {
    console.log('canSubmit: ' + canSubmit)
  }, [canSubmit])

  return (
    <>
      <StepInfo currentStep={props.currentStep} TOTAL_STEPS={props.TOTAL_STEPS} description={props.description} />
      <div id="configure-pool" className="flex flex-col">
        <div id="flex-group" className="flex flex-col sm:flex-row w-100%">
          <PoolPricing
            poolType={props.poolType}
            nftCollection={props.nftCollection}
            token={props.token}
            feeAmount={props.feeAmount}
            setFeeAmount={props.setFeeAmount}
            startPrice={props.startPrice}
            setStartPrice={props.setStartPrice}
            bondingCurve={props.bondingCurve}
            setBondingCurve={props.setBondingCurve}
            delta={props.delta}
            setDelta={props.setDelta}
            concentration={props.concentration}
            setConcentration={props.setConcentration}
            blockInvalidInput={blockInvalidInput}
          />
          <AssetAmounts
            poolType={props.poolType}
            blockInvalidInput={blockInvalidInput}
            nftCollection={props.nftCollection}
            token={props.token}
            numValidTrades={numValidTrades}
            isValidInputs={isValidInputs}
            amountToBuy={props.amountToBuy}
            setAmountToBuy={props.setAmountToBuy}
            amountToSell={props.amountToSell}
            setAmountToSell={props.setAmountToSell}
            selectedPurchases={selectedPurchases}
            setSelectedPurchases={setSelectedPurchases}
            selectedSales={selectedSales}
            setSelectedSales={setSelectedSales}
            totalPurchasePrice={props.totalPurchasePrice}
            partialPurchasePrice={partialPurchasePrice}
            totalSalesPrice={props.totalSalesPrice}
            partialSalesPrice={partialSalesPrice}
          />
        </div>
        <PoolChart
          poolType={props.poolType}
          nftCollection={props.nftCollection}
          token={props.token}
          startPrice={props.startPrice}
          bondingCurve={props.bondingCurve}
          delta={props.delta}
          amountToBuy={props.amountToBuy}
          amountToSell={props.amountToSell}
          selectedPurchases={selectedPurchases}
          selectedSales={selectedSales}
          spotPricesBuy={props.spotPricesBuy}
          spotPricesSell={props.spotPricesSell}
        />
      </div>
    </>
  )
}

const StepInfo = (props) => {
  return (
    <div id="step-info" className="w-full mb-3 text-[15px] text-gray-500 tracking-tight">
      <div style={{ WebkitTextStrokeWidth: '0.8px' }}>
        Step {props.currentStep || '?'}/{props.TOTAL_STEPS || '?'}: {props.description || 'DESCRIPTION_TEXT'}
      </div>
    </div>
  )
}

export default ConfigurePool
