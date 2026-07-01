import { useEffect, useState } from 'react'
import AssetSelectionModal from './AssetSelectionModal'
import useCollectionApi from '../../../hooks/useCollectionApi'
import {useSelector } from 'react-redux'

const SelectAssets = (props) => {
  const [ownedCollections, setOwnedCollections] = useState([])
  const [mergedCollections, setMergedCollections] = useState([])
  const { fetchOwnedCollections } = useCollectionApi()
  const activeCollections = useSelector((state: any) => state.nftMarket.activeCollections)

  const mergeCollections = (ownedCollections, activeCollections) => {
    console.log('filtering')
    console.log(activeCollections)
    let filtered = [...activeCollections].filter((collection) => {
      return !ownedCollections.some((owned) => owned.tokenAddress.toLowerCase() === collection.address.toLowerCase())
    })
    setMergedCollections(ownedCollections.concat(filtered))
  }

  useEffect(() => {
    fetchOwnedCollections(props.account, setOwnedCollections)
  }, [props.account])

  useEffect(() => {
    if (props.poolType !== 'SELL') mergeCollections(ownedCollections, activeCollections)
  }, [ownedCollections, activeCollections])

  return (
    <>
      <div id="step-info" className="w-full mb-3 text-[15px] text-gray-500 tracking-tight">
        <div style={{ WebkitTextStrokeWidth: '0.8px' }}>
          Step {props.currentStep || '?'}/{props.TOTAL_STEPS || '?'}: {props.description || 'DESCRIPTION_TEXT'}
        </div>
      </div>
      <div id="options-container" className="flex items-center justify-center w-full">
        <div id="options" className="w-full sm:w-3/4 md:w-1/2 lg:w-2/5 text-[1.6rem] mb-3">
          {props.poolType === 'BUY' && (
            <>
              <Option first action={'deposit'} asset={'Token'} token={props.token} setAsset={props.setToken} />
              <Option
                action={'receive'}
                asset={'NFT'}
                nftCollection={props.nftCollection}
                setAsset={props.setNftCollection}
                collections={mergedCollections}
              />
            </>
          )}
          {props.poolType === 'SELL' && (
            <>
              <Option
                first
                action={'deposit'}
                asset={'NFT'}
                nftCollection={props.nftCollection}
                setAsset={props.setNftCollection}
                collections={ownedCollections}
              />
              <Option action={'receive'} asset={'Token'} token={props.token} setAsset={props.setToken} />
            </>
          )}
          {props.poolType === 'BUY_AND_SELL' && (
            <>
              <Option
                first
                action={'deposit'}
                asset={'NFT'}
                nftCollection={props.nftCollection}
                setAsset={props.setNftCollection}
                collections={mergedCollections}
              />
              <Option action={'deposit'} asset={'Token'} token={props.token} setAsset={props.setToken} />
              <div className="mt-6">to earn trading fees</div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

const Option = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  return (
    <>
      <AssetSelectionModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        asset={props.asset}
        setAsset={props.setAsset}
        first={props.first}
        collections={props.collections}
      />
      <div id="option" style={{ marginTop: props.first ? '0' : '1.5rem' }}>
        <div id="description" className="w-full">
          {props.first ? 'I want to...' : 'and...'}
        </div>
        <div id="action" className="flex flex-wrap items-center mt-6">
          <label id="deposit-label" className="text-[1.6rem] font-bold tracking-tight w-1/3 min-w-[7rem]">
            {props.action}
          </label>
          <div id="btn-container" className="flex items-center justify-start w-2/3">
            <button
              id="token-select-btn"
              className="relative rounded border-2 border-gray-700 px-3 py-2 text-[15px] w-1/2 min-w-[8rem] hover:bg-dark-800"
              onClick={() => openModal()}
            >
              {props.asset === 'NFT' &&
                (props.nftCollection ? <div>{props.nftCollection.name}</div> : <div>Select {props.asset}</div>)}
              {props.asset === 'Token' &&
                (props.token ? <div>{props.token.name}</div> : <div>Select {props.asset}</div>)}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SelectAssets
