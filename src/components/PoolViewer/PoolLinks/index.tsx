import Link from 'next/link'
import { useRouter } from 'next/router'
import { Layout, Zap } from 'react-feather'

const link =
  ' flex items-center px-3 py-2 rounded-md bg-dark-800 border border-black cursor-pointer hover:border-dark-700 hover:bg-[#222536] transition-all duration-300'
const fallbackAvatar = '/../../question.png'

const nftAvatar = (avatarSrc) => {
  return <img src={avatarSrc} width={20} height={20} className="mx-1 rounded-full" />
}

const PoolLinks = ({ collectionAddress, poolAddress, name, avatar }) => {
  const router = useRouter()
  return (
    <div
      id="links"
      className="flex flex-wrap justify-center items-center whitespace-nowrap xs:justify-start w-full gap-3 text-[.85rem]"
    >
      <div
        id="collection-pools-link"
        className={link}
        onClick={() => {
          router.push(`/nftamm/collection/${collectionAddress}#pools`)
        }}
      >
        <Layout size={20} className="mr-2" /> View All {nftAvatar(avatar || fallbackAvatar)} {name} Pools
      </div>

      <Link
        href={{
          pathname: `/pools/swap/[address]`,
          query: {
            address: poolAddress,
          },
        }}
      >
        <div id="direct-swap-link" className={link}>
          <Zap size={20} className="mr-2" />
          Direct Pool Swap
        </div>
      </Link>
    </div>
  )
}

export default PoolLinks
