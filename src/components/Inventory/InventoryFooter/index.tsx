const btn = 'px-3 py-2 text-center rounded-md text-white font-bold tracking-tight cursor-pointer transition-colors '
const enabled = 'w-[9rem]  border-2 border-cyan-blue border-opacity-40 bg-cyan-blue bg-opacity-30 hover:bg-opacity-70'
const disabled = 'w-[9rem] border border-gray-300 bg-gray-400 hover:bg-gray-500 hover:border-gray-500'

const InventoryFooter = ({ selectedNfts, deselectAll, openModal }) => {
  return (
    // this specific height must work with the app footer height in mind
    <div id="footer" className="absolute bottom-0 flex w-full h-[3.5rem]">
      <div className={'w-full z-10 bg-dark-900 flex items-center justify-center h-[3.5rem] text-[15px]'}>
        <div className="flex gap-2">
          <div className={btn + (selectedNfts.length > 0 ? enabled : disabled)} onClick={() => deselectAll()}>
            Deselect All
          </div>
          <div
            className={btn + (selectedNfts.length > 0 ? enabled : disabled)}
            onClick={() => (selectedNfts.length > 0 ? openModal() : {})}
          >
            List {selectedNfts.length} NFT{selectedNfts.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryFooter
