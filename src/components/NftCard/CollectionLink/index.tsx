import router from 'next/router'

const cleanName = (name) => {
  let tokens = name.split(' ')
  let discards = ['#']
  tokens = tokens.filter((token) => {
    for (let char of discards) {
      if (token.includes(char)) return
    }
    return token
  })
  return tokens.join(' ')
}

const CollectionLink = ({ address, name }) => {
  return (
    // <Link
    //   href={{
    //     pathname: `/nftamm/collection/[address]`,
    //     query: {
    //       address: address.toLowerCase(),
    //     },
    //   }}
    // >
    <div
      onClick={(e) => {
        // console.log(address)
        e.stopPropagation()
        router.replace(`/nftamm/collection/${address}`)
      }}
    >
      <div className="flex flex-col items-center justify-center w-full ts-[.04rem]">
        <div
          className="w-full overflow-hidden text-center text-gray-500 whitespace-nowrap hover:text-white overflow-ellipsis"
          //   onClick={(e) => e.stopPropagation()}
        >
          {cleanName(name)}
        </div>
      </div>
      <div className="w-full max-w-[85%] bg-gradient-to-r from-cyan-blue to-pink px-4 h-[1px] m-auto" />
    </div>
    // </Link>
  )
}

export default CollectionLink
