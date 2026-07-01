import { createSlice, current } from '@reduxjs/toolkit'

const initialState = {
  collections: [],
  activeCollections: [],
  needsUpdate: false,
}

export const nftMarket = createSlice({
  name: 'nftMarket',
  initialState,
  reducers: {
    setCollections: (state, action) => {
      state.collections = action.payload
    },
    setActiveCollections: (state, action) => {
      state.activeCollections = action.payload
    },
    setNeedsUpdate: (state, action) => {
      state.needsUpdate = action.payload
    },
    addNftImageSourceToCollection: (state, action) => {
      // look for match in scraped collections data
      let collectionsIndex = state.collections.findIndex(
        (collection) => collection.address.toLowerCase() === action.payload.address.toLowerCase()
      )

      // look for match in definedApi results
      let activeCollectionsIndex = state.activeCollections.findIndex(
        (collection) => collection.address.toLowerCase() === action.payload.address.toLowerCase()
      )

      // if found a match in scraped data
      if (collectionsIndex !== -1) {
        let imageSources = state.collections[collectionsIndex].nftImageSources || []
        imageSources.push({
          nftId: action.payload.nftId,
          nftImageSource: action.payload.nftImageSource,
        })
        state.collections[collectionsIndex].nftImageSources = imageSources
      }

      // if found a match in defined api data
      if (activeCollectionsIndex !== -1) {
        let imageSources = state.activeCollections[activeCollectionsIndex].nftImageSources || []
        imageSources.push({
          nftId: action.payload.nftId,
          nftImageSource: action.payload.nftImageSource,
        })
        state.activeCollections[activeCollectionsIndex].nftImageSources = imageSources
      }

      // TO-DO: Decide what happens when there is no collection match
      // use DEMO CROWN as a way to understand this case
      // maybe start a new set of collections
      // "unlistedCollections"
    },
  },
})

export const { setCollections, setActiveCollections, addNftImageSourceToCollection, setNeedsUpdate } = nftMarket.actions

export default nftMarket.reducer
