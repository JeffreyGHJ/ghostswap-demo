import Link from 'next/link'
import IdenticonImage from '../../../../components/IdenticonImage'
import ExternalLink from '../../../../components/ExternalLink'

const link = 'underline cursor-pointer hover:text-gray-300 '

const PoolAddresses = ({ poolAddress, ownerAddress }) => {
  return (
    <div id="pool-details" className="flex gap-6 justify-evenly md:justify-start">
      <div id="pool" className="flex-col items-center">
        <div id="label" className="text-[16px] text-[#95AAC9]">
          Pool
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-black rounded-full mr-[6px]">
            {poolAddress && <IdenticonImage address={poolAddress} />}
          </div>
          <Link
            href={{
              pathname: `/pools/view/[address]`,
              query: {
                address: poolAddress,
              },
            }}
          >
            <div
              className={'underline cursor-pointer hover:text-gray-300 ' + (poolAddress ? '' : 'pointer-events-none')}
            >
              {poolAddress?.slice(0, 6) + '...' + poolAddress?.slice(-4)}
            </div>
          </Link>
        </div>
      </div>

      <div id="pool-owner" className="flex-col items-center">
        <div id="label" className="text-[16px] text-[#95AAC9]">
          Pool Owner
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-black rounded-full mr-[6px]">
            {ownerAddress && <IdenticonImage address={ownerAddress} />}
          </div>
          <ExternalLink href={'https://bscscan.com/address/' + ownerAddress} className="text-white">
            <div className={link + (ownerAddress ? '' : 'pointer-events-none')}>
              {ownerAddress?.slice(0, 6) + '...' + ownerAddress?.slice(-4)}
            </div>
          </ExternalLink>
        </div>
      </div>
    </div>
  )
}

export default PoolAddresses
