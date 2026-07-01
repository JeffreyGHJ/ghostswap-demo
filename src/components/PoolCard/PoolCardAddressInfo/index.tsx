import useSpaceId from '../../../hooks/useSpaceId'
import IdenticonImage from '../../IdenticonImage'

const PoolCardAddressInfo = (props) => {
  const { spaceId } = useSpaceId(props.owner)

  return (
    <div id="pool-address-info" className="w-full leading-[1.5] text-gray-400 text-[15px]">
      <div id="pool-address" className="flex items-center justify-between mt-3">
        <div id="label" className="text-white">
          Pool
        </div>
        <div id="address" className="flex items-center justify-between">
          <div id="identicon" className="bg-black rounded-full mr-[0.375rem] w-4 h-4">
            {props.poolAddress && <IdenticonImage address={props.poolAddress} />}
          </div>
          <div id="value" className="flex">
            <div className="font-mono">{props.poolAddress && props.poolAddress.slice(0, 6)}</div>
            <div className="mt-[-1px]">...</div>
            <div className="font-mono">{props.poolAddress.slice(-4)}</div>
          </div>
        </div>
      </div>
      <div id="owner-address" className="flex items-center justify-between mt-3">
        <div id="label" className="text-white">
          Owner
        </div>
        <div id="address" className="flex items-center justify-between">
          <div id="identicon" className="bg-black rounded-full mr-[0.375rem] w-4 h-4">
            {props.owner && <IdenticonImage address={props.owner} />}
          </div>
          <div id="value" className="flex">
            {!spaceId && (
              <>
                <div className="font-mono">{props.owner && props.owner.slice(0, 6)}</div>
                <div className="mt-[-1px]">...</div>
                <div className="font-mono">{props.owner && props.owner.slice(-4)}</div>
              </>
            )}
            {spaceId && <div className="font-mono">{spaceId}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoolCardAddressInfo
