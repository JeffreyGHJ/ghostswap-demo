import { ArrowLongRightIcon, ArrowsRightLeftIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import CollectionAvatar from '../CollectionAvatar'

import nft from '../../../../public/nft.png'
import { useEffect, useState } from 'react'
import axios from 'axios'

const headerBadge = 'rounded-md font-normal text-black w-14 text-[13px] tracking-[-.02em] '

const PoolCardHeader = (props) => {
  const [avatar, setAvatar] = useState(nft.src)

  const fetchImage = async (address, id) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/image/low/` + address + '/' + id)
      .then((response) => {
        setAvatar(response.data.imageURL)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    fetchImage(props.collectionAddress, props.nftAssets[0] ? props.nftAssets[0].tokenId : '1')
  }, [props.poolType])

  return (
    <div
      id="pool-card-header"
      className="flex items-center w-full py-2 mt-2 text-[18px] font-bold justify-between tracking-[-.08em] gap-3"
    >
      {(props.poolType === 'BUY_AND_SELL' || props.poolType === 'BUY') && (
        <div id="header-group-left" className="flex items-center ">
          <CollectionAvatar avatar={avatar} />
          <div id="collection-name">{props.name && props.name.slice(0, 4).capitalize}</div>
          <div id="pool-type-icon" className="mx-[6px]">
            {props.poolType === 'BUY' && <ArrowLongRightIcon className="w-4 h-4 stroke-[3px]" />}
            {props.poolType === 'BUY_AND_SELL' && <ArrowsRightLeftIcon className="w-5 h-5 stroke-2" />}
          </div>
          <img src={'/images/tokens/bnb-icon.png'} className="w-[14px] border border-transparent h-[14px] mr-1"></img>
          <div id="currency-code">BNB</div>
        </div>
      )}
      {props.poolType === 'SELL' && (
        <div id="header-group-left" className="flex items-center ">
          <img src={'/images/tokens/bnb-icon.png'} className="w-[14px] border border-transparent h-[14px] mr-1"></img>
          <div id="currency-code">BNB</div>
          <ArrowLongRightIcon className="w-4 h-4 stroke-[3px] mx-[6px]" />
          <CollectionAvatar avatar={avatar} />
          <div id="collection-name">{props.name && props.name.slice(0, 4).capitalize}</div>
        </div>
      )}

      <div id="header-group-right">
        <div id="pool-type" className="flex text-center ts-[thin]">
          {props.poolType === 'BUY' && <div className={headerBadge + 'bg-[#ec84f0]'}>SELL</div>}
          {props.poolType === 'BUY_AND_SELL' && <div className={headerBadge + 'bg-indigo-300'}>TRADE</div>}
          {props.poolType === 'SELL' && <div className={headerBadge + 'bg-[#478fe7]'}>BUY</div>}
        </div>
      </div>
    </div>
  )
}

export default PoolCardHeader
