import { ArrowDown } from 'react-feather'

const gradient = ' bg-gradient-to-r from-blue to-[#8b8bbc]  hover:from-[#6f95fc] hover:to-[#6f95fc] '
const mobileBtn = ' absolute px-2 py-1 rounded-full right-[2rem] top-[-1rem] cursor-pointer '

const MobileCloseButton = ({ width, min, close }) => {
  return (
    <>
      {width < min && (
        <div id="mobile-close-btn" className={mobileBtn + gradient} onClick={() => close()}>
          <ArrowDown />
        </div>
      )}
    </>
  )
}

export default MobileCloseButton
