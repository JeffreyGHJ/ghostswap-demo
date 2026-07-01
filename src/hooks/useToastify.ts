import Toastify from 'toastify-js'

function useToastify() {
  const toastSuccess = (text) => {
    Toastify({
      text: text,
      duration: 1500,
      newWindow: true,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'linear-gradient(to right, #00b09b, #96c93d)',
      },
      onClick: function () {}, // Callback after click
    }).showToast()
  }

  const toastError = (text) => {
    Toastify({
      text: text,
      duration: 1500,
      newWindow: true,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'linear-gradient(to right, #c95e3d, #c93d75)',
      },
      onClick: function () {}, // Callback after click
    }).showToast()
  }

  return {
    toastSuccess,
    toastError,
  }
}

export default useToastify
