import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { MouseoverArrowTooltipFlat as TooltipFlat, ArrowTooltipFlat as Tooltip } from '../../Tooltip'
import OptionTimer from '../OptionTimer'
import MaticIcon from '../../../../public/icons/MaticIconSvg'
import { getTimeRemaining } from '../functions'

const WhitelistOption = ({
  optionName,
  eligible,
  endDate,
  startDate,
  account,
  now,
  setSelectedOption,
  selectedOption = null,
  limit = null,
  stageLimit = null,
  price = null,
  tags = null,
  eligibleDescriptor = null,
  whitelist = null,
  burn = null,
  stageMints,
}) => {
  const [showDesc, setShowDesc] = useState(false)
  const [timer, setTimer] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [ended, setEnded] = useState(endDate - Date.now() <= 0)
  const [started, setStarted] = useState(startDate < Date.now())
  const [hideOuter, setHideOuter] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const [stageMintProgress, setStageMintProgress] = useState(0)

  const getStageMintProgress = () => {
    let randomAmountMinted = Math.random() * stageLimit
    return randomAmountMinted
  }

  useEffect(() => {
    if (stageLimit !== null && stageMints !== null) setStageMintProgress(getStageMintProgress())
  }, [stageLimit])

  // each time 'now' gets updated (once per second) we update the time on the timer
  useEffect(() => {
    setTimer(getTimeRemaining(startDate, endDate))
    setEnded(endDate < now)
    setStarted(startDate < now)
  }, [now])

  useEffect(() => {
    setIsSelected(selectedOption === optionName.toLowerCase())
  }, [optionName, selectedOption])

  //   useEffect(() => {
  //     console.log('started: ', started)
  //     if (started && !ended && eligible && selectedOption === null) setSelectedOption(optionName.toLowerCase())
  //   }, [started])

  //   useEffect(() => {
  //     console.log('ended: ', ended)
  //     if (ended && selectedOption === optionName.toLowerCase()) setSelectedOption(null)
  //   }, [ended])

  if (eligible && !tags.includes('Eligible')) tags.unshift('Eligible')
  else if (!eligible && tags.includes('Eligible')) tags.splice(tags.indexOf('Eligible'), 1)

  const handleOptionSelected = () => {
    if (eligible && started && !ended) setSelectedOption(optionName.toLowerCase())
  }

  const optionDescription = (
    <div className="w-[24rem] px-2 pb-2 pt-1 tracking-tight">
      <div id="header" className="pb-1 font-bold text-center text-pink">
        {optionName}
      </div>
      <div id="body" className="flex flex-col text-white ts-3">
        <div>
          The '{optionName}' stage of the launch {startDate > now ? 'starts' : 'started'} at {startDate.toDateString()},{' '}
          {startDate.toLocaleTimeString()} and {endDate > now ? 'ends' : 'ended'} at {endDate.toDateString()},{' '}
          {endDate.toLocaleTimeString()}.
        </div>
        {eligibleDescriptor && (
          <div>
            {eligibleDescriptor} {endDate > now ? 'are' : 'were'} eligible to participate in this stage.
          </div>
        )}
        {whitelist && (
          <div>
            This stage {endDate > now ? 'is' : 'was'} private and {endDate > now ? 'has' : 'had'} a whitelist size of{' '}
            {whitelist} wallets.
          </div>
        )}
        {stageLimit !== null && stageLimit > 0 && (
          <div>
            This stage {endDate > now ? 'has' : 'had'} a global limit of {stageLimit} mints.
          </div>
        )}
        {limit !== null && limit > 0 && (
          <div>
            This stage {endDate > now ? 'has' : 'had'} a limit of {limit.amount} mints {limit.type.split('-').join(' ')}
            .
          </div>
        )}
        <div className="flex items-center gap-1">
          The price per mint {endDate > now ? 'is' : 'was'}
          {price.token === 'MATIC' ? (
            <>
              <MaticIcon /> {price.amount.toFixed(price.sigfigs)}
            </>
          ) : (
            <> {price.amount} LittleGhost NFTs</>
          )}
          .
        </div>
        {burn && <div>The NFTs paid {endDate > now ? 'are' : 'were'} permanently burned.</div>}
      </div>
    </div>
  )

  return (
    <Tooltip show={optionDescription && showDesc && !hideOuter} content={optionDescription} placement="top">
      <div
        id="whitelist-option"
        className={
          'flex flex-col rounded border p-3 gap-6 hover:bg-indigo-800 hover:bg-opacity-[15%] ' +
          (eligible && started && !ended ? ' border-[#2181e7] cursor-pointer ' : ' border-[#2181e722] ') +
          (isSelected && !ended ? ' border-2 border-[#218bfd] cursor-pointer ' : ' m-[1px] ')
        }
        onClick={() => handleOptionSelected()}
        onMouseEnter={() => (optionDescription ? setShowDesc(true) : {})}
        onMouseLeave={() => setShowDesc(false)}
      >
        <div id="option-header" className="flex flex-wrap items-center justify-between gap-6">
          <div id="eligibility" className="flex flex-grow-[99] items-center mr-auto">
            {account !== null && (
              <>
                {eligible && (
                  <TooltipFlat placement="top" content={'Your current wallet CAN mint during this stage.'}>
                    <LockOpenIcon
                      width={24}
                      height={16}
                      color="#2181e7"
                      onMouseEnter={() => setHideOuter(true)}
                      onMouseLeave={() => setHideOuter(false)}
                    />
                  </TooltipFlat>
                )}
                {!eligible && (
                  <TooltipFlat placement="top" content={'Your current wallet can NOT mint during this stage.'}>
                    <LockClosedIcon
                      width={24}
                      height={16}
                      color="#d1c7f9c2"
                      onMouseEnter={() => setHideOuter(true)}
                      onMouseLeave={() => setHideOuter(false)}
                    />
                  </TooltipFlat>
                )}
              </>
            )}
            <div className="flex gap-1">
              {tags?.map((tag, index) => {
                return (
                  <div className="rounded-full text-[12px] px-2 py-[2px] bg-dark-800 whitespace-nowrap" key={index}>
                    {tag}
                  </div>
                )
              })}
            </div>
          </div>

          <OptionTimer
            startDate={startDate}
            endDate={endDate}
            started={started}
            ended={ended}
            timer={timer}
            setHideOuter={setHideOuter}
          />
        </div>
        <div id="option-footer" className="flex flex-col text-[14px] tracking-tight gap-3">
          <div className="flex">
            {limit && (
              <span className="mr-1">
                {limit.type === 'per-transaction' && (
                  <>
                    MAX <b>{limit.amount}</b> AT A TIME <b>•</b>
                  </>
                )}
                {limit.type === 'per-wallet' && (
                  <>
                    <b>{limit.amount}</b> PER WALLET <b>•</b>
                  </>
                )}
              </span>
            )}
            {price && (
              <div id="price" className="flex items-center gap-[6px]">
                <div>Price</div>
                <div className="flex items-center gap-x-1">
                  {price.token === 'LittleGhosts' ? (
                    <>
                      <b>{price.amount}</b> <div>LittleGhosts</div>
                    </>
                  ) : (
                    <>
                      <MaticIcon /> {price.amount.toFixed(price.sigfigs)}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          {stageLimit !== null && stageLimit > 0 && (
            <div id="mint-stage-progress">
              <div id="progress-bar" className="flex justify-start w-full h-[6px] rounded-md bg-[#202632]">
                <div
                  id="progress"
                  style={{ width: `${((stageMints || 0) / stageLimit) * 100}%` }}
                  className="bg-[#2138e7] rounded-md border border-[#2138e7]"
                />
              </div>
              <div className="text-[14px] mt-[2px] flex justify-between text-pink">
                Minted during stage
                <div>
                  <b className="ts-3">{(((stageMints || 0) / stageLimit) * 100).toFixed(2)}% </b>({stageMints || 0}/
                  {stageLimit})
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Tooltip>
  )
}

export default WhitelistOption
