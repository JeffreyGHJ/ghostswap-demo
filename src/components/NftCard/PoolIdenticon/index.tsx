import { useState } from 'react'
import { MouseoverArrowTooltipBordered as Tooltip } from '../../Tooltip'
import PoolInfoTooltip from '../PoolInfoTooltip'
import getIdenticonColor from '../getIdenticonColor'
import IdenticonImage from '../../IdenticonImage'

const identiconHolder = 'z-[11] absolute w-[26px] h-[26px]'
const popper = 'z-50 bg-dark-850 border border-black rounded-lg text-[#95aac9]'
const NO_ADDRESS = '0x00000000000000000000000000000000'

const PoolIdenticon = ({ nftData, pool, buying = false }) => {
  const [color, _] = useState(getIdenticonColor(nftData?.poolAddress || nftData?.owner || NO_ADDRESS))
  const poolInfo = <PoolInfoTooltip color={color} nftData={nftData} pool={pool} />

  return (
    <div className="relative">
      <div className={identiconHolder}>
        <Tooltip content={poolInfo} arrow={{ offset: [0, -4] }} placement="right" popperClass={popper}>
          <IdenticonImage address={nftData?.poolAddress || NO_ADDRESS} />
        </Tooltip>
      </div>
    </div>
  )
}

export default PoolIdenticon
