import Link from 'next/link'
import PoolCardAddressInfo from './PoolCardAddressInfo'
import PoolCardDetails from './PoolCardDetails'
import PoolCardHeader from './PoolCardHeader'

const poolCardClass =
  'w-full pb-4 px-4 bg-gray-900 hover:bg-[#0e1420] border border-dark-700 rounded leading-[1.5] tracking-[-0.02em] cursor-pointer ts-[thin] '

const PoolCard = (props) => {
  return (
    <Link
      href={
        props.link === true
          ? {
              pathname: `/pools/view/[address]`,
              query: {
                address: props.poolAddress,
              },
            }
          : {}
      }
    >
      <div id="pool-card" className={poolCardClass + (props.link === true ? 'cursor-pointer' : 'pointer-events-none')}>
        <PoolCardHeader details={props.details} {...props} />
        <PoolCardDetails details={props.details} {...props} />
        <PoolCardAddressInfo poolAddress={props.poolAddress} owner={props.owner} />
      </div>
    </Link>
  )
}

export default PoolCard
