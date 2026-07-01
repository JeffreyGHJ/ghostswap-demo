import React, { useCallback, useState } from 'react'

import { Placement } from '@popperjs/core'
import useInterval from '../../hooks/useInterval'
import { usePopper } from 'react-popper'
import { classNames } from '../../functions'
import { Popover as HeadlessuiPopover } from '@headlessui/react'

import styled from 'styled-components'
import Portal from '../Portal'
export interface PopoverProps {
  content: React.ReactNode
  show: boolean
  children: React.ReactNode
  placement?: Placement
  popperClass?: string
  contentContainer?: string
  arrow?: any
  bordered?: boolean
  hideOverflow?: boolean
}

export default function Popover({
  content,
  show,
  children,
  placement = 'auto',
  popperClass = '',
  contentContainer = '',
  arrow = null,
  bordered = false,
  hideOverflow = false,
}: PopoverProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const { styles, update, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: arrow?.offset || [0, 2] } },
      { name: 'arrow', options: { element: arrowElement, padding: arrow?.padding || 10 } },
    ],
  })
  const updateCallback = useCallback(() => {
    update && update()
  }, [update])
  useInterval(updateCallback, show ? 100 : null)

  const Popper = bordered ? borderedStyles : flatStyles

  return (
    <HeadlessuiPopover className={hideOverflow === true ? 'overflow-hidden' : ''}>
      <div ref={setReferenceElement as any}>{children}</div>

      {show && (
        <Portal selector="#app-tooltip-portal">
          <HeadlessuiPopover.Panel static className={classNames(!show && 'opacity-0', 'z-50 animate-fade')}>
            <Popper ref={setPopperElement as any} style={styles.popper} {...attributes.popper} className={popperClass}>
              {arrow && <Arrow setArrow={setArrowElement} styles={styles.arrow} attributes={attributes.arrow} />}
              <div className={contentContainer} onClick={(e) => e.stopPropagation()}>
                {content}
              </div>
            </Popper>
          </HeadlessuiPopover.Panel>
        </Portal>
      )}
    </HeadlessuiPopover>
  )
}

const Arrow = ({ setArrow, styles, attributes }) => {
  return <div id="arrow" data-popper-arrow ref={setArrow as any} style={styles} {...attributes} />
}

// Controls the positioning of the arrow
const borderedStyles = styled.div`
  #arrow {
    display: flex;
    align-items: center;
    justify-items: center;
    background-color: inherit;
    border: inherit;
    border-width: 0px;
    :before {
      content: '';
      width: 8px;
      height: 8px;
      position: absolute;
      transform: rotate(45deg);
      background-color: inherit;
      border-width: 1px;
      border-color: inherit;
    }
  }
  &[data-popper-placement^='right'] {
    margin-left: 4px;
  }
  &[data-popper-placement^='right'] > #arrow {
    :before {
      left: -4.7px;
      border-right: 0px;
      border-top: 0px;
    }
  }
  &[data-popper-placement^='left'] {
    margin-right: 4px;
  }
  &[data-popper-placement^='left'] > #arrow {
    right: 0px;
    :before {
      right: -4.7px;
      border-left: 0px;
      border-bottom: 0px;
    }
  }
  &[data-popper-placement^='bottom'] {
    margin-top: 4px;
  }
  &[data-popper-placement^='bottom'] > #arrow {
    :before {
      right: -4px;
      top: -4.7px;
      border-right: 0px;
      border-bottom: 0px;
    }
  }
  &[data-popper-placement^='top'] {
    margin-bottom: 4px;
  }
  &[data-popper-placement^='top'] > #arrow {
    bottom: -0.7px;
    :before {
      right: -4px;
      border-left: 0px;
      border-top: 0px;
    }
  }
`
const flatStyles = styled.div`
  #arrow {
    display: flex;
    align-items: center;
    justify-items: center;
    background-color: inherit;
    border-width: 0px;
    :before {
      content: '';
      width: 8px;
      height: 8px;
      position: absolute;
      transform: rotate(45deg);
      background-color: inherit;
    }
  }
  &[data-popper-placement^='right'] {
    margin-left: 4px;
  }
  &[data-popper-placement^='right'] > #arrow {
    :before {
      left: -4px;
    }
  }
  &[data-popper-placement^='left'] {
    margin-right: 4px;
  }
  &[data-popper-placement^='left'] > #arrow {
    right: 0px;
    :before {
      right: -4px;
    }
  }
  &[data-popper-placement^='bottom'] {
    margin-top: 4px;
  }
  &[data-popper-placement^='bottom'] > #arrow {
    :before {
      right: -4px;
      top: -4px;
    }
  }
  &[data-popper-placement^='top'] {
    margin-bottom: 4px;
  }
  &[data-popper-placement^='top'] > #arrow {
    bottom: 0px;
    :before {
      right: -4px;
    }
  }
`
