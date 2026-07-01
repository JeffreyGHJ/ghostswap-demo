import { Minus, Plus } from 'react-feather'
import Input from '../../PoolViewer/Input'
import Web3Connect from '../../Web3Connect'
import SoulEater from '../../../../public/SoulEaters.png'
import { useEffect, useState } from 'react'
import { getTimeRemaining } from '../functions'
import { useWeb3React } from '@web3-react/core'

const counterBtn = 'flex items-center justify-center w-full py-2 select-none '
const counterBtnDisabled = 'flex items-center justify-center w-full py-2 select-none cursor-not-allowed '
const mintImage = 'flex items-center justify-center w-full mb-4 overflow-hidden rounded-3xl '
const mintControls = 'flex flex-col w-full md:max-w-[50%]'
const spinner = 'w-5 h-5 rounded-full border-[3px] border-dark-800 border-b-[#2181e7] animate-spin'
const mintBtnEnabled =
  'rounded-md w-56 bg-pink hover:bg-gradient-to-r from-blue to-pink px-1 xxs:px-3 py-[5px] text-center select-none cursor-pointer ts-2 text-[20px] font-bold hover:text-white text-blue '
const mintBtnDisabled =
  'rounded-md w-56 bg-pink bg-opacity-30 px-1 xxs:px-3 py-[5px] text-center select-none cursor-not-allowed pointer-events-none ts-2 text-[20px] font-bold text-gray-400 '
const mintBtnNeutral =
  'rounded-md flex items-center justify-center bg-pink px-1 xxs:px-3 py-[5px] text-center select-none ts-2 text-[20px] font-bold text-blue '
const mintBtnSoldOut =
  'rounded-md w-56 bg-[#481f29f3] px-3 py-[5px] text-center select-none cursor-not-allowed pointer-events-none ts-2 text-[20px] font-bold text-red'
const counter =
  'flex border border-gray-500 rounded-lg cursor-pointer w-28 border-opacity-40 justify-evenly bg-dark-1000 '
const connectWalletBtn =
  'px-3 py-2 border w-56 ts-2 rounded-lg text-blue bg-[#a8c3dff1] border-[#a8c3dff1] hover:border-blue hover:bg-gradient-to-r from-blue to-pink hover:text-white font-bold tracking-tighter'
const btnContainer =
  'flex flex-wrap items-center justify-center w-full gap-4 px-1 py-4 mt-4 rounded-md xxs:py-4 xxs:px-4 bg-dark-900'

