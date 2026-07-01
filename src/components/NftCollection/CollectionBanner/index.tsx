import Image from 'next/image'
import bnbIcon from '../../../../public/images/tokens/bnb-icon.png'
import { useState } from 'react'
import React from 'react'
import rugged from '../../../../public/rugged.png'
import { ArrowTooltipBordered } from '../../Tooltip'

const bnbBannerIcon = (
  <div className="flex items-center w-4 h-4 mr-1 md:w-5 md:h-5">
    <Image src={bnbIcon} alt={'BNB'} />
  </div>
)

function formatPrice(lang, value) {
  const format = {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code',
    minimumFractionDigits: 3,
  }
  let result = Intl.NumberFormat(lang, format)
    .format(value)
    .replace(/[a-z]{3}/i, '')
    .trim()
  return result
}

const CollectionBanner = (props: any) => {
  const [avatar, setAvatar] = useState(
    !props.details.avatar || props.details.avatar == 'null' ? '/question_hd.png' : props.details.avatar
  )
  const [banner, setBanner] = useState(
    !props.details.banner || props.details.banner == 'null' ? '/backgrounds/4.png' : props.details.banner
  )
  const [name, setName] = useState(props.details.name)
  const [verified, setVerified] = useState(true)
  const [show, setShow] = useState(false)

  const enableVisibility = () => {
    setShow(true)
  }

  const disableVisibility = () => {
    setShow(false)
  }

  return (
    <div
      id="collection-banner"
      style={{ zIndex: 1 }}
      className="relative flex items-center justify-between w-full h-40 overflow-hidden text-base font-bold md:h-60"
    >
      <div
        id="gradient-black-top"
        style={{ background: 'linear-gradient(rgb(0,0,0), rgba(0,0,0,0))' }}
        className="absolute top-0 z-10 w-full h-1/5"
      ></div>
      <div
        id="gradient-black-bottom"
        style={{ background: 'linear-gradient(rgba(0,0,0,.2), rgb(0,0,0))' }}
        className="absolute z-10 w-full h-full"
      ></div>

      <div id="next-image-container" className="absolute flex justify-center w-full h-full">
        <Image id="banner-background" src={banner} alt={props.details.name} objectFit={'cover'} layout={'fill'} />
      </div>

      <div id="collection-icon-holder" className="absolute z-10 flex justify-center w-full h-full p-2">
        <img
          id="collection-icon"
          src={avatar}
          alt="Ghost"
          className="w-10 h-10 border-black rounded-full border-2a md:w-24 md:h-24 md:border-6"
        ></img>
      </div>
      <div id="collection-details" className="z-10 flex flex-col items-center justify-end w-full h-full m-auto">
        <div
          style={{ WebkitTextStrokeWidth: 'thin', lineHeight: '1.5' }}
          id="collection-name"
          className="flex justify-between text-3xl text-center md:text-5xl"
        >
          {name}
          {props.details.status === 'Rugged' ? (
            <ArrowTooltipBordered
              show={show}
              content={'The team has confirmed this project has rugged. Proceed with caution.'}
              placement="top"
            >
              <div
                id="sweep-mode"
                className="relative"
                onMouseEnter={enableVisibility}
                onMouseLeave={disableVisibility}
              >
                <img src={rugged.src} style={{ maxWidth: '36px', maxHeight: '36px' }} className="flex ml-1" />
              </div>
            </ArrowTooltipBordered>
          ) : (
            <></>
          )}
        </div>
        <div
          id="collection-stats"
          style={{ width: '50rem', maxWidth: '88vw' }}
          className="flex flex-row items-center justify-center"
        >
          <div id="stat1" className="flex flex-col items-center w-full">
            <div
              id="stat-name"
              style={{ lineHeight: '1.5' }}
              className="mt-2 font-bold text-center text-gray-400 text-sm2 md:text-lg2"
            >
              Floor Price
            </div>
            <div id="stat-value" className="flex flex-row items-center font-bold mt-a1 text-sm2 md:text-2xl">
              {bnbBannerIcon}
              {formatPrice('en-US', props.floorPrice) || (Math.random() * 3 + 9).toFixed(3).toLocaleString()}
            </div>
          </div>

          <div id="stat2" className="flex flex-col items-center w-full">
            <div
              id="stat-name"
              style={{ lineHeight: '1.5' }}
              className="mt-2 font-bold text-center text-gray-400 text-sm2 md:text-lg2"
            >
              Best Offer
            </div>
            <div id="stat-value" className="flex flex-row items-center font-bold mt-a1 text-sm2 md:text-2xl">
              {bnbBannerIcon}
              {formatPrice('en-US', props.bestOffer) || (Math.random() * 2 + 9).toFixed(3).toLocaleString()}
            </div>
          </div>

          <div id="stat3" className="flex flex-col items-center w-full">
            <div
              id="stat-name"
              style={{ lineHeight: '1.5' }}
              className="mt-2 font-bold text-center text-gray-400 text-sm2 md:text-lg2"
            >
              Offer TVL
            </div>
            <div id="stat-value" className="flex flex-row items-center font-bold mt-a1 text-sm2 md:text-2xl">
              {bnbBannerIcon}
              {formatPrice('en-US', props.offerTvl) ||
                ((Math.random() * 9 + 10) * (Math.random() * 3 + 10)).toFixed(2).toLocaleString()}
            </div>
          </div>

          <div id="stat4" className="flex flex-col items-center w-full">
            <div
              id="stat-name"
              style={{ lineHeight: '1.5' }}
              className="mt-2 font-bold text-center text-gray-400 text-sm2 md:text-lg2"
            >
              Volume
            </div>
            <div id="stat-value" className="flex flex-row items-center font-bold mt-a1 text-sm2 md:text-2xl">
              {bnbBannerIcon}
              {formatPrice('en-US', props.volume) || formatPrice('en-US', Math.random() * 1500 + 1000)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(CollectionBanner)
