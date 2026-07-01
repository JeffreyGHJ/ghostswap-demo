import { useState } from 'react'
import { ArrowTooltipFlat as Tooltip } from '../../Tooltip'

const button =
  ' px-2 border border-[#0d111c] rounded-[.25rem] bg-dark-800 tracking-tight text-[.8125rem] leading-[1.75] ts-5 select-none '
const buttonEnabled = ' text-white cursor-pointer hover:border-dark-700 hover:bg-[#222536] '
const buttonDisabled = ' text-gray-400 cursor-default '

const message = 'Must be owner to edit liquidity'
const tooltipText = 'text-[.8rem] text-white'
const tooltipBg = 'bg-[#302b46]'

const Button = ({ enabled, children, ...props }) => {
  const [show, setShow] = useState(false)

  return (
    <Tooltip show={show} content={message} textStyle={tooltipText} backgroundColor={tooltipBg}>
      <div
        className={button + (enabled ? buttonEnabled : buttonDisabled)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={enabled ? props.onClick : null}
      >
        {children}
      </div>
    </Tooltip>
  )
}

export default Button
