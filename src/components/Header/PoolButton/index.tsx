import Link from 'next/link'

const PoolButton = () => {
  return (
    <Link href="/pools">
      <button
        id="pool-button"
        className="rounded-lg bg-dark-700 py-[6px] px-[12px] hover:bg-dark-800 whitespace-nowrap"
      >
        <div className="flex items-center h-full">Your Pools</div>
      </button>
    </Link>
  )
}

export default PoolButton
