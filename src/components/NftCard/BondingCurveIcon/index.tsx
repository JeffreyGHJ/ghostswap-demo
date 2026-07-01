import { ArrowLongRightIcon } from '@heroicons/react/24/solid'
import ArrowHalfCircle from '../../../../public/icons/ArrowHalfCircle'
import CurvedArrow from '../../../../public/icons/CurvedArrow'

const BondingCurveIcon = (props) => {
  return (
    <div className="mr-1 p-3px">
      {props.type == 'exponential' && (
        <div className="flex items-center justify-center gap-1">
          <div
            style={{ transform: 'scaleX(-1) rotate(-90deg)' }}
            className="flex items-center justify-center w-5 h-5 text-white border border-black bg-[#c17223]"
          >
            <CurvedArrow width={10} height={10} />
          </div>
          <div className="font-bold text-[14.4px] tracking-[-.06em]">EXP</div>
        </div>
      )}
      {props.type == 'linear' && (
        <div className="flex items-center justify-center gap-1">
          <div className="flex items-center justify-center w-5 h-5 text-white border border-black bg-blue">
            <ArrowLongRightIcon style={{ transform: 'rotate(-45deg)' }} width={12} height={12} />
          </div>
          <div className="font-bold text-[14.4px] tracking-[-.06em]">LIN</div>
        </div>
      )}
      {props.type == 'xyk' && (
        <div className="flex items-center justify-center gap-1">
          <div className="flex items-center justify-center w-5 h-5 text-white border border-black bg-[#e43d9f]">
            <div style={{ transform: 'rotate(133deg)' }} className="flex items-center justify-center">
              <ArrowHalfCircle width={11} height={11} />
            </div>
          </div>
          <div className="font-bold text-[14.4px] tracking-[-.06em]">XYK</div>
        </div>
      )}
    </div>
  )
}

export default BondingCurveIcon
