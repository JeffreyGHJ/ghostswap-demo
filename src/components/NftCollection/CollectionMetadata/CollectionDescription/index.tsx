import React from 'react'
import { useState } from 'react'

const container = 'flex flex-col mx-auto items-center justify-center mb-4 min-h-[42px] ts-1 w-[85%] max-w-[1250px] '
const expandBtn = 'text-[14px] text-[#2181e7] cursor-pointer leading-[1.2] '
const CollectionDescription = ({ description, fallback }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={container + (description === null && fallback === null ? ' hidden ' : '')}>
      <div
        style={!expanded ? { WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-box' } : {}}
        className="overflow-hidden text-center text-pink ts-1 h-fit"
      >
        {description !== null && description}
        {!description && fallback !== null && fallback}
      </div>

      <div className={expandBtn + (description === null ? ' invisible ' : '')} onClick={() => setExpanded(!expanded)}>
        {!expanded ? 'more' : 'less'}
      </div>
    </div>
  )
}

export default React.memo(CollectionDescription)
