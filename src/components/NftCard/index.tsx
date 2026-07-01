import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import IdenticonImage from '../IdenticonImage'
import bnbIcon from '../../../public/images/tokens/bnb-icon.png'
import getIdenticonColor from './getIdenticonColor'
import { CheckIcon } from '@heroicons/react/24/solid'
import BoxShadowFade from './BoxShadowFade'
import ViewItemLink from './ViewItemLink'
import { MouseoverArrowTooltipBordered as Tooltip } from '../Tooltip'
import PoolInfoTooltip from './PoolInfoTooltip'

const imageRevealed = { opacity: '100%', filter: 'saturate(1)', height: 'auto', width: 'auto' }
const imageLoading = { opacity: '0%', filter: 'saturate(0)', height: '0px', width: '0px' }
const cardSelected = { borderColor: 'white', filter: 'saturate(0.4)' }
const cardUnselected = { borderColor: ' ', filter: ' ' }
const popper = 'z-50 bg-dark-850 border border-black rounded-lg text-[#95aac9]'
const identiconHolder = 'z-[11] absolute w-[26px] h-[26px]'
const fullId = 'overflow-hidden font-bold break-all overflow-ellipsis whitespace-nowrap m-[0.35rem] mt-0 pl-[0.35rem]'

const NftCard = (props: any) => {
  const [hover, setHover] = useState(' hover:border-gray-600')
  const [color, _] = useState(
    props.buying ? getIdenticonColor(props?.nftData?.poolAddress || props?.nftData?.owner) : null
  )

  const [pool, setPool] = useState(null)
  const [imageSource, setImageSource] = useState(props?.imageSource?.then ? null : props.imageSource)
  const [ready, setReady] = useState(!!props.imageSource && !props?.imageSource?.then)

  // If our imageSource is a Promise, then get its resolved value
  useEffect(() => {
    if (props.imageSource && props.imageSource.then) {
      props.imageSource.then((result) => setImageSource(result))
    }
  }, [props.imageSource])

  const cardStyle = props.sweepMode
    ? 'flex flex-col justify-start bg-black border-2 border-gray-700 cursor-pointer rounded-[10px] p-[0.1rem] m-[0.2rem] w-[7.5rem] '
    : 'flex flex-col justify-start bg-black border-2 border-gray-700 cursor-pointer rounded-[10px] p-[0.1rem] m-[0.2rem] w-34 md:w-40 '

  const imageStyle = props.sweepMode
    ? 'w-full overflow-hidden h-[6.5rem] px-[8px] pb-[3px] pt-[.3rem]'
    : 'w-full overflow-hidden h-34 md:h-40 p-[6px]'

  const poolInfo = <PoolInfoTooltip color={color} nftData={props.nftData} pool={pool} />

  const handleToggleItem = () => {
    if (!props.sweepMode) {
      let name = props.details.name
      let collectionAddress = props.details.address
      let delta = pool?.delta || 0
      let nftBalance = pool?.nftBalance || 0
      let balanceNBT = pool?.balanceNBT || 0
      let poolType = pool?.poolType || null
      props.toggleItemInCart(
        { ...props.nftData, imageSource, name, collectionAddress, delta, nftBalance, balanceNBT, poolType },
        props.buying
      )
    }
  }

  useEffect(() => {
    setPool(props.pools?.find((pool) => pool.poolAddress === props.nftData.poolAddress))
  }, [props.pools, props.nftData.poolAddress])

  return (
    <div id="card-slot" className="flex flex-col mt-[.1875rem]">
      <div
        id="nft-card"
        style={props.isSelected ? cardSelected : cardUnselected}
        onClick={handleToggleItem}
        className={cardStyle + hover}
      >
        {props.buying && (
          <div className="relative">
            <div
              className={identiconHolder}
              onMouseEnter={() => setHover(' cursor-default ')}
              onMouseLeave={() => setHover(' hover:border-gray-600 ')}
            >
              <Tooltip content={poolInfo} arrow={{ offset: [0, -4] }} placement="right" popperClass={popper}>
                <IdenticonImage address={props?.nftData?.poolAddress || props?.nftData?.owner} />
              </Tooltip>
            </div>
          </div>
        )}

        {props.isSelected && (
          <div className="relative">
            <div id="check-mark-holder" className="absolute right-0 p-[0.1875rem] w-[26px] h-[26px] z-50 ">
              <div id="check-mark" className="w-full h-full rounded-full bg-[#27883c]">
                <CheckIcon />
              </div>
            </div>
          </div>
        )}

        <div id="card-img" className={imageStyle}>
          <div id="img-viewport" className="relative flex flex-row items-center justify-center overflow-hidden h-fill">
            {!ready && <div className="w-full h-full bg-[#16161c] animate-pulse" />}
            <BoxShadowFade show={ready} />
            <img
              src={imageSource}
              alt={props.details.name + ' #' + props.nftData.id}
              style={ready ? imageRevealed : imageLoading}
              className="relative overflow-hidden transition-all ease-in duration-[1s]"
              onLoad={() => setReady(true)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div id="sub-id" className="-mt-1 -mb-1 text-xs text-left text-gray-500 leading-[1.5] pl-[.35rem]">
            #{props.nftData.id.length > 15 ? props.nftData.id.slice(0, 15) + '...' : props.nftData.id}
          </div>

          {props?.nftData?.rank && props.nftData.rank !== null && (
            <div id="rank" className="-mt-1 -mb-1 text-xs text-left text-gray-500 leading-[1.5] pr-[.35rem]">
              Rank: {props.nftData.rank}
            </div>
          )}
        </div>

        <div className={fullId}>
          {props.details.name} #{props.nftData.id}
        </div>

        <div id="price" className="flex items-center justify-end font-normal bg-gray-700 rounded-md p-[.1875rem]">
          <div id="bnb-icon" className="flex items-center w-4 h-4 mr-[.4rem]">
            {isNaN(props.nftData.price) ? null : <Image src={bnbIcon} alt={'BNB'} />}
          </div>
          <div className="mr-1 text-[.9rem] leading-[1.5] ts-3">
            {isNaN(props.nftData.price) ? 'No Offers' : (+props.nftData.price).toFixed(6)}
          </div>
        </div>
      </div>

      {!props.sweepMode && <ViewItemLink address={props.details.address} id={props.nftData.id} />}
    </div>
  )
}

export default React.memo(NftCard)
