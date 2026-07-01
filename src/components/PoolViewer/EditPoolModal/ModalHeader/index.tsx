import { X } from 'react-feather'
import { modalStateToTitle } from '../functions'

const ModalHeader = ({ modalState, closeModal }) => {
  return (
    <div
      id="modal-header"
      className="relative flex items-center justify-center px-6 py-4 border-b border-b-dark-500 ts-[.02rem] font-bold "
    >
      <div id="title" className="text-[1.45rem] w-full text-center ">
        {modalStateToTitle(modalState)}
      </div>
      <div
        id="close-modal-btn"
        className="absolute top-0 right-0 p-4 text-gray-500 cursor-pointer hover:text-white"
        onClick={() => closeModal()}
      >
        <X size={30} />
      </div>
    </div>
  )
}

export default ModalHeader
