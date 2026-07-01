import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { MouseoverArrowTooltipFlat as Tooltip } from '../../../../components/Tooltip'

const ContractAddressLink = ({ address, name, id, rank, maxRank }) => {
  return (
    <div id="contract-address" className="tracking-[-0.02em]">
      <div id="listings-link" className={'flex items-center gap-x-1 ' + (address ? '' : 'pointer-events-none')}>
        <Tooltip content={'View collection page'} placement="top">
          <QuestionMarkCircleIcon width={20} className="cursor-help" />
        </Tooltip>

        <Link
          href={{
            pathname: `/nftamm/collection/[address]`,
            query: {
              address: address,
            },
          }}
        >
          <div className="underline cursor-pointer text-[18px]">
            {name && name.match(/^(.*?)\s+#/) ? name.match(/^(.*?)\s+#/)[1] : address.slice(0, 6) + '...'}
          </div>
        </Link>
      </div>
      <div className="text-[32px] mt-[6px] font-black">{name}</div>
      {rank && (
        <div className="pl-[3px] mb-2 md:mb-0">
          Rank: {rank} / {maxRank}
        </div>
      )}
    </div>
  )
}

export default ContractAddressLink
