import { useState } from 'react'
import { Settings } from 'react-feather'
import { ArrowTooltipBordered as Tooltip } from '../../Tooltip'

const settingsIconStyle = ' text-indigo-300 hover:cursor-pointer hover:text-indigo-500 '
const settingsMenu = ' absolute right-[.25rem] py-2 border border-black rounded bg-dark-900 translate-y-[114%] '
const slippage = 'flex py-[6px] px-6 text-[15px]'
const inputStyle = ' w-12 pl-3 py-3 ml-3 bg-black rounded-md text-[.8rem] h-4 border border-dark-900 '
const percentDisplay =
  ' flex items-center justify-center bg-black rounded-md text-[.8rem] border border-dark-900 h-[26px] w-6 '
const tooltipContent = (
  <div className="text-center text-[0.9rem] max-w-[16rem]">
    DO NOT MESS WITH THIS UNLESS YOU UNDERSTAND EXACTLY WHAT YOU ARE DOING. YOU WILL LOSE FUNDS
  </div>
)

const CartSettings = () => {
  const [settingsVisible, setSettingsVisible] = useState(false)
  const [show, setShow] = useState(false)

  const toggleSettingsVisible = () => {
    setSettingsVisible(!settingsVisible)
  }

  return (
    <div id="settings" className="flex flex-col justify-end my-[6px] py-[5px]">
      <Settings size={17} className={settingsIconStyle} onClick={() => toggleSettingsVisible()} />
      {settingsVisible && (
        <div id="settings-menu" className={settingsMenu}>
          <Tooltip content={tooltipContent} show={show} placement="bottom">
            <div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)} className={slippage}>
              slippage
              <input type="text" placeholder="0" className={inputStyle}></input>
              <div className={percentDisplay}>%</div>
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  )
}

export default CartSettings
