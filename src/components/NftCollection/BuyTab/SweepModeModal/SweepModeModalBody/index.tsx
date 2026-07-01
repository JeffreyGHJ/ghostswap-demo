import { useCallback, useEffect, useState } from 'react'
import useNftImageSources from '../../../../../hooks/useNftImageSources'
import NftCard from '../../../../NftCard'

const SweepModeModalBody = ({
  cartItems,
  details,
  nfts,
  currencySwitch,
  inputValue,
  setInputValue,
  nftsToSweep,
  setNftsToSweep,
  sweepSequence,
}) => {
  const { getNftImageSource } = useNftImageSources()
  const [imageSources, setImageSources] = useState(new Map())

  const mapImageSources = (sweepResult) => {
    let imageSourcesData = new Map(imageSources)

    for (let nft of sweepResult) {
      if (imageSourcesData.get(nft.id)) continue
      let id = nft.id
      let address = details.address.toLowerCase()
      let src = getNftImageSource(address, id)
      // console.log(src)
      imageSourcesData.set(id, src)
    }

    setImageSources(imageSourcesData)
  }

  const isInCart = useCallback(
    (nftData) => {
      for (let item of cartItems) {
        if (item.id === nftData.id && item.collectionAddress === details.address) return true
      }
      return false
    },
    [cartItems, details]
  )

  useEffect(() => {
    let sweepResult = []
    if (currencySwitch === 'items') {
      if (inputValue > sweepSequence.length) setInputValue(sweepSequence.length)
      sweepResult = sweepSequence.slice(0, inputValue)
    } else if (currencySwitch === 'bnb') {
      let balance = inputValue
      let index = 0
      while (index < sweepSequence.length && balance >= +sweepSequence[index].price) {
        balance -= sweepSequence[index].price
        sweepResult.push(sweepSequence[index++])
      }
    }
    setNftsToSweep(sweepResult)
    mapImageSources(sweepResult)
  }, [nfts, sweepSequence, inputValue, currencySwitch])

  return (
    <>
      {nftsToSweep.length > 0 && (
        <div id="sweep-mode-modal-body" className="min-h-[300px]">
          <div
            id="selection-window-flex"
            style={{ gridTemplateColumns: 'repeat(auto-fill, 8rem)' }}
            className="grid items-center justify-center w-full h-full"
          >
            {[...nftsToSweep].map((nftData, index) => (
              <NftCard
                key={index}
                details={details}
                nftData={nftData}
                sweepMode={true}
                imageSource={imageSources.get(nftData.id)}
              />
            ))}
          </div>
        </div>
      )}
      {nftsToSweep.length === 0 && (
        <div id="sweep-mode-modal-body-empty" className="flex items-center justify-center min-h-[300px]">
          <div style={{ fontSize: '15px' }} className="text-gray-400 ">
            <p>Selected NFTs will appear here</p>
          </div>
        </div>
      )}
    </>
  )
}

export default SweepModeModalBody
