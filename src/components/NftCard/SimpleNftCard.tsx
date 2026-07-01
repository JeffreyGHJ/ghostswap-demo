import React, { useEffect, useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/solid'
import { X } from 'react-feather'
import CollectionLink from './CollectionLink'
import ViewItemLink from './ViewItemLink'
import BoxShadowFade from './BoxShadowFade'
import ViewPoolLink from './ViewPoolLink'
import PoolIdenticon from './PoolIdenticon'

const nameWithId = (name, id) => {
  if (!name) {
    return '#' + id
  }
  if (name.includes('#')) return name
  else return name + ' #' + id
}

const cardStyle =
  ' flex flex-col justify-start bg-black border-2 border-gray-700 cursor-pointer rounded-[10px] p-[0.1rem] m-[0.2rem] hover:border-gray-600 '

const fullId = ' overflow-hidden tracking-tight text-center overflow-ellipsis leading-4 m-[0.35rem] my-[5px] pb-[5px] '
const imgVisible = { opacity: '100%', filter: 'saturate(1)', height: 'auto', width: 'auto' }
const imgHidden = { opacity: '0%', filter: 'saturate(0)', height: '0px', width: '0px' }

const cardSize = {
  small: ' w-[7.5rem] h-[11rem] ',
  default: ' w-[8rem] h-[11rem]  ',
  medium: ' w-[10rem] h-[13.5rem] ',
  large: ' w-[11rem] h-[16.5rem] ',
}

const imageStyle = {
  small: ' w-full overflow-hidden h-[7.5rem] p-1 ',
  default: ' w-full overflow-hidden h-[7.5rem] px-[8px] pb-[3px] pt-[.3rem] ',
  medium: ' w-full overflow-hidden h-[10rem] px-[8px] pb-[3px] pt-[.3rem] ',
  large: ' w-full overflow-hidden h-[12rem] px-[8px] pb-[3px] pt-[.3rem] ',
}

const SimpleNftCard = ({
  mode = 'default', // default | listing | inventory | deposited | pooled
  id,
  address,
  size = 'default',
  selectedNfts = null,
  toggleNftSelected = null,
  name = null,
  metadataName = null,
  imageSrc = null,
  maxSelected = null,
  nftData = null,
  showOffers = null,
}) => {
  // const { fetchNftImageSource } = useNftImageSources()
  const [isSelected, setIsSelected] = useState(false)
  const [imageSource, setImageSource] = useState(imageSrc?.then ? null : imageSrc)
  const [ready, setReady] = useState(!!imageSrc && !imageSrc?.then)

  useEffect(() => {
    if (mode !== 'listing' && mode !== 'pooled') {
      setIsSelected(selectedNfts?.some((nft) => nft.tokenId === id))
    }
  }, [selectedNfts, id])

  // If our imageSource is a Promise, then get its resolved value
  useEffect(() => {
    if (imageSrc && imageSrc.then) {
      imageSrc.then((result) => setImageSource(result))
    } else if (imageSrc && !imageSrc.then) {
      setImageSource(imageSrc)
      setReady(true)
    }
  }, [imageSrc])

  return (
    <div
      id="simple-nft-card"
      style={{
        borderColor: isSelected ? 'white' : '',
        filter: isSelected ? 'saturate(0.4)' : maxSelected === true ? 'blur(2px) grayscale(100)' : '',
      }}
      className={cardStyle + cardSize[size || 'default']}
      onClick={() =>
        toggleNftSelected && mode !== 'listing' && mode !== 'pooled'
          ? toggleNftSelected({ tokenId: id, tokenAddress: address, name: name, metadataName: metadataName })
          : {}
      }
    >
      {isSelected && mode !== 'listing' && (
        <div className="relative">
          <div id="icon-holder-top-right" className="absolute right-0 p-[0.1875rem] w-[26px] h-[26px] z-50 ">
            <div id="icon-round" className="w-full h-full rounded-full bg-[#27883c]">
              <CheckIcon />
            </div>
          </div>
        </div>
      )}

      {mode === 'listing' && (
        <div className="relative">
          <div id="icon-holder-top-right" className="absolute right-0 p-[0.1rem] w-[24px] h-[24px] z-50 ">
            <div
              id="icon-round"
              className="flex items-center justify-center w-full h-full text-gray-600 bg-gray-900 rounded-full hover:text-white"
              onClick={() =>
                toggleNftSelected({ tokenId: id, tokenAddress: address, name: name, metadataName: metadataName })
              }
            >
              <X width={12} strokeWidth={3} />
            </div>
          </div>
        </div>
      )}

      {(mode === 'inventory' || mode === 'pooled') && <CollectionLink name={name} address={address} />}

      {mode === 'pooled' && (
        <PoolIdenticon
          nftData={nftData}
          pool={{
            poolType: nftData.poolType,
            poolAddress: nftData.poolAddress,
            bondingCurveType: nftData.bondingCurveType,
            nftBalance: nftData.nftBalance,
          }}
        />
      )}

      <div id="card-img" className={imageStyle[size || 'default']}>
        <div id="img-container" className="relative flex flex-row items-center justify-center overflow-hidden h-fill">
          {!ready && <div className="w-full h-full bg-[#16161c] animate-pulse" />}
          <BoxShadowFade show={ready} />
          <img
            src={imageSource}
            alt={name + ' #' + id}
            style={ready ? imgVisible : imgHidden}
            className="relative overflow-hidden transition-all ease-in duration-[1s]"
            onLoad={() => setReady(true)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div id="sub-id" className="text-xs text-left text-gray-500 leading-[.9] pl-[.35rem]">
          # {id && id.length > 18 ? id.slice(0, 18) + '...' : id || ''}
        </div>

        {nftData?.rank && nftData.rank !== null && (
          <div id="rank" className="-mt-1 -mb-1 text-xs text-left text-gray-500 leading-[1.5] pr-[.35rem]">
            Rank: {nftData.rank}
          </div>
        )}
      </div>

      <div className={fullId + (mode === 'deposited' ? ' whitespace-nowrap ' : ' ts-3 break-normal ')}>
        {metadataName == name ? nameWithId(name, id) : metadataName}
      </div>

      {mode === 'inventory' && (
        <div className="relative flex flex-row items-center justify-center p-[.1rem]">
          {!showOffers && <ViewItemLink id={id} address={address} />}
          {showOffers && (
            <div className="flex justify-end pr-2 gap-1 w-full items-center text-white ts-1 bg-gray-700 rounded-md text-[15px]">
              <img src={'images/tokens/bnb-icon.png'} className="w-4 h-4" /> {nftData.offerNBT || 0}
            </div>
          )}
        </div>
      )}
      {mode === 'deposited' && <ViewItemLink id={id} address={address} />}
      {mode === 'pooled' && (
        <div className="p-[1px]">
          <ViewPoolLink poolAddress={nftData.poolAddress} />
        </div>
      )}
    </div>
  )
}

export default React.memo(SimpleNftCard)
