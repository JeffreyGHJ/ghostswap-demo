import {
  MouseoverArrowTooltipBordered as Tooltip,
  MouseoverArrowTooltipBordered as TooltipBordered,
} from '../../Tooltip'

const OptionTimer = ({ startDate, endDate, started, ended, timer, setHideOuter }) => {
  return (
    <>
      {ended && (
        <div
          className="flex flex-wrap items-center justify-center w-full md:w-[unset] gap-2 mt-4 md:mt-0"
          onMouseEnter={() => setHideOuter(true)}
          onMouseLeave={() => setHideOuter(false)}
        >
          <TooltipBordered
            placement="top"
            content={`Ended on: ${endDate.toDateString()}, ${endDate.toLocaleTimeString()}`}
          >
            <div className="ts-4 cursor-default tracking-tighter text-[14px] h-[32px] leading-[32px] text-[#7990a1c2] whitespace-nowrap">
              ENDED
            </div>
          </TooltipBordered>
        </div>
      )}
      {!ended && (
        <div
          id="option-timer"
          className="flex items-center justify-center gap-2 mx-auto mt-4 cursor-default w-fit flex-grow-1 md:mt-0"
          onMouseEnter={() => setHideOuter(true)}
          onMouseLeave={() => setHideOuter(false)}
        >
          <Tooltip
            placement="top"
            content={
              !started
                ? `Start Date: ${startDate.toDateString()}, ${startDate.toLocaleTimeString()}`
                : `End Date: ${endDate.toDateString()}, ${endDate.toLocaleTimeString()}`
            }
          >
            <div className="ts-4 tracking-tighter text-[14px] text-[#2181e7] whitespace-nowrap">
              {!started ? 'STARTS IN' : 'ENDS IN'}
            </div>
          </Tooltip>
          <div id="timer" className="flex gap-1 text-center leading-[32px] font-mono ">
            <Tooltip placement="top" content={'Days'}>
              <div id="days" className="w-8 h-8  rounded-[4px] bg-dark-800">
                {timer.days.toString().length === 1 ? '0' + timer.days : timer.days}
              </div>
            </Tooltip>
            <Tooltip placement="top" content={'Hours'}>
              <div id="hours" className="w-8 h-8 rounded-[4px] bg-dark-800">
                {timer.hours.toString().length === 1 ? '0' + timer.hours : timer.hours}
              </div>
            </Tooltip>
            <Tooltip placement="top" content={'Minutes'}>
              <div id="minutes" className="w-8 h-8 rounded-[4px] bg-dark-800">
                {timer.minutes.toString().length === 1 ? '0' + timer.minutes : timer.minutes}
              </div>
            </Tooltip>
            <Tooltip placement="top" content={'Seconds'}>
              <div id="seconds" className="w-8 h-8 rounded-[4px] bg-dark-800">
                {timer.seconds.toString().length === 1 ? '0' + timer.seconds : timer.seconds}
              </div>
            </Tooltip>
          </div>
        </div>
      )}
    </>
  )
}

export default OptionTimer