const MintControls = ({
  mintProgress,
  amountMinted,
  mintLimit,
  amountToMint,
  setAmountToMint,
  disabled,
  account,
  executeMint,
  soldOut,
  mintingEnded,
  maxMints,
  selectedOption,
  setSelectedOption,
  whitelistConfigs,
  now,
  setModalOpen,
}) => {
  const [timer, setTimer] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [config, setConfig] = useState(null)
  const [burn, setBurn] = useState(false)
  const [maxCanMint, setMaxCanMint] = useState(null) // max that this user can mint
  const { chainId } = useWeb3React()

  // find the maximum number that the counter can increase to
  useEffect(() => {
    let max = maxMints
    if (config !== null) {
      let stageMaxCanMint = config?.stageLimit ? config.stageLimit - config.stageMints : null
      let personalMaxCanMint = config?.limit ? config.limit.amount - config.stageMintsByUser : null
      if (stageMaxCanMint !== null) max = Math.min(max, stageMaxCanMint)
      if (personalMaxCanMint !== null) max = Math.min(max, personalMaxCanMint)
    }
    setMaxCanMint(max)
  }, [maxMints, config])

  useEffect(() => {
    console.log('maxCanMint: ', maxCanMint)
  }, [maxCanMint])

  useEffect(() => {
    // let max = config?.limit?.amount ? Math.min(config.limit.amount, maxMints) : maxMints
    // setMax(max)
    if (maxCanMint && amountToMint > maxCanMint) setAmountToMint(maxCanMint)
  }, [maxCanMint, amountToMint])

  useEffect(() => {
    console.log('selectedOption: ', selectedOption)
  }, [selectedOption])

  // check for next soonest eligible option or else leave config null
  const findBestEligibleConfig = () => {
    if (!whitelistConfigs) return null
    let eligibleConfig = null
    whitelistConfigs.map((cfg) => {
      if (
        cfg.eligible === true &&
        cfg.endDate > now &&
        (eligibleConfig === null || cfg.startDate < eligibleConfig.startDate)
      ) {
        eligibleConfig = cfg
      }
    })
    console.log('best config found: ', eligibleConfig?.optionName)
    return eligibleConfig
  }

  // when page loads no option has been selected - find best option
  // when a user explicitly selects an option and selectedOption is not null then set it as the config
  useEffect(() => {
    selectedOption === null
      ? setConfig(findBestEligibleConfig())
      : setConfig(whitelistConfigs.find((config) => config.optionName.toLowerCase() === selectedOption))
  }, [whitelistConfigs, selectedOption])

  // set the eligibile config as selected when it is past start time but before end time
  // unselect the config when its end date passes and unselect it as selected option
  useEffect(() => {
    if (config?.startDate < now && config?.endDate > now) {
      setSelectedOption(config.optionName.toLowerCase())
    } else if (config?.endDate < now) {
      setConfig(null)
      if (selectedOption === config.optionName.toLowerCase()) setSelectedOption(null)
    }
  }, [config, now, selectedOption])

  useEffect(() => {
    config?.burn ? setBurn(true) : setBurn(false)
  }, [config])

  useEffect(() => {
    config ? setTimer(getTimeRemaining(config.startDate, config.endDate)) : {}
  }, [config, now])

  const decreaseMintCount = () => {
    if (disabled) return
    if (+amountToMint <= 1) setAmountToMint(1)
    else setAmountToMint(amountToMint - 1)
  }

  const increaseMintCount = () => {
    if (disabled) return
    // let max = config?.limit?.amount ? Math.min(config.limit.amount, maxMints) : maxMints
    if (+amountToMint + 1 > maxCanMint) return
    setAmountToMint(+amountToMint + 1)
  }

  const updateAmountToMint = (amount) => {
    if (!(+amount >= 0)) setAmountToMint(1)
    else setAmountToMint(amount)
  }

  const handleBlur = () => {
    if (+amountToMint <= 0) setAmountToMint(1)
  }

  return (
    <div className={mintControls}>
      <div id="mint-image" style={{ aspectRatio: '1/1' }} className={mintImage}>
        <img src={SoulEater.src} alt={'alt-img'} className="w-full" />
      </div>
      {chainId === 137 && (
        <div id="controls" className="flex flex-col w-full ">
          <MintProgressStats mintProgress={mintProgress} amountMinted={amountMinted} mintLimit={mintLimit} />
          <div className={btnContainer}>
            <MintCounter
              disabled={disabled || maxCanMint === 0}
              decreaseMintCount={decreaseMintCount}
              increaseMintCount={increaseMintCount}
              amountToMint={amountToMint}
              mintLimit={config?.stageLimit ? config.stageLimit : mintLimit}
              amountMinted={config?.stageMints ? config.stageMints : amountMinted}
              updateAmountToMint={updateAmountToMint}
              handleBlur={handleBlur}
              max={maxCanMint}
            />
            <MintButton
              account={account}
              soldOut={soldOut}
              mintingEnded={mintingEnded}
              selectedOption={selectedOption}
              config={config}
              timer={timer}
              disabled={disabled || maxCanMint === 0}
              burn={burn}
              now={now}
              setModalOpen={setModalOpen}
              executeMint={executeMint}
              whitelistConfigs={whitelistConfigs}
            />
          </div>
          {config?.limit && (
            <div className="pt-2 text-xs text-center text-secondary">
              {config.stageMintsByUser > 0 && config.stageMintsByUser < config.limit.amount && (
                <>
                  <div id="limit-message">
                    {`You have minted ${config.stageMintsByUser}/${config.limit.amount} max mints per wallet at this stage`}
                  </div>
                  <div>{`This wallet can mint ${maxCanMint} more items`}</div>
                </>
              )}
              {config.stageMintsByUser === config.limit.amount && (
                <div className="text-pink">{`This wallet has minted ${config.limit.amount}/${config.limit.amount} max mints per wallet at this stage`}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const MintProgressStats = ({ mintProgress, amountMinted, mintLimit }) => {
  return (
    <>
      <div
        id="progress-stats"
        className={
          'flex justify-between w-full text-[14px] text-gray-400' + (amountMinted === null ? ' animate-pulse ' : '')
        }
      >
        <div>Total Minted</div>
        <div className="flex items-center gap-1">
          <div className="text-white ts-1">{mintProgress.toFixed(2)}%</div>
          <div>{'(' + (amountMinted || 0) + '/' + mintLimit + ')'}</div>
        </div>
      </div>
      <div id="progress-bar" className="flex justify-start w-full h-2 overflow-hidden rounded-md bg-[#202632]">
        <div id="progress" style={{ width: `${mintProgress}%` }} className="bg-[#2138e7] rounded-md" />
      </div>
    </>
  )
}

const MintCounter = ({
  disabled,
  decreaseMintCount,
  increaseMintCount,
  amountToMint,
  mintLimit,
  amountMinted,
  updateAmountToMint,
  handleBlur,
  max = null,
}) => {
  return (
    <div id="mint-counter" className={counter}>
      <div onClick={() => decreaseMintCount()} className={(disabled ? counterBtnDisabled : counterBtn) + ' pl-1 '}>
        <Minus size={16} color={disabled ? 'gray' : 'white'} />
      </div>
      <div id="counter-value" className="w-full py-2 text-center cursor-text">
        <Input
          value={amountToMint}
          onUserInput={updateAmountToMint}
          mode="integer"
          max={max !== null ? max : mintLimit - amountMinted || 1}
          placeholder=" "
          inputClass={'bg-dark-1000 text-center w-full ' + (disabled ? ' text-gray-500' : ' text-white')}
          containerClass=""
          onBlur={handleBlur}
          disabled={disabled}
        />
      </div>
      <div
        id="increase-btn"
        onClick={() => increaseMintCount()}
        className={(disabled ? counterBtnDisabled : counterBtn) + ' pr-1 '}
      >
        <Plus size={16} color={disabled ? 'gray' : 'white'} />
      </div>
    </div>
  )
}

const MintButton = ({
  account,
  soldOut,
  mintingEnded,
  selectedOption,
  config,
  timer,
  disabled,
  burn,
  now,
  setModalOpen,
  executeMint,
  whitelistConfigs,
}) => {
  return (
    <>
      {account && whitelistConfigs === null && (
        <div className={mintBtnDisabled + ' whitespace-nowrap animate-pulse'}>Loading Mint Data</div>
      )}
      {account && whitelistConfigs !== null && !soldOut && !mintingEnded && (
        <>
          {selectedOption === null && (
            <div className={mintBtnNeutral + (config ? ' h-10 w-72 ' : ' w-56 ')}>
              {!config && <>Private Mint</>}
              {config && (
                <div className="text-[16px] ts-5">
                  You can mint in:{' '}
                  <span className="ml-1 font-mono">
                    {timer.days}d {timer.hours}h {timer.minutes}m {timer.seconds}s
                  </span>
                </div>
              )}
            </div>
          )}
          {selectedOption !== null && (
            <div
              className={disabled ? mintBtnDisabled : mintBtnEnabled}
              onClick={() => (burn ? setModalOpen(true) : executeMint())}
            >
              {burn && <>Burn to Mint</>}
              {!burn && (
                <>
                  Mint{' '}
                  {config?.limit && config.limit.type === 'per-wallet' && (
                    <span className="tracking-tighter">({config.limit.amount} max)</span>
                  )}
                </>
              )}

              {config?.startDate > now && (
                <>
                  You can mint in: {timer.days}, {timer.hours}, {timer.minutes}, {timer.seconds}
                </>
              )}
            </div>
          )}
        </>
      )}
      {whitelistConfigs !== null && (soldOut || mintingEnded) && (
        <>
          {soldOut && <div className={mintBtnSoldOut}>SOLD OUT</div>}
          {!soldOut && mintingEnded && <div className={mintBtnSoldOut}>MINTING ENDED</div>}
        </>
      )}
    </>
  )
}

export default MintControls
