import React from 'react'
import { classNames } from '../../functions/styling'

const defaultContainer = 'flex flex-1 flex-col lg:flex-row justify-between pb-2 px-3'

const LEFT_PANE = (split, showLeft, showRight) => {
  if (split === 'left') return 'w-full ' + (!showLeft ? 'hidden ' : '') + (showRight ? 'lg:w-1/4 ' : '')
  if (split === 'right') return 'w-full ' + (!showLeft ? 'hidden ' : '') + (showRight ? 'lg:w-3/4 ' : '')
  return 'w-full  ' + (!showLeft ? 'hidden ' : '') + (showRight ? 'lg:w-1/2 ' : '') // default style
}

const RIGHT_PANE = (split, showLeft, showRight) => {
  if (split === 'left') return 'w-full ' + (showLeft ? 'lg:w-3/4 ' : '') + (showRight ? '' : 'hidden ')
  if (split === 'right') return 'w-full ' + (showLeft ? 'lg:w-1/4 ' : '') + (showRight ? '' : 'hidden ')
  return ' w-full ' + (showLeft ? 'w-1/2 ' : '') + (showRight ? '' : 'hidden ') // default style
}

export default function SplitPane({
  left,
  right,
  split = 'default',
  container = defaultContainer,
  rightStyles = '',
  leftStyles = '',
  showLeft = true,
  showRight = true,
}) {
  return (
    <div id="split-pane" className={container}>
      <div id="left-pane" className={classNames(LEFT_PANE(split, showLeft, showRight), leftStyles)}>
        {left}
      </div>
      <div id="right-pane" className={classNames(RIGHT_PANE(split, showLeft, showRight), rightStyles)}>
        {right}
      </div>
    </div>
  )
}
