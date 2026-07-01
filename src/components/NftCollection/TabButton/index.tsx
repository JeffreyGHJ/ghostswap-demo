import { Tab } from '@headlessui/react'
import Badge from '../../Badge'

const btnContainer = 'relative text-[16px] sm:text-[18px] ts-3 tracking-tight w-[10rem] '
const button = 'flex items-center justify-center whitespace-nowrap gap-1 sm:gap-2'
const active = ' absolute h-[3px] w-full bg-blue '

const TabButton = ({ text, index, tabIndex, badgeValue = null }) => {
  return (
    <Tab className={btnContainer}>
      <div className={button}>
        {text} {badgeValue && <Badge color="blue">{badgeValue || 0}</Badge>}
      </div>
      {tabIndex === index && <div className={active} />}
    </Tab>
  )
}

export default TabButton
