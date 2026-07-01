import { useEffect, useRef, useState } from 'react'
import { RefreshCcw, RefreshCw } from 'react-feather'
import { useActiveWeb3React } from '../../../hooks'
import Badge from '../../Badge'
import SimpleNftCard from '../../NftCard/SimpleNftCard'
import { LoadingSpinner } from '../LoadingSpinner'
import LoadingSquares from '../LoadingSquares'

export const PAGE_SIZE = 3
export const DEFAULT_PAGE: [number, number] = [3, 0]

export const UnstakedTokens = (props) => {
  const { account } = useActiveWeb3React()
  const [allSelected, setAllSelected] = useState(false)
  const [unstakedSelected, setUnstakedSelected] = useState([])
  const [animating, setAnimating] = useState(false)

  const toggleNftSelected = (id) => {
    if (unstakedSelected.includes(id)) {
      let selection = [...unstakedSelected]
      selection.splice(selection.indexOf(id), 1)
      setUnstakedSelected(selection)
      setAllSelected(false)
    } else {
      setUnstakedSelected(unstakedSelected.concat([id]))
    }
  }

  const toggleAllSelected = () => {
    setAllSelected(!allSelected)
  }

  const animate = () => {
    setAnimating(true)
    setTimeout(() => {
      setAnimating(false)
    }, 1500)
  }

  // execute staking on selected tokens
  const handleStake = {
    isLoading: true,
    tokenDatas: [],
    // receiptType,
  }

  // -------- Might not use --------------------------------------------------
  const [pageNum, setPageNum] = useState<[number, number]>(DEFAULT_PAGE)
  const ref = useRef<HTMLDivElement | null>(null)

  return (
    <div className="flex-col p-10 text-gray-200 border-2 border-gray-800 bg-dark-900 rounded-xl bg-opacity-5">
      <div className="flex flex-row items-center justify-between w-full mt-2">
        <div className="flex gap-2 mb-3 mr-3 text-lg">
          Select Your Tokens<Badge color="cyan">{props.unstakedTokens.length}</Badge>
        </div>
        <div className="flex flex-row items-center justify-center">
          <div
            className={'flex items-center cursor-pointer gap-1 px-3 text-[#8d8b9b] text-[12px] '}
            onClick={() => {
              props.generateNewIds()
              animate()
            }}
          >
            loading{' '}
            <div className={animating ? ' ani animate-spin' : ''}>
              <RefreshCw size={16} />
            </div>
          </div>
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
          ) : props.unstakedTokens.length === 0 ? (
            <p className="font-normal text-gray-400">No allowed tokens found in wallet.</p>
          ) : (
            <div
              style={{ gridTemplateColumns: 'repeat(auto-fill, 10.5rem)' }}
              className={'grid gap-1 items-center justify-center'}
            >
              {props.unstakedTokens.map((id, index) => (
                <SimpleNftCard
                  address={account}
                  name={'LittleGhosts'}
                  key={index}
                  id={id}
                  mode={'staking'}
                  size={'medium'}
                  toggleNftSelected={toggleNftSelected}
                  selectedNfts={unstakedSelected}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-5 mt-2 md:flex-row">
        <div className="flex justify-end w-full gap-5">
          <button
            id="stake-btn"
            onClick={() => {
              if (unstakedSelected.length === 0) {
                console.log('No tokens selected')
              } else {
                props.handleStakeTokens(unstakedSelected)
                setUnstakedSelected([])
                setAllSelected(false)
              }
            }}
            className="my-auto flex items-center bg-cyan-blue bg-opacity-40 rounded-md px-4 py-2 hover:scale-[1.03]"
          >
            <span className="inline-block mr-1">
              {handleStake.isLoading && <LoadingSpinner fill={'#FFF'} height="20px" />}
            </span>
            <span className="my-auto">Stake ({unstakedSelected.length})</span>
          </button>

          {!allSelected && (
            <button
              onClick={() => {
                setUnstakedSelected([...props.unstakedTokens])
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
                setUnstakedSelected([])
                toggleAllSelected()
              }}
              className="my-auto flex cursor-pointer rounded-md px-4 py-2 bg-cyan-blue bg-opacity-40 hover:scale-[1.03]"
            >
              <span className="my-auto">Deselect All</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
