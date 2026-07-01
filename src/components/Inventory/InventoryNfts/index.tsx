import { useEffect, useState } from 'react'
import NftListBox from '../../NftListBox'

const buttonStyle =
  ' w-32 px-3 py-2 text-center bg-indigo-500 border border-black rounded-md cursor-pointer hover:bg-indigo-800 ts-3 '

const InventoryNfts = ({ filteredAvailableNfts, selectedNfts, setSelectedNfts, pageSize, showOffers }) => {
  const [numPages, setNumPages] = useState(1)
  const [nftsToDisplay, setNftsToDisplay] = useState([])

  useEffect(() => {
    setNftsToDisplay(
      filteredAvailableNfts
        .filter((nft) => (showOffers ? (nft.offerNBT ? nft : null) : nft))
        .slice(0, pageSize * numPages)
    )
  }, [filteredAvailableNfts, numPages, pageSize, showOffers])

  return (
    <>
      {filteredAvailableNfts && Array.isArray(filteredAvailableNfts) ? (
        <NftListBox
          listStyle="grid4"
          className={'overflow-y-hidden'}
          nfts={nftsToDisplay} // all nfts to pick from
          selectedNfts={selectedNfts} // array to set picked nfts
          setSelectedNfts={setSelectedNfts} // function to set picked nfts into array
          selectEnabled // enables click event for picking
          nftSize="large"
          mode="inventory"
          listClass="lg:justify-start content-start"
          showOffers={showOffers}
        />
      ) : (
        <></>
      )}
      {filteredAvailableNfts && (
        <div className="flex items-center justify-center w-full gap-4 pt-4 select-none">
          {numPages > 1 && (
            <div className={buttonStyle} onClick={() => setNumPages(1)}>
              Collapse
            </div>
          )}
          {pageSize * numPages < filteredAvailableNfts.length && (
            <div className={buttonStyle} onClick={() => setNumPages(numPages + 1)}>
              Load More
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default InventoryNfts
