import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const Portal = (props) => {
  const ref = useRef()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    ref.current = document.querySelector(props.selector)
    setMounted(true)
  }, [props.selector])

  return mounted ? createPortal(props.children, ref.current) : null
}

export default Portal
