import Link from 'next/link'
import { useRouter } from 'next/router'
import { transparentize } from 'polished'

const StakingPoolsListView = (props) => {
  const router = useRouter()

  return (
    <div className="w-full p-4 overflow-hidden border rounded-xl border-[rgba(221,218,218,0.2)]">
      <div className="flex flex-col w-full min-w-fit">
        <div className="flex w-full gap-4 px-8 py-2 rounded-xl bg-dark-500">
          <div className="flex-1">Image</div>
          <div className="flex-[4]">Collection</div>
          <div className="justify-end flex-1 text-right">Total Staked</div>
          <div className="justify-end flex-1 text-right">Percent Staked</div>
        </div>
        <div className="flex flex-col">
          {props.stakePools.map((pool, index) => (
            <StakePoolListItem {...pool} key={index} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

const StakePoolListItem = (props) => {
  const router = useRouter()
  return (
    <Link href={{ pathname: router.pathname + `/1234` }}>
      <div
        style={{ borderTop: props.index === 0 ? '' : '1px solid rgba(221,218,218,0.2)' }}
        className="flex w-full gap-4 px-8 py-4 cursor-pointer md:flex-row hover:bg-gray-900"
        onClick={() => console.log('clicked')}
      >
        <div className="flex items-center flex-1">
          <div className="flex items-center gap-5 md:flex-row">
            <img
              className="my-auto h-full max-h-[50px] min-w-[50px] max-w-[150px] rounded-xl p-2"
              src={props.avatar}
              alt={'staking pool collection image'}
            />
          </div>
        </div>
        <div className="flex h-[50px] flex-[4] items-center">{props.name}</div>
        <div className="flex items-center justify-end flex-1">{props.totalStaked || '-'}</div>
        <div className="flex items-center justify-end flex-1">
          {((props.totalStaked / props.totalSupply) * 100).toFixed(2) + '%' || '-'}
        </div>
      </div>
    </Link>
  )
}

export default StakingPoolsListView
