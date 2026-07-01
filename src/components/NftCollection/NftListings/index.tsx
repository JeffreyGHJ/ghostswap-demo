import React, { useCallback, useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import NftCard from '../../NftCard'
import { toggleCartItem, setCartIsOpen } from '../../../state/cart'
import useNftImageSources from '../../../hooks/useNftImageSources'

const NftListings = ({
  details,
  nfts,
  pools,
  imageSources,
  cardsToDisplay,
  setImageSources,
  setCardsToDisplay,
  numPages,
  PAGE_SIZE,
  buying = null,
}) => {
  const dispatch = useDispatch()
  const { getNftImageSource } = useNftImageSources()
  const cartItems = useSelector((state: any) => state.cart.cartItems)
  const [collectionItemsInCart, setCollectionItemsInCart] = useState([])

  useEffect(() => {
    setCollectionItemsInCart(cartItems.filter((item) => item.collectionAddress === details.address))
  }, [cartItems])

  useEffect(() => {
    let imageSourcesData = new Map()

    for (let nft of nfts?.slice(0, PAGE_SIZE)) {
      let id = nft.id
      let address = details.address.toLowerCase()
      let src = getNftImageSource(address, id)
      imageSourcesData.set(id, src)
    }

    setImageSources(imageSourcesData)
    setCardsToDisplay(nfts?.slice(0, PAGE_SIZE))
  }, [])

  useEffect(() => {
    let toDisplay = nfts.slice(0, numPages * PAGE_SIZE)
    let imageSourcesData = new Map(imageSources)

    for (let nft of toDisplay) {
      let id = nft.id
      let address = details.address.toLowerCase()
      let src = getNftImageSource(address, id)
      // console.log(src)
      imageSourcesData.set(id, src)
    }

    setImageSources(imageSourcesData)
    setCardsToDisplay(toDisplay)
  }, [nfts])

  const toggleItemInCart = useCallback(
    (nftData: any) => {
      dispatch(toggleCartItem(nftData))
      dispatch(setCartIsOpen(true))
    },
    [nfts]
  )

  const isInCart = (nftData) => {
    for (let item of collectionItemsInCart) {
      if (item.id === nftData.id) return true
    }
    return false
  }

  const cartItemsFirst = (a, b) => {
    let aIsInCart = isInCart(a)
    let bIsInCart = isInCart(b)
    if (!aIsInCart && !bIsInCart) return 0
    if (aIsInCart && bIsInCart) return 0
    if (aIsInCart && !bIsInCart) return -1
    if (!aIsInCart && bIsInCart) return 1
  }

  return nfts?.length ? (
    <>
      <div id="listings-flexbox" className="relative flex flex-wrap justify-center w-full h-full min-h-[35rem]">
        {cardsToDisplay?.length > 0 &&
          [...cardsToDisplay].map((nftData: any, index: number) => {
            let img = imageSources.get(nftData.id)
            return (
              <NftCard
                key={index + ':' + nftData.id}
                details={details}
                toggleItemInCart={toggleItemInCart}
                buying={true}
                isSelected={isInCart(nftData)}
                nftData={nftData}
                pools={pools}
                imageSource={img}
              />
            )
          })}
      </div>
    </>
  ) : (
    <>
      <div className="mt-8">There are no {details.name}s for sale</div>
    </>
  )
}

export default React.memo(NftListings)
