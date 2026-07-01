import { Menu, Transition } from '@headlessui/react'
import EthereumIcon from '../../../../public/icons/EthereumIconSvg'
import MaticIcon from '../../../../public/icons/MaticIconSvg'
import useNetworkSwitcher from '../../../hooks/useNetworkSwitcher'
import { ChevronDown } from 'react-feather'

const ETH = 1
const BSC = 56
const MATIC = 137
const CHAINS = [BSC]

const menuItem = 'flex items-center hover:bg-dark-800 py-2 pl-4 pr-6 rounded-md cursor-pointer mx-6'
const iconContainer = 'flex items-center justify-center w-5'
const activeItem = 'bg-dark-700 text-gray-400'
const heading = 'w-full py-3 mb-2 font-bold text-center border-b border-dark-1000 ts-3 text-pink'
const chevronStyle = 'pt-[2px] hidden xxs:block'
const networkSwitch =
  'flex items-center h-10 px-1 xs:px-3 py-2 text-sm font-bold border-2 rounded whitespace-nowrap border-dark-900 bg-dark-1000'

const NetworkSwitch = ({ chainId }) => {
  const { switchToSmartChain: switchTo } = useNetworkSwitcher()

  const isActive = (networkId) => {
    return chainId === networkId
  }

  return (
    <Menu>
      <div className={'relative flex items-center justify-center'}>
        <Menu.Button>
          <div id="network-switch-container" className="flex items-center text-secondary hover:text-white ">
            <div id="network-switch" className={networkSwitch}>
              {CHAINS.includes(chainId) && (
                <>
                  {chainId === ETH && (
                    <>
                      <EthereumIcon width={20} height={20} />
                      <div className="hidden ml-2 xs:block">Ethereum</div>
                    </>
                  )}
                  {chainId === BSC && (
                    <>
                      <img src={'/images/tokens/bnb-icon.png'} width={18} height={18} />
                      <div className="hidden ml-2 xs:block">Binance</div>
                    </>
                  )}
                  {chainId === MATIC && (
                    <>
                      <MaticIcon size={20} />
                      <div className="hidden ml-2 xs:block">Polygon</div>
                    </>
                  )}
                </>
              )}
              {!CHAINS.includes(chainId) && 'Unsupported Network'}
              <ChevronDown className={chevronStyle} width={16} height={20} strokeWidth={3} />
            </div>
          </div>
        </Menu.Button>
        <Transition
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
          className={'absolute top-[107%] pb-6 z-50 bg-dark-900 rounded-lg overflow-hidden'}
        >
          <Menu.Items className={'flex flex-col gap-2 '}>
            <div className={heading}>Switch Networks</div>
            <Menu.Item>
              {({ active }) => (
                <div className={`${isActive(ETH) && activeItem} ` + menuItem} onClick={() => switchTo(ETH)}>
                  <div className={iconContainer}>
                    <EthereumIcon width={20} height={20} className={iconContainer} />
                  </div>

                  <div className="ml-2 ts-1">Ethereum</div>
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div className={`${isActive(BSC) && activeItem} ` + menuItem} onClick={() => switchTo(BSC)}>
                  <div className={iconContainer}>
                    <img src={'/images/tokens/bnb-icon.png'} width={18} height={18} />
                  </div>
                  <div className="ml-2 ts-1">Binance</div>
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div className={`${isActive(MATIC) && activeItem} ` + menuItem} onClick={() => switchTo(MATIC)}>
                  <div className={iconContainer}>
                    <MaticIcon size={20} className={iconContainer} />
                  </div>

                  <div className="ml-2 ts-1">Polygon</div>
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  )
}

export default NetworkSwitch
