import Link from 'next/link'
import ExternalLinkSvg from '../../../../public/icons/ExternalLinkSvg'

const ViewItemLink = ({ id, address, svgSize = 12 }) => {
  return (
    <Link
      href={{
        pathname: `/nftamm/asset/[id]`,
        query: {
          id: id,
          address: address.toLowerCase(),
        },
      }}
    >
      <div className="flex items-center ml-2 text-indigo-300 hover:text-indigo-400 text-[0.9375rem] leading-[1.5] tracking-tighter gap-2">
        View Item
        <ExternalLinkSvg width={svgSize} height={svgSize} />
      </div>
    </Link>
  )
}

export default ViewItemLink
