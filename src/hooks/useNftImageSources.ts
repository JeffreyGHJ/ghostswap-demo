import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addNftImageSourceToCollection } from '../state/nftMarket'

function useNftImageSources() {
  const dispatch = useDispatch()
  const collections = useSelector((state: any) => state.nftMarket.collections)
  const activeCollections = useSelector((state: any) => state.nftMarket.activeCollections)

  const findNftImageSourceInCollections = (address, id) => {
    // try finding image source in active collection first
    let activeCollection = activeCollections?.find(
      (collection) => collection.address.toLowerCase() === address.toLowerCase()
    )
    if (activeCollection !== undefined) {
      return activeCollection?.nftImageSources?.find((entry) => entry.nftId === id)?.nftImageSource || null
    }

    // search for image source in scraped collections second
    let collection = collections?.find((collection) => collection.address.toLowerCase() === address.toLowerCase())
    if (collection !== undefined) {
      return collection?.nftImageSources?.find((entry) => entry.nftId === id)?.nftImageSource || null
    }
  }

  const fetchNftImageSource = async (address, id, setImageSource, cancelSource = null) => {
    const result = await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/image/low/` + address + '/' + id, {
        cancelToken: cancelSource?.token,
      })
      .then((response) => {
        if (response?.data?.imageURL) {
          let imageURL = response?.data?.imageURL
          let payload = { address: address, nftId: id, nftImageSource: imageURL }
          // console.log(`adding: {address: 0x...${address.slice(32)}, nftId: ${id}, imageSrc: ...${imageURL.slice(26)}}`)
          dispatch(addNftImageSourceToCollection(payload))
          if (!setImageSource) return imageURL
          else setImageSource(response.data.imageURL)
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('fetchNftImageSource() aborted')
        } else {
          console.log(error?.response?.data)
        }
      })

    // console.log(result)
    return result
  }

  const getNftImageSource = (address, id, setImageSource = null, cancelSource = null) => {
    let imageSource = findNftImageSourceInCollections(address, id)
    if (imageSource !== null && imageSource !== undefined) {
      if (setImageSource) setImageSource(imageSource)
      else return imageSource
    } else {
      let res = fetchNftImageSource(address, id, setImageSource, cancelSource).catch(console.error)
      return res
    }
  }

  return { getNftImageSource, findNftImageSourceInCollections, fetchNftImageSource }
}

export default useNftImageSources
