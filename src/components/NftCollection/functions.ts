export const filter = (item) =>
  item.eventType === 'NEW_POOL' || item.eventType === 'SWAP_NFT_IN_POOL' || item.eventType === 'SWAP_NFT_OUT_POOL'

export function byIdAsc(a, b) {
  return a.id - b.id
}

export const getCollectionDescription = (address, fetchNftMetadataById, setDescription) => {
  let res = [fetchNftMetadataById(address, 1)]
  Promise.all(res).then((results) => {
    let data = results[0]
    setDescription(data?.description ? data.description : null)
  })
}

export const clearTraitFilters = (traitsMap, setTraitsMap, setTraitFilters) => {
  let mapUpdate = new Map()
  // console.log(props.traitsMap)
  for (let entry of traitsMap.entries()) {
    let key = entry[0]
    let traits = entry[1] // inner map
    // console.log(key, traits)
    let innerMapUpdate = new Map()
    for (let entry of traits.entries()) {
      let key = entry[0]
      let traitData = entry[1]
      // console.log(key, traitData)
      let traitDataUpdate = {
        count: traitData.count,
        isFiltered: false,
      }
      innerMapUpdate.set(key, traitDataUpdate)
    }
    // console.log(innerMap)
    mapUpdate.set(key, innerMapUpdate)
  }
  // console.log(mapUpdate)
  setTraitFilters(new Map())
  setTraitsMap(mapUpdate)
}
