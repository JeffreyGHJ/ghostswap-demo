import { useEffect, useState } from 'react'
import Badge from '../../Badge'
import { Minus, Plus } from 'react-feather'
import { CheckIcon } from '@heroicons/react/24/solid'

const TraitFilters = ({ traitsMap, showFilters, setTraitsMap, traitFilters, setTraitFilters }) => {
  return (
    <>
      {traitsMap?.size > 0 && showFilters && (
        <div
          id="filters"
          className="flex flex-col gap-1 overflow-y-auto w-[50%] min-w-[150px] sm:min-w-[250px] sm:w-[20%] max-w-[350px] max-h-[35rem]"
        >
          {traitsMap !== null &&
            Array.from(traitsMap.keys()).map((key, index) => {
              let traitType = key
              // console.log(traitType)
              // let traits = entry[1] // traits group
              return (
                <TraitTypeFilterGroup
                  key={index + ':' + traitType}
                  traitType={traitType}
                  traitsMap={traitsMap}
                  setTraitsMap={setTraitsMap}
                  traitFilters={traitFilters}
                  setTraitFilters={setTraitFilters}
                />
              )
            })}
        </div>
      )}
    </>
  )
}

const TraitTypeFilterGroup = ({ traitType, traitsMap, setTraitsMap, traitFilters, setTraitFilters }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div
        id="trait-type"
        className="flex justify-between w-full px-1 py-2 cursor-pointer sm:px-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-1">
          <div id="label" className="text-[12px] ts-2 sm:text-[16px] sm:ts-4 text-left">
            {traitType}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Badge color="blue" size="default">
            <div className="w-4 text-center">{traitsMap?.get(traitType)?.size || 0}</div>
          </Badge>
          {!expanded && <Plus size={18} />}
          {expanded && <Minus size={18} />}
        </div>
      </div>
      {expanded && (
        <div id="trait-type-options" className="flex flex-col w-full gap-1">
          {Array.from(traitsMap.get(traitType).keys()).map((traitName, index) => {
            // console.log(traitName)
            return (
              <TraitFilter
                key={traitName + ':' + index}
                traitType={traitType}
                traitName={traitName}
                traitsMap={traitsMap}
                setTraitsMap={setTraitsMap}
                traitFilters={traitFilters}
                setTraitFilters={setTraitFilters}
              />
            )
          })}
        </div>
      )}
    </>
  )
}

const TraitFilter = ({ traitType, traitName, traitsMap, setTraitsMap, traitFilters, setTraitFilters }) => {
  const [selected, setSelected] = useState(traitsMap.get(traitType).get(traitName).isFiltered)
  const [count, setCount] = useState(0)

  useEffect(() => {
    setSelected(traitsMap.get(traitType).get(traitName).isFiltered)
  }, [traitsMap])

  useEffect(() => {
    let traits = traitsMap.get(traitType)
    let trait = traits.get(traitName)
    let count = trait.count
    setCount(count)
  }, [traitsMap])

  const handleToggleFilter = () => {
    let filteredTraits = new Map(traitFilters) // copy map of all traits that are being filtered
    let traits = traitsMap.get(traitType) // get all trait values for this type
    let trait = traits.get(traitName) // the trait, its # of occurrences, and if it is filtered

    // console.log('toggling filter')
    // console.log(traitFilters)

    // console.log('traits', traitType, traits)
    // console.log('trait', traitName, trait)
    // console.log('list of filters: ', filteredTraits)

    let updatedTraitData = {
      count: trait.count,
      isFiltered: !trait.isFiltered, // toggle the isFiltered value for the trait that was clicked
    }

    // console.log('updated trait', traitName, updatedTraitData)

    // for this trait type, get the array of traits being filtered or start a new array
    let value = filteredTraits.get(traitType)
    let traitsArray = Array.isArray(value) ? value : []

    // console.log('traits array before:', traitsArray)

    // for the trait that was clicked, add or remove it from the array of traits being filtered
    if (!selected) {
      trait.isFiltered = true
      traitsArray.push(traitName)
    } else {
      trait.isFiltered = false
      let index = traitsArray.indexOf(traitName)
      if (index !== -1) traitsArray.splice(index, 1)
    }

    // console.log('traits array after:', traitsArray)

    // for this trait type, if array of traits being filtered is now empty, remove the trait type from the map
    traitsArray.length > 0 ? filteredTraits.set(traitType, traitsArray) : filteredTraits.delete(traitType)

    // console.log('updated map of filters: ', filteredTraits)

    // make copies of stateful map objects so you can update and set new values
    let traitsUpdate = new Map(traits)
    traitsUpdate.set(traitName, updatedTraitData)

    // console.log('updated group', traitType, traitsUpdate)

    let newTraitsMap = new Map(traitsMap)
    newTraitsMap.set(traitType, traitsUpdate)

    // console.log('updated map', newTraitsMap)

    // set new values
    setTraitsMap(newTraitsMap)
    setTraitFilters(filteredTraits)
    setSelected(!selected)
  }

  return (
    <div
      id="trait-type-option"
      className="flex items-center justify-between rounded-md bg-dark-900 px-[2px] py-[.2rem] sm:px-3 hover:bg-dark-800 cursor-pointer"
      onClick={() => handleToggleFilter()}
    >
      <div className="flex items-center gap-1">
        <div className="flex flex-shrink-0 w-[17px] h-[17px] bg-black border-2 border-gray-500 rounded-[4px]">
          {selected && <CheckIcon />}
        </div>
        <div
          id="label"
          className="text-[12px] sm:text-[14px] sm:ts-4 text-left break-normal leading-[1.5] sm:leading-[1.5rem]"
        >
          {traitName}
        </div>
      </div>
      <Badge color="blue" size="default">
        <div className="flex justify-center w-4">{count || 0}</div>
      </Badge>
    </div>
  )
}

export default TraitFilters
