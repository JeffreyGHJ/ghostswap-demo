import Link from 'next/link'
import AddressHolder from '../../AddressHolder'
import IdenticonImage from '../../IdenticonImage'
import nftIcon from '../../../../public/nft.png'
import { useEffect, useState } from 'react'
import MaticIcon from '../../../../public/icons/MaticIconSvg'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { MintReserveChart } from '../../Charts/MintReserveChart'

const poolAddress = '0x696586e5a22519571411c6774d76efa92a1c1f88'

const MintReserves = () => {
  const [nftBalance, setNftBalance] = useState(0)
  const [tokenBalance, setTokenBalance] = useState(0)

  useEffect(() => {
    setNftBalance(0)
    setTokenBalance(0)
  }, [])

  return (
    <div id="mint-reserves" className="flex flex-col w-full md:max-w-[50%] pb-10">
      <div id="collection-title" className="text-[58px] font-bold ts-3 tracking-tight leading-[1] mb-10">
        Mint Reserves
      </div>

      <div id="reserve-stats" className="flex flex-wrap w-full gap-2 mb-8 select-none text-pink">
        <div id="stat-badge" className="px-6 py-3 rounded-full text-[.9rem] ts-[.02rem] bg-dark-900">
          Nfts Bought: 0
        </div>
        <div id="stat-badge" className="px-6 py-3 rounded-full text-[.9rem] ts-[.02rem] bg-dark-900">
          Nfts Sold: 0
        </div>
        <div
          id="stat-badge"
          className="flex items-center gap-2 px-6 py-3 rounded-full text-[.9rem] ts-[.02rem] bg-dark-900"
        >
          Fees: <MaticIcon width={14} height={14} />0
        </div>
        <div
          id="stat-badge"
          className="flex items-center gap-2 px-6 py-3 rounded-full text-[.9rem] ts-[.02rem] bg-dark-900"
        >
          Volume: <MaticIcon width={14} height={14} />0
        </div>
      </div>

      <div
        id="nft-balance"
        className="flex flex-wrap mb-2 text-pink items-center px-5 py-3 bg-dark-1000 border rounded-md border-[#2181e722]"
      >
        <div className="text-[24px] ts-3 w-full mb-2 opacity-75">Nft Balance</div>
        <img src={nftIcon.src} width={56} />
        <div className="text-[36px] tracking-tight ts-4 font-bold ml-2">{nftBalance}</div>
      </div>
      <div
        id="nft-balance-chart"
        className="relative h-[16rem] w-full flex-wrap text-pink items-center border mb-8 bg-dark-900 rounded-md border-[#2181e722]"
      >
        <div className="absolute w-full h-full">
          <MintReserveChart amount={0} spotPrices={[600, 569, 420, 487, 321, 401, 592, 678, 520, nftBalance]} />
        </div>
      </div>

      <div
        id="token-balance"
        className="flex flex-wrap mb-2 text-pink items-center px-5 py-3 border rounded-md bg-dark-1000 border-[#2181e722]"
      >
        <div className="text-[24px] ts-3 w-full mb-2 opacity-75">Token Balance</div>
        <MaticIcon width={56} height={56} />
        <div className="text-[36px] tracking-tight ts-4 font-bold ml-2">
          {(+tokenBalance.toFixed(2)).toLocaleString()}
        </div>
      </div>
      <div
        id="token-balance-chart"
        className="relative h-[16rem] w-full flex-wrap text-pink items-center border mb-8 bg-dark-900 rounded-md border-[#2181e722]"
      >
        <div className="absolute w-full h-full">
          <MintReserveChart
            amount={0}
            spotPrices={[tokenBalance * 0.8, 1145, 1378, 1211, 1809, 1732, 1098, 886, 1088, tokenBalance]}
          />
        </div>
      </div>

      {/* <MintReservesAddress poolAddress={poolAddress} /> */}
    </div>
  )
}

const MintReservesAddress = ({ poolAddress }) => {
  const { width } = useWindowSize()

  return (
    <div
      id="reserves-address"
      className="flex flex-wrap items-center justify-between px-1 mb-8 rounded-md py-1 border border-[#2181e722]"
    >
      <div className={'text-[14px] text-pink ts-1 w-24'}>Pool Address:</div>
      <div className="flex items-center">
        <IdenticonImage address={poolAddress} />
        <div className="flex items-center ml-1">
          <AddressHolder
            address={poolAddress}
            containerStyle="flex items-center"
            addressContainerStyle="flex items-center pr-1"
            addressStyle="ts-3 text-[14px] text-pink font-mono pr-2"
            externalLinkStyle="hidden"
            short={(width < 920 && width > 768) || width < 460}
          />
          <Link
            href={{
              pathname: `/pools/view/${poolAddress}`,
            }}
          >
            <img src="/logo.png" width={20} height={20} className="cursor-pointer" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MintReserves
