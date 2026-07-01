import React, { Fragment } from 'react'

import RightArrow from '../RightArrow'
import { classNames } from '../../functions'

const BreadCrumbs = ({ labels, activeStep }: { labels: Array<string>; activeStep: number }) => {
  return (
    <ul className="flex items-center gap-5">
      {labels.map((label, index) => {
        console.log({ label, index })
        return (
          <Fragment key={`${index}-${label}`}>
            <li className={classNames(`font-bold ${activeStep < index ? 'text-low-emphesis' : ''}`)}>{label}</li>
            {index !== labels.length - 1 && (
              <li className="font-bold text-low-emphesis">
                <RightArrow />
              </li>
            )}
          </Fragment>
        )
      })}
    </ul>
  )
}

export default BreadCrumbs
