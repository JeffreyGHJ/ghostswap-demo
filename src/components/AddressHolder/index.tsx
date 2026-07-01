import { useEffect, useRef, useState } from 'react'
import CopySvg from '../../../public/icons/CopySvg'
import ExternalLinkSvg from '../../../public/icons/ExternalLinkSvg'
import { ArrowTooltipBordered as Tooltip } from '../Tooltip'
import axios from 'axios'
import Link from 'next/link'
import IdenticonImage from '../IdenticonImage'
import ExternalLink from '../ExternalLink'

const externalLinkDefault = 'ml-[0.375rem] text-white'
const addressDefault = 'px-2 py-1 font-mono'
const containerDefault = 'flex items-center justify-center'
const addressContainerDefault =
  ' flex flex-row items-center font-normal bg-gray-700 rounded-md text-xxs hover:bg-gray-600 md:text-xs2 pr-[6px]'

const AddressHolder = ({
  address,
  containerStyle = containerDefault,
  addressContainerStyle = addressContainerDefault,
  addressStyle = addressDefault,
  externalLinkStyle = externalLinkDefault,
  internalAddressLink = null,
  isUser = false,
  identicon = false,
  matchingWidth = null,
  short = false,
}) => {
  const [show, setShow] = useState(false)
  const [spaceName, setSpaceName] = useState('')

  const getSpaceName = async (address) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/spaceid/${address}`)
      setSpaceName(response.data.name)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (address && isUser) getSpaceName(address)
  }, [address, isUser])

  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(address)
    setShow(true)
    setTimeout(setShow, 2500, false)
  }

  return (
    <div className={containerStyle}>
      {identicon && <IdenticonImage address={address} />}
      <Tooltip
        placement="top"
        hideOverflow={true}
        show={show}
        content={'Copied!'}
        backgroundColor={'bg-gray-600'}
        textStyle={'text-white'}
      >
        <div
          id="wallet-id"
          className={'relative cursor-pointer ' + addressContainerStyle}
          onClick={() => copyIdToClipboard()}
        >
          <div
            id="wallet-id-string"
            style={matchingWidth !== null ? { maxWidth: matchingWidth + 'px' } : {}}
            className={addressStyle}
          >
            {spaceName && spaceName}
            {!spaceName && !short && (
              <div className="flex items-center">
                <div id="address-start">{address?.slice(0, 5)}</div>
                <div id="address-mid" className="overflow-hidden overflow-ellipsis">
                  {address?.slice(5, 38)}
                </div>
                <div id="address-end">{address?.slice(38)}</div>
              </div>
              // <div className="overflow-hidden overflow-ellipsis">{address}</div>
            )}
            {!spaceName && short && (
              <div className="flex items-center">
                <div id="address-start">{address?.slice(0, 6)}</div>
                <div id="address-mid" className="tracking-[-.14em]">
                  ...
                </div>
                <div id="address-end">{address.slice(38)}</div>
              </div>
            )}
          </div>

          <div className="flex items-center py-1">
            <CopySvg width="16" height="16" />
          </div>
        </div>
      </Tooltip>
      <ExternalLink href={`https://bscscan.com/address/${address}`} className={externalLinkStyle}>
        <ExternalLinkSvg width={16} />
      </ExternalLink>
      {internalAddressLink && (
        <Link
          href={{
            pathname: isUser ? `/pools/[address]` : `/pools/view/[address]`,
            query: {
              address: internalAddressLink,
            },
          }}
        >
          <img src="/logo.png" width={20} height={20} className="ml-1 cursor-pointer" />
        </Link>
      )}
    </div>
  )
}

export default AddressHolder
