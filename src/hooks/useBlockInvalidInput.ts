function useBlockInvalidInput() {
  const allowedKeys = {
    integer: [...'0123456789', 'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'],
    decimal: [...'0123456789', 'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '.'],
  }

  function validateKeyDown(e, type) {
    const validKeys = [...allowedKeys[type]]
    if (!validKeys.includes(e.key)) {
      e.preventDefault()
    }
  }

  return validateKeyDown
}

export default useBlockInvalidInput
