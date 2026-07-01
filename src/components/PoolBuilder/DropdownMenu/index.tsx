import { useEffect, useState } from 'react'
import ChevronDownSvg from '../../../../public/icons/ChevronDownSvg'

const DropdownMenu = (props: any) => {
  const [menuVisible, setMenuVisible] = useState(false)

  const toggleMenuVisible = (e) => {
    setMenuVisible(!menuVisible)
    e.stopPropagation()
  }

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuVisible && !(e.target as Element).closest('div')?.id?.includes('dropdown')) {
        setMenuVisible(false)
      }
    }
    function escapeExternalLinks(e: KeyboardEvent) {
      if (menuVisible && e.code === 'Escape') setMenuVisible(false)
    }
    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('keydown', escapeExternalLinks)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('keydown', escapeExternalLinks)
    }
  }, [menuVisible])

  return (
    <div id="dropdown-menu" className="relative flex flex-row items-center justify-center w-full h-full">
      <button
        onClick={(e) => toggleMenuVisible(e)}
        id="dropdown-button"
        className="flex text-[.97rem] items-center justify-center w-full py-2 px-3 bg-gray-700 border border-black rounded-md hover:border-gray-600 whitespace-nowrap hover:bg-gray-600"
      >
        {props.buttonContent || 'Options'}
        <span className="ml-1">
          <ChevronDownSvg width="20" height="20" />
        </span>
      </button>
      {menuVisible && (
        <div
          id="dropdown-list"
          style={{ transform: 'translate(0, 100%)', width: props.menuWidth || '16rem' }}
          className="absolute bottom-0 left-0 z-50 flex flex-col py-3 rounded-md bg-dark-850"
        >
          {props?.items?.map((item, index) => (
            <MenuItem key={index} index={index}>
              {item}
            </MenuItem>
          ))}
        </div>
      )}
    </div>
  )
}

const MenuItem = (props) => {
  return (
    <div id={`menu-item-${props.index}`} className="px-4 py-[6px] hover:bg-dark-600 cursor-pointer">
      {props.content || props.children}
    </div>
  )
}

export default DropdownMenu
