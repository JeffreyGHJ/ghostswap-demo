import BnbIconSvg from '../../../../public/icons/BnbIconSvg'
import RightArrow from '../../RightArrow'

const SelectPoolType = (props) => {
  const poolVariants = [
    {
      type: 'BUY',
      title: 'Buy NFTs with tokens',
      graphics: (
        <>
          <TokenCircle first />
          <AnimatedArrows />
          <NftCircle />
        </>
      ),
      description: (
        <>
          You will <strong>deposit tokens</strong> and <strong>receive NFTs</strong> as people swap their NFTs for your
          deposited tokens.
        </>
      ),
    },
    {
      type: 'SELL',
      title: 'Sell NFTs for tokens',
      graphics: (
        <>
          <NftCircle first />
          <AnimatedArrows />
          <TokenCircle />
        </>
      ),
      description: (
        <>
          You will <strong>deposit NFTs</strong> and <strong>receive tokens</strong> as people swap their tokens for
          your deposited NFTs.
        </>
      ),
    },
    {
      type: 'BUY_AND_SELL',
      title: 'Do both and earn trading fees',
      graphics: (
        <>
          <LayeredCircles />
          <AnimatedArrows />
          <TradingFeesCircle />
        </>
      ),
      description: (
        <>
          You will <strong>deposit both NFTs and tokens</strong> and earn trading fees as people buy or sell NFTs using
          your pool.
        </>
      ),
    },
  ]

  return (
    <>
      <div id="step-info" className="w-full mb-3 text-[15px] text-gray-500 tracking-tight">
        <div style={{ WebkitTextStrokeWidth: '0.8px' }}>
          Step {props.currentStep || '?'}/{props.TOTAL_STEPS || '?'}: {props.description || 'DESCRIPTION_TEXT'}
        </div>
      </div>

      <div id="description" className="w-full text-[1.6rem] mb-3 text-center">
        I want to...
      </div>

      <div id="options-flex-row" className="relative flex flex-col gap-3 lg:flex-row">
        {poolVariants.map((pool, index) => (
          <OptionCard
            key={index}
            incrementCurrentStep={props.incrementCurrentStep}
            title={pool.title}
            setPoolType={() => props.setPoolType(pool.type)}
          >
            <div id="graphics" className="flex h-[5rem] w-auto items-center justify-center my-6">
              <div className="absolute flex">{pool.graphics}</div>
            </div>
            <div id="description" className="tracking-tight text-center text-[15px]">
              {pool.description}
            </div>
          </OptionCard>
        ))}
      </div>
    </>
  )
}

const OptionCard = (props) => {
  return (
    <div
      id="option-card"
      className="border-2 flex-col flex-1 border-gray-700 rounded-lg bg-dark-900 px-[36px] py-[24px] cursor-pointer hover:bg-black"
      onClick={() => {
        props.incrementCurrentStep()
        props.setPoolType()
      }}
    >
      <div
        id="option-card-title"
        style={{ WebkitTextStrokeWidth: 'thin' }}
        className="w-full mb-[1.125rem] tracking-tight text-[1.25rem] leading-[1.1] text-center"
      >
        {props.title || 'TITLE TEXT'}
      </div>

      <div id="option-card-content" className="w-full">
        {props.children || <div>CONTENT HERE</div>}
      </div>
    </div>
  )
}

const AnimatedArrows = () => {
  return (
    <div id="arrows" className="relative flex items-center justify-center pr-2">
      <div className="absolute left-[20%]">
        <RightArrow height={32} width={32} pathClasses={'animate-pulse-stroke-reverse'} />
      </div>
      <RightArrow height={32} width={32} pathClasses={'animate-pulse-stroke'} />
    </div>
  )
}

const TokenCircle = (props) => {
  return (
    <div
      id="circle"
      style={{ backgroundColor: props.first ? 'black' : '#2e3b54' }}
      className="flex items-center justify-center border-2 border-white rounded-full w-[76px] h-[76px]"
    >
      <BnbIconSvg width={30} height={30} fill={'#fff'} />
    </div>
  )
}

const NftCircle = (props) => {
  return (
    <div
      id="circle"
      style={{ backgroundColor: props.first ? 'black' : '#2e3b54' }}
      className="flex items-center justify-center border-2 border-white rounded-full w-[76px] h-[76px]"
    >
      <div id="layered-text" style={{ transform: 'scaleY(.8)' }} className="relative flex items-center justify-center">
        <div
          style={{ WebkitTextStrokeWidth: 'thin', transform: 'translate(-1px, -.5px)' }}
          className="text-[26px] text-[#ff00ff] tracking-wider absolute z-10"
        >
          NFT
        </div>
        <div
          style={{ WebkitTextStrokeWidth: 'thin', transform: 'translate(1px, .5px)' }}
          className="text-[26px] text-[#00ffff] tracking-wider absolute z-10"
        >
          NFT
        </div>
        <div
          style={{ WebkitTextStrokeWidth: 'thin' }}
          className="text-[26px] tracking-wider text-white z-20 opacity-95"
        >
          NFT
        </div>
      </div>
    </div>
  )
}

const TradingFeesCircle = (props) => {
  return (
    <div
      id="circle"
      style={{ backgroundColor: props.first ? 'black' : '#2e3b54' }}
      className="flex items-center justify-center border-2 border-white rounded-full w-[76px] h-[76px]"
    >
      <div
        id="layered-text"
        style={{ transform: 'scaleY(.8)' }}
        className="relative flex items-center justify-center mt-1 text-center"
      >
        <div
          style={{ transform: 'translate(-.5px, -.25px)' }}
          className="text-[11px] text-[#ff00ff] tracking-wider absolute z-10"
        >
          TRADING FEES
        </div>
        <div
          style={{ transform: 'translate(.5px, .25px)' }}
          className="text-[11px] text-[#00ffff] tracking-wider absolute z-10"
        >
          TRADING FEES
        </div>
        <div className="text-[11px] tracking-wider text-white z-20">TRADING FEES</div>
      </div>
    </div>
  )
}

const LayeredCircles = () => {
  return (
    <div id="layered-circles-container">
      <div id="layered-circles" className="relative w-[130px] h-[76px]">
        <div className="absolute right-0">
          <TokenCircle first />
        </div>
        <div className="absolute left-0">
          <NftCircle first />
        </div>
      </div>
    </div>
  )
}

export default SelectPoolType
