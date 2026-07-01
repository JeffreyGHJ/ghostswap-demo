import { useEffect, useState } from 'react'
import Button from '../Button'
import ChevronDownSvg from '../../../public/icons/ChevronDownSvg'
import ExternalLinkSvg from '../../../public/icons/ExternalLinkSvg'

const defaultLink = 'https://ghostswap.finance/nftamm'

// TODO: make this a generic, configurable component

const DropdownMenu = (props: any) => {
  const [externalLinksVisible, setExternalLinksVisible] = useState(false)

  const toggleExternalLinks = () => {
    setExternalLinksVisible(!externalLinksVisible)
  }

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (externalLinksVisible && (e.target as Element).closest('ul')?.id !== 'drop-down-menu') {
        setExternalLinksVisible(false)
      }
    }
    function escapeExternalLinks(e: KeyboardEvent) {
      if (externalLinksVisible && e.code === 'Escape') setExternalLinksVisible(false)
    }
    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('keydown', escapeExternalLinks)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('keydown', escapeExternalLinks)
    }
  }, [externalLinksVisible])

  return (
    <div id="drop-down-menu" className="relative flex flex-row items-center ml-2">
      <button
        onClick={toggleExternalLinks}
        id="dropdown-button"
        style={{ paddingBottom: '.1875rem', paddingTop: '.1875rem', fontSize: '.97rem' }}
        className="flex items-center px-3 bg-gray-700 border border-black rounded-md hover:border-gray-600 whitespace-nowrap hover:bg-gray-600"
      >
        External Links
        <span className="ml-1">
          <ChevronDownSvg width="20" height="20" />
        </span>
      </button>
      {externalLinksVisible && (
        <ul
          id="drop-down-list"
          style={{ transform: 'translate(0, 100%)', width: '12rem' }}
          className="absolute bottom-0 z-50 flex flex-col py-3 rounded-md bg-dark-850"
        >
          {props.details.website ?

            <li>
              <a
                href={props.details.website }
                className="flex flex-row items-center justify-start p-2 hover:bg-dark-500"
              >
              <span className="mr-1">
                <ExternalLinkSvg width="20" height="20" />
              </span>
                <span>Website</span>
              </a>
            </li> : <></>
          }

          {props.details.twitter ?

            <li>
              <a
                href={props.details.twitter }
                className="flex flex-row items-center justify-start p-2 hover:bg-dark-500"
              >
              <span className="mr-1">
                <ExternalLinkSvg width="20" height="20" />
              </span>
                <span>Twitter</span>
              </a>
            </li> : <></>
          }

          {props.details.discord ?

            <li>
              <a
                href={props.details.discord }
                className="flex flex-row items-center justify-start p-2 hover:bg-dark-500"
              >
              <span className="mr-1">
                <ExternalLinkSvg width="20" height="20" />
              </span>
                <span>Discord</span>
              </a>
            </li> : <></>
          }

          {props.details.telegram ?

            <li>
              <a
                href={props.details.telegram }
                className="flex flex-row items-center justify-start p-2 hover:bg-dark-500"
              >
              <span className="mr-1">
                <ExternalLinkSvg width="20" height="20" />
              </span>
                <span>Telegram</span>
              </a>
            </li> : <></>
          }

          {(!props.details.telegram && !props.details.website && !props.details.discord && !props.details.twitter) ?

            <li>
              <a
                href={props.details.telegram }
                className="flex flex-row items-center justify-start p-2 hover:bg-dark-500"
              >
              <span className="mr-1">
                <ExternalLinkSvg width="20" height="20" />
              </span>
                <span>No Links Found</span>
              </a>
            </li> : <></>
          }


        </ul>
      )}
    </div>
  )
}

export default DropdownMenu
