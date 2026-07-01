import { ArrowLeftIcon, ArrowLongLeftIcon, ArrowSmallLeftIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'

const navButton = ' px-3 py-2 border-2 rounded flex items-center gap-2 '
const enabled = ' border-gray-700 hover:bg-gray-800 '
const disabled = ' border-gray-800 text-gray-600 cursor-none '

const PoolBuilderNav = (props) => {
  const [canContinue, setCanContinue] = useState(false)

  useEffect(() => {
    if (props.currentStep === 2) {
      setCanContinue(props.nftCollection && props.token)
    } else if (props.currentStep === 3) {
      setCanContinue(props.isConfigValid)
    } else {
      setCanContinue(false)
    }
  }, [props.nftCollection, props.token, props.currentStep, props.isConfigValid])

  return (
    <div id="nav-buttons" className="flex items-center justify-between h-10 mt-9">
      {props.currentStep > 1 && (
        <>
          <BackButton decrementCurrentStep={props.decrementCurrentStep} />
          {props.currentStep !== props.TOTAL_STEPS && (
            <NextButton incrementCurrentStep={props.incrementCurrentStep} canContinue={canContinue} />
          )}
        </>
      )}
    </div>
  )
}

const BackButton = (props) => {
  return (
    <button id="prev-button" className={navButton + enabled} onClick={() => props.decrementCurrentStep()}>
      <ArrowLeft size={20} />
      Prev Step
    </button>
  )
}

const NextButton = (props) => {
  return (
    <button
      id="next-button"
      className={navButton + (props.canContinue ? enabled : disabled)}
      onClick={() => (props.canContinue ? props.incrementCurrentStep() : '')}
    >
      Next Step
      <ArrowRight size={20} />
    </button>
  )
}

export default PoolBuilderNav
