import { CheckIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import Badge from '../../../Badge'
import BondingCurveBadge from '../../../BondingCurveBadge'

const BondingCurveFilters = (props) => {
  const [linearSelected, setLinearSelected] = useState(false)
  const [exponentialSelected, setExponentialSelected] = useState(false)
  const [xykSelected, setXykSelected] = useState(false)

  // console.log(props.liqPools)

  useEffect(() => {
    setLinearSelected(props.poolFilters.includes('LINEAR'))
    setExponentialSelected(props.poolFilters.includes('EXPONENTIAL'))
    setXykSelected(props.poolFilters.includes('XYK'))
  }, [props.poolFilters, setLinearSelected, setExponentialSelected, setXykSelected])

  return (
    <div id="bonding-curve-filters" className="w-full">
      <div id="heading" className="mb-2 text-left">
        Bonding Curve
      </div>

      <div id="filter-options" className="flex flex-col gap-2">
        <FilterOption
          label="Linear"
          bondingCurveType={'LINEAR'}
          isSelected={linearSelected}
          toggleFilter={props.toggleFilter}
          pools={props.liqPools}
        />
        <FilterOption
          label="Exponential"
          bondingCurveType={'EXPONENTIAL'}
          isSelected={exponentialSelected}
          toggleFilter={props.toggleFilter}
          pools={props.liqPools}
        />
        {/* <FilterOption
          label="XYK"
          bondingCurveType={'XYK'}
          isSelected={xykSelected}
          toggleFilter={props.toggleFilter}
          pools={props.liqPools}
        /> */}
      </div>
    </div>
  )
}

const FilterOption = (props) => {
  return (
    <div
      id="filter-option"
      className="w-full p-3 bg-gray-900 rounded cursor-pointer hover:bg-gray-800"
      onClick={() => props.toggleFilter(props.bondingCurveType)}
    >
      <div id="group-row" className="flex flex-row items-center justify-between">
        <span className="flex flex-row items-center">
          <div id="option-label" className="mr-2">
            {props.label}
          </div>
          <BondingCurveBadge bondingCurveType={props.bondingCurveType} />
          <Badge color="blue" size="default" className="ml-2">
            {props.pools && props.pools.filter((pool) => pool.bondingCurveType === props.bondingCurveType).length}
          </Badge>
        </span>
        <div className="w-[17px] h-[17px] bg-black border-2 border-gray-500 rounded-[4px]">
          {props.isSelected && <CheckIcon />}
        </div>
      </div>
    </div>
  )
}

export default BondingCurveFilters
