import { classNames } from '../../functions'

const Divider = ({ className }: { className?: string }) => {
  return (
    <div
      className={classNames(
        `${className} w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20`
      )}
    ></div>
  )
}

export default Divider
