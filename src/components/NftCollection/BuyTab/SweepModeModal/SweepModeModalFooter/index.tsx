import { useDispatch } from 'react-redux'
import { setCartItems } from '../../../../../state/cart'

const SweepModeModalFooter = (props) => {
  const dispatch = useDispatch()

  const addNftsToCart = () => {
    console.log('adding ' + props.nftsToSweep.length + ' Nfts to cart...')
    let newItems = []
    for (let nft of props.nftsToSweep) {
      // find nft pool
      // add pool data
      newItems.push({
        bondingCurve: nft.bondingCurve,
        delta: nft.delta,
        id: nft.id,
        poolAddress: nft.poolAddress,
        price: (+nft.price).toFixed(8), // errors will appear in console if store BN in redux
        poolStartPrice: nft.poolStartPrice,
        name: props.details.name,
        collectionAddress: props.details.address,
        imageSource: props.getNftImageSource(props.details.address, nft.id),
      })
    }

    console.log(newItems)
    dispatch(setCartItems([...props.cartItems, ...newItems]))
    props.setNftsToSweep([])
    props.setInputValue(0)
  }

  return (
    <div id="control-group" className="m-1">
      <div
        id="total"
        style={{ fontSize: '1.25rem', margin: '0.375rem', marginBottom: '0.75rem' }}
        className="flex flex-row items-center justify-between"
      >
        <div>Total: </div>
        <div className="flex flex-row items-center mr-2">
          <div id="bnb-icon" style={{ marginRight: '0.4rem' }} className="flex items-center w-5 h-5">
            <img src={'/images/tokens/bnb-icon.png'} />
          </div>
          <div className="font-semibold">
            {props.nftsToSweep.reduce((previous, current) => +previous + +current.price, 0).toFixed(3)}
          </div>
        </div>
      </div>

      <div id="add-btn" className="w-full">
        <button
          className="w-full px-3 py-2 border border-black rounded-md hover:bg-gray-800 hover:border-gray-800"
          onClick={() => addNftsToCart()}
        >
          {props.nftsToSweep.length === 1 ? <>Add 1 NFT</> : <>Add {props.nftsToSweep.length} NFTs</>}
        </button>
      </div>
    </div>
  )
}

export default SweepModeModalFooter
