import useSwitchChain from '../../hooks/useSwitchChain'
const connectBtn =
  'px-2 py-2 m-auto text-base border-2 rounded cursor-pointer bg-dark-800 border-blue w-fit hover:border-cyan-blue tracking-tight'
const fixedGradientBorderContainer =
  'fixed top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] p-px rounded bg-gradient-to-r from-blue to-pink cursor-default overflow-hidden '
const BnbSwitch = () => {
  const { switchChain } = useSwitchChain()
  return (
    <div className={fixedGradientBorderContainer}>
      <div className="px-6 text-center rounded py-14 bg-dark-900">
        <div className="text-[20px] font-bold ts-3 text-pink mb-8">Please Connect to BNB Smart Chain</div>
        <div className={connectBtn} onClick={() => switchChain(56)}>
          Switch to BNB Chain
        </div>
        <div className="text-[16px] font-bold ts-3 text-pink mt-6">Polygon Support Coming Soon!</div>
      </div>
    </div>
  )
}

export default BnbSwitch
