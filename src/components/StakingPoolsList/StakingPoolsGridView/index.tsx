import Link from 'next/link'
import { useRouter } from 'next/router'

const StakingPoolsGridView = (props) => {
  return (
    <div id="stake-pool-grid" className="grid flex-wrap grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {props.stakePools.map((pool, index) => (
        <StakePoolGridCard
          id={`stake-pool-grid-card-${index}`}
          key={index}
          className="transition-colors cursor-pointer"
          onClick={() => console.log('click')}
          {...pool}
        ></StakePoolGridCard>
      ))}
    </div>
  )
}

const StakePoolGridCard = (props) => {
  const router = useRouter()
  return (
    <Link
      href={{
        pathname: `/stake/pool/[id]`,
        query: {
          id: props._id,
        },
      }}
    >
      <div className="cursor-pointer transition-colors relative flex flex-col gap-2 rounded-lg border-[1px] border-[rgba(221,218,218,0.2)] bg-gray-900 px-4 pt-6 pb-8 hover:bg-dark-900">
        <div style={{ aspectRatio: '1 / 1' }} className="flex items-center justify-center overflow-hidden rounded-xl">
          <img src={props.avatar} alt={`${props.name} avatar`} />
        </div>

        <div id="header" className="flex flex-col gap-2 text-[18px]">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[22px] py-1">{props.name}</div>
          <Stats
            stats={[
              {
                header: 'Total Staked',
                value: props.totalStaked.toLocaleString() || '-',
              },
              {
                header: 'Percent Staked',
                value: ((props.totalStaked / props.totalSupply) * 100).toFixed(2) + '%' || '-',
              },
            ]}
          />
        </div>
      </div>
    </Link>
  )
}

const Stats = ({ stats }: { stats: { header: string; value: string | JSX.Element }[] }) => {
  return (
    <div className="flex w-full py-2 bg-black rounded-lg justify-evenly">
      {stats?.map((stat, i) => (
        <div key={stat.header} className="flex justify-center w-full">
          <div className={`flex w-full flex-col items-center text-medium-4`}>
            <div className="text-[rgb(109,108,124)]">{stat.header}</div>
            <div className="text-white">{stat.value}</div>
          </div>
          {i < stats.length - 1 && <div className="h-full w-[2px] bg-[rgba(221,218,218,0.2)]"></div>}
        </div>
      ))}
    </div>
  )
}

export default StakingPoolsGridView
