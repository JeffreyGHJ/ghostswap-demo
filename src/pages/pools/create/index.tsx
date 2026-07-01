import ForceBnbSwitch from '../../../components/ForceBnbSwitch'
import PoolBuilder from '../../../components/PoolBuilder'

const create = () => {
  return (
    <ForceBnbSwitch>
      <div id="create-pool-page" className="w-full">
        <div
          id="create-container"
          className="flex flex-col items-center justify-center w-[80rem] max-w-[99%] m-auto mt-3 border-2 border-gray-700 bg-black mb-[9rem] rounded-md p-[1.5rem]"
        >
          <div id="title" className="w-full mb-[16px] border-b border-gray-700">
            <div className="w-full text-center text-[32px] mb-[1.125rem] tracking-tight font-bold">Create Pool</div>
            <div className="w-full text-center mb-[16px]">
              Provide liquidity to buy, sell, or trade NFTs on your behalf.
            </div>
          </div>

          <PoolBuilder />
        </div>
      </div>
    </ForceBnbSwitch>
  )
}

export default create
