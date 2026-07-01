import Popover, { PopoverProps } from '../Popover'
import React, { ReactNode, useCallback, useState } from 'react'
import { classNames } from '../../functions'

interface TooltipProps extends Omit<PopoverProps, 'content'> {
  text: ReactNode
}

interface TooltipContentProps extends Omit<PopoverProps, 'content'> {
  content: ReactNode
}

interface ArrowTooltipFlatProps extends TooltipContentProps {
  backgroundColor?: string
  textStyle?: string
  rounded?: string
}

interface ArrowTooltipBorderedProps extends ArrowTooltipFlatProps {
  borderColor?: string
}

interface MouseoverArrowTooltipBorderedProps extends Omit<ArrowTooltipFlatProps, 'show'> {
  borderColor?: string
}

interface MouseoverArrowTooltipFlatProps extends Omit<ArrowTooltipFlatProps, 'show'> {}

export default function Tooltip({ text, ...rest }: TooltipProps) {
  return (
    <Popover
      content={
        <div className="w-[228px] px-2 py-1 font-medium bg-dark-700 border border-gray-600 rounded text-sm">{text}</div>
      }
      {...rest}
    />
  )
}

export function TooltipContent({ content, ...rest }: TooltipContentProps) {
  return <Popover content={<div className="w-64 py-[0.6rem] px-4 break-words">{content}</div>} {...rest} />
}

export function MouseoverTooltip({ children, ...rest }: Omit<TooltipProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  )
}

export function MouseoverTooltipContent({ content, children, ...rest }: Omit<TooltipContentProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <TooltipContent {...rest} show={show} content={content}>
      <div
        style={{ display: 'inline-block', lineHeight: 0, padding: '0.25rem' }}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {children}
      </div>
    </TooltipContent>
  )
}

// has 1px border around tooltip container and arrow
export function ArrowTooltipBordered({
  content,
  arrow = {},
  rounded = 'rounded-md',
  textStyle = 'text-[#95aac9]',
  borderColor = 'border-black',
  backgroundColor = 'bg-dark-850',
  hideOverflow = false,
  ...rest
}: ArrowTooltipBorderedProps) {
  const popperClass = classNames('border z-[999]', `${rounded}`, `${borderColor}`, `${backgroundColor}`)
  const contentContainer = classNames('px-1 py-1', `${textStyle}`)
  return (
    <Popover
      bordered
      arrow={arrow}
      content={content}
      popperClass={popperClass}
      contentContainer={contentContainer}
      hideOverflow={hideOverflow}
      {...rest}
    />
  )
}

// does not have the 1px border around the arrow and popover
export function ArrowTooltipFlat({
  content,
  arrow = {},
  rounded = 'rounded-md',
  textStyle = 'text-[#95aac9]',
  backgroundColor = 'bg-dark-850',
  ...rest
}: ArrowTooltipFlatProps) {
  const popperClass = classNames(`${rounded}`, `${backgroundColor}`)
  const contentContainer = classNames('px-[6px] py-[6px]', `${textStyle}`)
  return (
    <Popover arrow={arrow} content={content} popperClass={popperClass} contentContainer={contentContainer} {...rest} />
  )
}

export function MouseoverArrowTooltipFlat({
  content,
  arrow = {},
  rounded = 'rounded-md',
  textStyle = 'text-[#95aac9]',
  backgroundColor = 'bg-dark-850',
  ...rest
}: MouseoverArrowTooltipFlatProps) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  const popperClass = classNames(`${rounded}`, `${backgroundColor}`)
  const contentContainer = classNames('px-[6px] py-[6px]', `${textStyle}`)
  return (
    <div onMouseEnter={open} onMouseLeave={close}>
      <Popover
        show={show}
        arrow={arrow}
        content={content}
        popperClass={popperClass}
        contentContainer={contentContainer}
        {...rest}
      />
    </div>
  )
}

export function MouseoverArrowTooltipBordered({
  content,
  arrow = {},
  rounded = 'rounded-md',
  textStyle = 'text-[#95aac9]',
  borderColor = 'border-black',
  backgroundColor = 'bg-dark-850',
  ...rest
}: MouseoverArrowTooltipBorderedProps) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  const popperClass = classNames('border z-[999]', `${rounded}`, `${borderColor}`, `${backgroundColor}`)
  const contentContainer = classNames('px-[6px] py-[6px]', `${textStyle}`)
  return (
    <div onMouseEnter={open} onMouseLeave={close}>
      <Popover
        bordered
        show={show}
        arrow={arrow}
        content={content}
        popperClass={popperClass}
        contentContainer={contentContainer}
        {...rest}
      />
    </div>
  )
}

// has no default styling applied at all
export function HeadlessTooltip({ content, ...rest }: ArrowTooltipBorderedProps) {
  return <Popover content={content} {...rest} />
}
