import {useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../../../hooks'
import ThreePartModal from '../../../Modal/ThreePartModal'
import nft from '../../../../../public/nft.png'
import { useEffect, useState } from 'react'

const AssetSelectionModal = (props) => {
  const bnbBalance = useSelector((state: any) => state.walletAssets.bnbBalance)

  return (
    <ThreePartModal
      isOpen={props.isOpen}
      closeModal={props.closeModal}
      header={<ModalHeader asset={props.asset} />}
      body={
        <ModalBody
          asset={props.asset}
          setAsset={props.setAsset}
          collections={props.collections}
          closeModal={props.closeModal}
          bnbBalance={bnbBalance}
        />
      }
    />
  )
}

const ModalHeader = (props) => {
  return (
    <div
      id="title"
      style={{ lineHeight: '1.1', letterSpacing: '-.02em', fontSize: '1.25rem' }}
      className="flex flex-row items-center justify-center mt-1 font-semibold text-center"
    >
      Select {props.asset}
    </div>
  )
}

const ModalBody = ({ asset, setAsset, collections, closeModal, bnbBalance }) => {
  const [filteredCollections, setFilteredCollections] = useState(collections)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (search?.length > 0) {
      setFilteredCollections(
        [...collections].filter((collection) => collection.name.toLowerCase().includes(search.toLowerCase()))
      )
    } else {
      setFilteredCollections(collections)
    }
  }, [search])

  return (
    <>
      <div id="modal-body" className="min-h-[15vh]">
        {asset === 'NFT' && (
          <div className="w-full pb-3">
            <input
              id="collection-search"
              placeholder="Search collections"
              className="w-full text-[0.9375rem] rounded-md border-2 border-gray-800 bg-black py-2 pl-3 leading-[1.5]"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
        {asset === 'NFT' && (
          <div id="asset-list" className="flex flex-col items-center justify-center w-full h-full">
            {filteredCollections
              ?.filter((nftObject, index) => {
                return filteredCollections.findIndex((item) => item.name === nftObject.name) === index
              })
              .map((nftObject, index) => {
                return (
                  <AssetListItem
                    key={index}
                    assetImgSrc={nft.src}
                    assetName={nftObject.name}
                    assetInfo={{ name: nftObject.name, address: nftObject.tokenAddress }}
                    setAsset={setAsset}
                    closeModal={closeModal}
                  />
                )
              })}
          </div>
        )}
        {asset === 'Token' && (
          <AssetListItem
            assetImgSrc={'/images/tokens/bnb-icon.png'}
            assetName={'Binance Coin'}
            assetInfo={{ name: 'BNB', address: 'native' }}
            setAsset={setAsset}
            closeModal={closeModal}
            assetValue={bnbBalance}
          />
        )}
      </div>
    </>
  )
}

const AssetListItem = (props) => {
  return (
    <div
      id="asset-list-item"
      onClick={() => {
        props.setAsset(props.assetInfo)
        props.closeModal()
      }}
      className="flex items-center w-full p-3 border border-gray-500 rounded-sm cursor-pointer hover:bg-black"
    >
      <div id="asset-info" className="flex items-center justify-between w-full">
        <div id="asset-description">
          <div id="name" className="flex flex-col px-3">
            <div id="full-name" className="text-[15px] text-gray-500">
              {props.assetName}
            </div>
            <div id="display-name" style={{ WebkitTextStroke: '.25px' }} className="text-[17px] ">
              {props.assetDisplayName}
            </div>
          </div>
        </div>
        <div id="asset-value">{props.assetValue && props.assetValue}</div>
      </div>
    </div>
  )
}

export default AssetSelectionModal
