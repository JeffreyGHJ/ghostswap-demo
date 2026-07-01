import useBlockInvalidInput from '../../../hooks/useBlockInvalidInput'

const defaultInput = ' pl-3 py-2 bg-black leading-[1.5] w-full h-full '
const defaultDisplayClass = ' flex items-center px-3 border-l border-l-[#161522] h-full '
const defaultContainer =
  ' flex items-center overflow-hidden w-full h-[2.8rem] border border-dark-850 rounded-md bg-black '

const Input = ({
  value,
  onUserInput,
  mode = 'decimal',
  containerClass = defaultContainer,
  inputClass = defaultInput,
  displayClass = defaultDisplayClass,
  display = null,
  onBlur = null,
  ...rest
}) => {
  const validateKeyDown = useBlockInvalidInput()
  const handleChange = (e) => {
    if (rest?.max && e.target.value > rest?.max) return
    if (rest?.min && e.target.value < rest?.min) return
    onUserInput(e.target.value)
  }
  return (
    <div id="input-group" className={containerClass}>
      <input
        type="number"
        value={value}
        min={rest?.min || 0}
        max={rest?.max || null}
        step={rest?.step || mode === 'decimal' ? 0.001 : 1}
        placeholder={rest?.placeholder || 'Enter value'}
        onKeyDown={(e) => validateKeyDown(e, mode)}
        onChange={(e) => handleChange(e)}
        onBlur={() => (onBlur ? onBlur() : {})}
        className={inputClass}
        disabled={rest.disabled || false}
      ></input>
      {display && (
        <div id="display" className={displayClass}>
          {display}
        </div>
      )}
    </div>
  )
}

export default Input
