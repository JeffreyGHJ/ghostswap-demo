import Link from 'next/link'

const ViewPoolLink = ({ poolAddress }) => {
  return (
    <Link
      href={{
        pathname: `/pools/view/[address]`,
        query: {
          address: poolAddress,
        },
      }}
    >
      <button className="w-full text-gray-800 ts-[.04rem] bg-[#b9b9ff] rounded-md text-[15px] hover:bg-[#6146a0] hover:text-pink transition-colors">
        View Pool
      </button>
    </Link>
  )
}

export default ViewPoolLink
