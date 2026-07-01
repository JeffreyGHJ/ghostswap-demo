import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import BondingCurveBadge from '../../../BondingCurveBadge'
import DropdownMenu from '../../DropdownMenu'
import { ArrowTooltipFlat as Tooltip } from '../../../Tooltip'
import { useState } from 'react'
import { offset } from '@popperjs/core'
import { useWindowSize } from '../../../../hooks/useWindowSize'

const PoolPricing = (props) => {
  const [showFeeTip, setShowFeeTip] = useState(false)
  const [showPriceTip, setShowPriceTip] = useState(false)
  const [showDeltaTip, setShowDeltaTip] = useState(false)
  const [showCurveTip, setShowCurveTip] = useState(false)
  const [showConceTip, setShowConceTip] = useState(false)

  return (
    <div id="pool-pricing" className="flex w-full p-3">
      <div id="container" className="flex flex-col w-full p-3 border-2 border-gray-600 rounded-md">
        <div id="heading" className="text-[1.5rem] font-bold text-center">
          Pool Pricing
        </div>
        <div id="subheading" className="text-[15px] text-center mb-3 mt-1">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Set the initial price and how your pool's price changes.
        </div>

        {props.poolType === 'BUY_AND_SELL' && (
          <div id="fee-input" className="flex w-full px-3 mb-3">
            <div id="flex-group-col" className="flex flex-col items-center justify-start w-1/2 min-w-[150px]">
              <div id="fee-input-label" className="flex items-center justify-start w-full">
                Fee Amount
                <div id="icon" className="mt-[.1rem] ml-1">
                  <Tooltip
                    show={showFeeTip}
                    content={<div className="text-[13px] ts-2">The % of each trade you take as a fee</div>}
                  >
                    <QuestionMarkCircleIcon
                      width={14}
                      height={14}
                      onMouseEnter={() => setShowFeeTip(true)}
                      onMouseLeave={() => setShowFeeTip(false)}
                    />
                  </Tooltip>
                </div>
              </div>
              <div
                id="input-group"
                className="flex items-center w-full border relative h-[2.8rem] border-gray-600 rounded-[5px]"
              >
                <input
                  type="number"
                  value={props.feeAmount || ''}
                  min={0}
                  max={90}
                  step={0.01}
                  onKeyDown={(e) => props.blockInvalidInput(e, 'decimal')}
                  onChange={(e) => props.setFeeAmount(e.target.value)}
                  className="pl-3 py-2 bg-black rounded leading-[1.5] w-full h-full"
                ></input>
                <div id="currency-display" className="flex items-center px-3 border-l border-l-[#161522] h-full">
                  <div className="font-bold">%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div id="price-input" className="flex flex-col justify-between w-full px-[12px] mb-3">
          <div id="price-input-label" className="flex items-center justify-start">
            <div id="text" className="text-[15px] font-bold">
              Start Price
            </div>
            <div id="icon" className="mt-[.1rem] ml-1">
              <Tooltip
                show={showPriceTip}
                content={<div className="text-[13px] ts-2">The starting price of your pool</div>}
              >
                <QuestionMarkCircleIcon
                  width={14}
                  height={14}
                  onMouseEnter={() => setShowPriceTip(true)}
                  onMouseLeave={() => setShowPriceTip(false)}
                />
              </Tooltip>
            </div>
          </div>
          <div
            id="input-group"
            className="flex items-center w-full border relative h-[2.8rem] border-gray-600 rounded-[5px]"
          >
            <input
              type="number"
              value={props.startPrice || ''}
              min={0}
              step={0.001}
              onKeyDown={(e) => props.blockInvalidInput(e, 'decimal')}
              onChange={(e) => props.setStartPrice(e.target.value)}
              className="pl-3 py-2 bg-black rounded leading-[1.5] w-full h-full"
            ></input>
            <div id="currency-display" className="flex items-center px-3 border-l border-l-[#161522] h-full">
              <div id="icon-container" className="w-[20px] h-[20px]">
                <img src="/images/tokens/bnb-icon.png" width={20} height={20}></img>
              </div>
              <div className="ml-1 font-bold">{props.token.name}</div>
            </div>
          </div>
        </div>

        <div id="curve-select" className="flex flex-col justify-between w-full px-[12px] mb-3">
          <div id="curve-select-label" className="flex items-center justify-start">
            <div id="text" className="text-[15px] font-bold">
              Bonding Curve
            </div>
            <div id="icon" className="mt-[.1rem] ml-1">
              <Tooltip
                show={showCurveTip}
                content={<div className="text-[13px] ts-2">Controls how your pool's price will change</div>}
              >
                <QuestionMarkCircleIcon
                  width={14}
                  height={14}
                  onMouseEnter={() => setShowCurveTip(true)}
                  onMouseLeave={() => setShowCurveTip(false)}
                />
              </Tooltip>
            </div>
          </div>
          <div id="dropdown-menu-container" className="py-[6px]">
            <DropdownMenu
              buttonContent={
                <div id="dropdown-menu-button" className="flex items-center justify-center gap-2">
                  <BondingCurveBadge bondingCurveType={props.bondingCurve.toUpperCase()} />
                  {props.bondingCurve === 'linear' && 'Linear Curve'}
                  {props.bondingCurve === 'exponential' && 'Exponential Curve'}
                  {props.bondingCurve === 'xyk' && 'Concentrated XYK'}
                </div>
              }
              items={[
                // eslint-disable-next-line react/jsx-key
                <LinearCurveOption setBondingCurve={props.setBondingCurve} />,
                // eslint-disable-next-line react/jsx-key
                <ExponentialCurveOption setBondingCurve={props.setBondingCurve} />,
                // eslint-disable-next-line react/jsx-key
                // <div className="flex items-center" onClick={() => props.setBondingCurve('xyk')}>
                // <BondingCurveBadge bondingCurve={'xyk'} />
                //   <div className="ml-2">Concentrated XYK</div>
                // </div>,
              ]}
            />
          </div>
        </div>

        {props.bondingCurve !== 'xyk' && (
          <div id="delta-input" className="flex flex-col justify-between w-full px-[12px] mb-3">
            <div id="delta-input-label" className="flex items-center justify-start">
              <div id="text" className="text-[15px] font-bold">
                Delta
              </div>
              <div id="icon" className="mt-[.1rem] ml-1">
                <Tooltip
                  show={showDeltaTip}
                  content={<div className="text-[13px] ts-2">How much your pool's price changes with each sale</div>}
                >
                  <QuestionMarkCircleIcon
                    width={14}
                    height={14}
                    onMouseEnter={() => setShowDeltaTip(true)}
                    onMouseLeave={() => setShowDeltaTip(false)}
                  />
                </Tooltip>
              </div>
            </div>
            <div
              id="input-group"
              className="flex items-center w-full border relative h-[2.8rem] border-gray-600 rounded-[5px]"
            >
              <input
                type="number"
                value={props.delta}
                min={0}
                step={0.001}
                onKeyDown={(e) => props.blockInvalidInput(e, 'decimal')}
                onChange={(e) => props.setDelta(e.target.value)}
                className="pl-3 py-2 bg-black rounded leading-[1.5] w-full h-full"
              ></input>
              <div id="currency-display" className="flex items-center px-3 border-l border-l-[#161522] h-full">
                {props.bondingCurve === 'linear' && (
                  <>
                    <div id="icon-container" className="w-[20px] h-[20px]">
                      <img src="/images/tokens/bnb-icon.png" width={20} height={20}></img>
                    </div>
                    <div className="ml-1 font-bold">BNB</div>
                  </>
                )}
                {props.bondingCurve === 'exponential' && <div className="w-6 text-center">%</div>}
                {props.bondingCurve === 'xyk' && <div className="w-6 text-center">x</div>}
              </div>
            </div>
          </div>
        )}

        {props.bondingCurve === 'xyk' && (
          <div id="concentration-input" className="flex flex-col justify-between w-full px-[12px] mb-3">
            <div id="concentration-input-label" className="flex items-center justify-start">
              <div id="text" className="text-[15px] font-bold">
                Concentration
              </div>
              <div id="icon" className="mt-[.1rem] ml-1">
                <Tooltip
                  show={showConceTip}
                  content={
                    <div className="text-[13px] ts-2">
                      How much more concentrated your pool is, compared to a normal constant product curve
                    </div>
                  }
                >
                  <QuestionMarkCircleIcon
                    width={14}
                    height={14}
                    onMouseEnter={() => setShowConceTip(true)}
                    onMouseLeave={() => setShowConceTip(false)}
                  />
                </Tooltip>
              </div>
            </div>
            <div
              id="input-group"
              className="flex items-center w-full border relative h-[2.8rem] border-gray-600 rounded-[5px]"
            >
              <input
                type="number"
                value={props.concentration || '0'}
                min={0}
                step={1}
                onKeyDown={(e) => props.blockInvalidInput(e, 'integer')}
                onChange={(e) => props.setConcentration(e.target.value)}
                className="pl-3 py-2 bg-black rounded leading-[1.5] w-full h-full"
              ></input>
              <div id="currency-display" className="flex items-center px-3 border-l border-l-[#161522] h-full">
                <div className="w-6 text-center">x</div>
              </div>
            </div>
          </div>
        )}

        <div id="pool-pricing-info" className="flex flex-col m-3 text-[15px] ">
          <div className="px-3 mb-3 tracking-tight">
            You have selected a starting price of {props.startPrice} {props.token.name}
          </div>
          {props.bondingCurve !== 'xyk' && (
            <div className="px-3 tracking-tight">
              Each time your pool
              <span className="font-bold text-[16px]">
                {props.poolType === 'BUY' && ' buys'}
                {props.poolType === 'SELL' && ' sells '}
                {props.poolType === 'BUY_AND_SELL' && ' trades '}
              </span>{' '}
              an NFT,
              {props.poolType === 'BUY' && ' your buy '}
              {props.poolType === 'SELL' && ' your sell '}
              {props.poolType === 'BUY_AND_SELL' && ' the '}
              price will adjust
              <span className="font-bold text-[16px]">
                {props.poolType === 'BUY' && ' down '}
                {props.poolType === 'SELL' && ' up '}
              </span>{' '}
              by {props.delta}
              {props.bondingCurve === 'linear' && ' BNB'}
              {props.bondingCurve === 'exponential' && '%'}.
            </div>
          )}
          {props.bondingCurve === 'xyk' && (
            <div className="px-3 tracking-tight">
              Your pool is
              <span className="font-bold text-[16px]">{' ' + (+props.concentration + 1) + 'x '}</span> as concentrated
              as a normal constant product curve.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const LinearCurveOption = ({ setBondingCurve }) => {
  const [showLinTip, setShowLinTip] = useState(false)
  const { width } = useWindowSize()
  return (
    <Tooltip
      show={showLinTip}
      arrow={{ offset: [0, 12] }}
      placement={width > 700 ? 'right' : 'auto'}
      content={<div className="text-[13px] ts-2">Price changes by a flat amount each time</div>}
      backgroundColor={'bg-dark-900'}
    >
      <div
        className="flex items-center"
        onClick={() => setBondingCurve('linear')}
        onMouseEnter={() => setShowLinTip(true)}
        onMouseLeave={() => setShowLinTip(false)}
      >
        <BondingCurveBadge bondingCurveType={'LINEAR'} />
        <div className="ml-2">Linear Curve</div>
      </div>
    </Tooltip>
  )
}

const ExponentialCurveOption = ({ setBondingCurve }) => {
  const [showExpTip, setShowExpTip] = useState(false)
  const { width } = useWindowSize()
  return (
    <Tooltip
      show={showExpTip}
      arrow={{ offset: [0, 12] }}
      placement={width > 700 ? 'right' : 'auto'}
      content={
        <div className="text-[13px] ts-2 w-[15rem] text-center">
          Price increases faster, but also decreases faster, uses percentage changes
        </div>
      }
      backgroundColor={'bg-dark-900'}
    >
      <div
        className="flex items-center"
        onClick={() => setBondingCurve('exponential')}
        onMouseEnter={() => setShowExpTip(true)}
        onMouseLeave={() => setShowExpTip(false)}
      >
        <BondingCurveBadge bondingCurveType={'EXPONENTIAL'} />
        <div className="ml-2">Exponential Curve</div>
      </div>
    </Tooltip>
  )
}

export default PoolPricing
