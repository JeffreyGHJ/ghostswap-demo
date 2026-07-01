import { useRef, useState } from 'react'
import { RefreshCcw } from 'react-feather'
import { LoadingSpinner } from '../LoadingSpinner'
import BigNumber from 'bignumber.js'
import { useActiveWeb3React } from '../../../hooks'
import SimpleNftCard from '../../NftCard/SimpleNftCard'
import LoadingSquares from '../LoadingSquares'
import Badge from '../../Badge'

export const PAGE_SIZE = 3
export const DEFAULT_PAGE: [number, number] = [3, 0]

export const StakedTokens = (props) => {
  const { account } = useActiveWeb3React()
  const [allSelected, setAllSelected] = useState(false)
  const [stakedSelected, setStakedSelected] = useState([])

  const toggleNftSelected = (id) => {
    if (stakedSelected.includes(id)) {
      let selection = [...stakedSelected]
      selection.splice(selection.indexOf(id), 1)
      setStakedSelected(selection)
      setAllSelected(false)
    } else {
      setStakedSelected(stakedSelected.concat([id]))
    }
  }

  const toggleAllSelected = () => {
    setAllSelected(!allSelected)
  }

  const [pageNum, setPageNum] = useState<[number, number]>(DEFAULT_PAGE)
  const ref = useRef<HTMLDivElement | null>(null)

  const rewardDistributorData = {
    data: {},
  }
  const rewards = {
    data: {
      claimableRewards: new BigNumber(0),
    },
  }
  const handleUnstake = {
    isLoading: true,
  }
  const handleClaimRewards = {
    isLoading: true,
  }

  // @ts-ignore
  return (
    <div className="p-10 text-gray-200 border-2 border-gray-800 rounded-xl bg-opacity-5 bg-dark-900">
      <div className="flex flex-row items-center justify-between mb-5">
        <div className="flex flex-row mt-2">
          <div className="flex gap-2 mr-3 text-lg">
            View Staked Tokens <Badge color="green">{props.stakedTokens.length}</Badge>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center cursor-pointer text-[#8d8b9b]">
          <RefreshCcw size={16} />
        </div>
      </div>
      <div className="flex-auto my-3 overflow-auto">
        <div
          className="relative my-auto mb-4 h-[60vh] overflow-y-auto overflow-x-hidden rounded-md bg-dark-800 bg-opacity-5 p-5"
          ref={ref}
          onScroll={() => {
            if (ref.current) {
              const { scrollTop, scrollHeight, clientHeight } = ref.current
              if (scrollHeight - scrollTop <= clientHeight * 1.1) {
                setPageNum(([n, prevScrollHeight]) => {
                  return prevScrollHeight !== scrollHeight ? [n + 1, scrollHeight] : [n, prevScrollHeight]
                })
              }
            }
          }}
        >
          {!account ? (
            <LoadingSquares />
          ) : props.stakedTokens.length === 0 ? (
            <p className="font-normal text-gray-400 opacity-50">No tokens currently staked.</p>
          ) : (
            <div
              style={{ gridTemplateColumns: 'repeat(auto-fill, 10.5rem)' }}
              className={'grid gap-1 items-center justify-center'}
            >
              {props.stakedTokens.map((id, index) => (
                <SimpleNftCard
                  address={account}
                  name={'LittleGhosts'}
                  key={index}
                  id={id}
                  mode={'staking'}
                  size={'medium'}
                  toggleNftSelected={toggleNftSelected}
                  selectedNfts={stakedSelected}
                  // loadingClaim={() => {}}
                  // loadingUnstake={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row-reverse flex-wrap justify-between gap-5 mt-2">
        <div className="flex flex-wrap gap-5">
          <button
            onClick={() => {
              if (stakedSelected.length === 0) {
                console.log('error: no tokens selected')
              } else {
                props.handleUnstakeTokens(stakedSelected)
                setStakedSelected([])
                setAllSelected(false)
              }
            }}
            className="my-auto flex rounded-md px-4 py-2 items-center bg-cyan-blue bg-opacity-40 hover:scale-[1.03]"
          >
            <span className="inline-block mr-1">
              {handleUnstake.isLoading && <LoadingSpinner fill={'#FFF'} height="20px" />}
            </span>
            <span className="my-auto">Unstake ({stakedSelected.length})</span>
          </button>

          {!allSelected && (
            <button
              onClick={() => {
                setStakedSelected([...props.stakedTokens])
                toggleAllSelected()
              }}
              className="my-auto flex cursor-pointer rounded-md px-4 py-2 bg-cyan-blue bg-opacity-40 hover:scale-[1.03]"
            >
              <span className="my-auto">Select All</span>
            </button>
          )}
          {allSelected && (
            <button
              onClick={() => {
                setStakedSelected([])
                toggleAllSelected()
              }}
              className="my-auto flex cursor-pointer rounded-md px-4 py-2 bg-cyan-blue bg-opacity-40 hover:scale-[1.03]"
            >
              <span className="my-auto">Deselect All</span>
            </button>
          )}
        </div>
        <div className="flex gap-5">
          {rewardDistributorData.data && rewards.data?.claimableRewards.isGreaterThan(new BigNumber(0)) && (
            <button
              // onClick={() => {
              //   if (stakedSelected.length === 0) {
              //     console.log("error: no tokens selected")
              //   } else {
              //     handleClaimRewards.mutate({
              //       tokenDatas: stakedSelected,
              //     })
              //   }
              // }}
              // disabled={!rewards.data?.claimableRewards.gt(new BN(0))}
              className="my-auto flex rounded-md px-4 py-2 hover:scale-[1.03]"
            >
              <span className="inline-block mr-1">
                {handleClaimRewards.isLoading && <LoadingSpinner fill={'#FFF'} height="20px" />}
              </span>
              <span className="my-auto">Claim Rewards ({stakedSelected.length})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
