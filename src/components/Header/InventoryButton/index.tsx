import Link from 'next/link'

const InventoryButton = () => {
  return (
    <Link href="/inventory">
      <button
        id="inventory-button"
        className="rounded-lg bg-dark-700 py-[6px] px-[12px] hover:bg-dark-800 whitespace-nowrap"
      >
        <div className="flex items-center h-full">Your NFTs</div>
      </button>
    </Link>
  )
}

export default InventoryButton
