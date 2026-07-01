import Badge from '../Badge'
import CurvedArrow from '../../../public/icons/CurvedArrow'
import { ArrowLongRightIcon } from '@heroicons/react/24/outline'
import ArrowHalfCircle from '../../../public/icons/ArrowHalfCircle'
import { BadgeSize } from '../Badge'

export interface BondingCurveBadgeProps {
  bondingCurveType: string
  size?: BadgeSize
}

const ICON_SIZE = {
  xsmall: 7,
  small: 10,
  default: 12,
  medium: 14,
  large: 16,
}

const BondingCurveBadge = ({ size = 'default', bondingCurveType }: BondingCurveBadgeProps) => {
  const icon = ICON_SIZE[size]
  return (
    <div>
      {bondingCurveType === 'LINEAR' && (
        <Badge color="cyan" size={size} className="flex items-center font-bold">
          <div className="flex items-center justify-center text-cyan-blue">
            <ArrowLongRightIcon style={{ transform: 'rotate(-45deg)' }} width={icon} height={icon} strokeWidth={3} />
          </div>
          <div className="ts-[thin] leading-[1.5]">LIN</div>
        </Badge>
      )}
      {bondingCurveType === 'EXPONENTIAL' && (
        <Badge color="lightYellow" size={size} className="flex items-center font-bold">
          <div
            style={{ transform: 'scaleX(-1) rotate(-90deg)' }}
            className="flex items-center justify-center text-yellow"
          >
            <CurvedArrow width={icon - 1} height={icon - 1} />
          </div>
          <div className="ts-[thin] leading-[1.5]">EXP</div>
        </Badge>
      )}
      {bondingCurveType === 'XYK' && (
        <Badge color="lightPink" size={size} className="flex items-center font-bold">
          <div
            style={{ transform: 'rotate(133deg) translateX(2px)' }}
            className="flex items-center justify-center text-[#fa64d4]"
          >
            <ArrowHalfCircle width={icon - 1} height={icon - 1} />
          </div>
          <div className="ts-[thin] leading-[1.5]">XYK</div>
        </Badge>
      )}
    </div>
  )
}

export default BondingCurveBadge
