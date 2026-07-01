import { RefreshCw } from 'react-feather'
import ExternalLinkSvg from '../../../../../public/icons/ExternalLinkSvg'
import ExternalLink from '../../../../components/ExternalLink'

const link = 'flex items-center text-[#b9b9ff] hover:text-[#6f6fc0] cursor-pointer'
const refreshbtn =
  'flex items-center text-[13px] rounded border border-white px-2 py-[2px] gap-2 hover:bg-gray-500 hover:border-gray-500 mt-3'

const NftMetadata = ({ address, id }) => {
  return (
    <div
      id="metadata"
      className="flex-col items-center justify-center w-full p-3 mt-6 border border-gray-800 rounded-md"
    >
      <div id="label" className="w-full text-[20px] font-black text-left mb-[0.375rem]">
        Details
      </div>
      <div className="flex flex-col gap-2">
        <div id="contract-address" className="flex items-center justify-between w-full text-[15px]">
          <div className="text-[#95AAC9]">Contract Address</div>
          <ExternalLink href={'https://bscscan.com/address/' + address} className={link}>
            <div className="mr-[6px] underline">{address.slice(0, 5) + '...' + address.slice(-4)}</div>
            <ExternalLinkSvg width={12} height={12} />
          </ExternalLink>
        </div>
        <div id="token-id" className="flex items-center justify-between w-full text-[15px]">
          <div className="text-[#95AAC9]">Token Id</div>
          <div>{id.length > 11 ? id.slice(0, 11) + '...' : id}</div>
        </div>
        <div className="block md:hidden">
          <div id="token-standard" className="flex items-center justify-between w-full text-[15px]">
            <div className="text-[#95AAC9]">Token Standard</div>
            <div>BEP-20</div>
          </div>
        </div>
      </div>

      <button className={refreshbtn}>
        <RefreshCw width={16} />
        <p>Refresh Metadata</p>
      </button>
    </div>
  )
}

export default NftMetadata
