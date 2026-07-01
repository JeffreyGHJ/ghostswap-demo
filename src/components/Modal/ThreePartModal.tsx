import { Dialog } from '@headlessui/react'
import CloseIcon from '../CloseIcon'

const title = { lineHeight: '1.1', letterSpacing: '-.02em', fontSize: '1.25rem', fontWeight: 600 }

const ThreePartModal = (props: any) => {
  return (
    <Dialog id="modal-dialog" open={props.isOpen} onClose={() => props.closeModal()} className="max-h-[80vh]">
      <div id="modal-overlay" className="fixed inset-0 bg-black bg-opacity-80" aria-hidden="true" />
      <Dialog.Panel
        id="modal-main-panel"
        className="fixed inset-0 flex flex-col w-full m-auto bg-gray-900 border border-black rounded max-h-[80vh] max-w-[620px] h-fit"
      >
        <CloseModalButton id="modal-close" closeModal={props.closeModal} />

        <div id="modal-header" className="w-full px-6 py-4 border-b border-black">
          {props.header}
        </div>

        <div id="modal-body" className="w-full p-6 overflow-auto">
          {props.body}
        </div>

        <div id="modal-footer" className="w-full p-5 border-t border-black">
          {props.footer}
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}

const CloseModalButton = (props: any) => {
  return (
    <button
      type="button"
      aria-label="Close"
      className="absolute border border-black rounded-md hover:bg-gray-800 hover:border-gray-800 p-[.375rem] right-5 top-[14px]"
      onClick={() => props.closeModal()}
    >
      <CloseIcon width="15" height="15" />
    </button>
  )
}

export default ThreePartModal
