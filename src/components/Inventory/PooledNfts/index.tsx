import { useState } from 'react'
import NftListBox from '../../NftListBox'

const buttonStyle =
  ' w-32 px-3 py-2 text-center bg-indigo-500 border border-black rounded-md cursor-pointer hover:bg-indigo-800 ts-3 '

const PooledNfts = ({ filteredPooledNfts, pageSize }) => {
  const [numPages, setNumPages] = useState(1)
  return (
    <>
      {filteredPooledNfts && Array.isArray(filteredPooledNfts) ? (
        <NftListBox
          listStyle="grid4"
          nfts={filteredPooledNfts.slice(0, pageSize * numPages)}
          nftSize="large"
          mode="pooled"
          listClass="lg:justify-start content-start"
        />
      ) : (
        <></>
      )}
      {filteredPooledNfts && (
        <div className="flex items-center justify-center w-full gap-4 pt-4 select-none">
          {numPages > 1 && (
            <div className={buttonStyle} onClick={() => setNumPages(1)}>
              Collapse
            </div>
          )}
          {pageSize * numPages < filteredPooledNfts.length && (
            <div className={buttonStyle} onClick={() => setNumPages(numPages + 1)}>
              Load More
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default PooledNfts
