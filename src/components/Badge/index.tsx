import React from 'react'

export type BadgeColor =
  | 'default'
  | 'gray'
  | 'blue'
  | 'pink'
  | 'lightPink'
  | 'green'
  | 'red'
  | 'yellow'
  | 'lightYellow'
  | 'cyan'
  | 'gradient'
export type BadgeSize = 'default' | 'xsmall' | 'small' | 'medium' | 'large'

export interface BadgeProps {
  children?: React.ReactChild | React.ReactChild[]
  color?: BadgeColor
  size?: BadgeSize
}

export const COLOR = {
  default: '',
  gray: 'bg-gray-100 bg-opacity-20 rounded-full text-xs text-white',
  blue: 'bg-blue bg-opacity-20 outline-blue rounded text-xs text-[#4f82ce] ',
  pink: 'bg-pink bg-opacity-20 outline-pink rounded text-xs text-pink ',
  lightPink: 'bg-[#fa64d4] bg-opacity-25 outline-[#fa64d4] rounded text-xs text-[#fa64d4] ',
  green: 'bg-green bg-opacity-20 outline-green rounded text-xs text-green ',
  red: 'bg-red bg-opacity-20 outline-red rounded text-xs text-red ',
  yellow: 'bg-yellow bg-opacity-20 outline-yellow rounded text-xs text-yellow ',
  lightYellow: 'bg-light-yellow bg-opacity-20 outline-light-yellow rounded text-xs text-light-yellow ',
  cyan: 'bg-cyan-blue bg-opacity-20 outline-cyan-blue rounded text-xs text-cyan-blue ',
  gradient:
    'bg-gradient-to-r from-blue to-pink opacity-80 hover:opacity-100 bg-pink bg-opacity-20 outline-pink rounded text-base text-white ',
}

export const SIZE = {
  default: 'text-xs px-2 py-1',
  xsmall: 'text-[.5rem] px-[.3rem] py-[.1rem]',
  small: 'text-[.6rem] px-[.3rem] py-[.1rem]',
  medium: 'text-sm px-2 py-1',
  large: 'text-lg px-2 py-1',
}

function Badge({
  color = 'default',
  size = 'default',
  children,
  className = 'flex items-center',
}: BadgeProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div className="flex items-center">
      <div className={`${COLOR[color]} ${SIZE[size]} ${className}`}>{children}</div>
    </div>
  )
}

export default Badge
