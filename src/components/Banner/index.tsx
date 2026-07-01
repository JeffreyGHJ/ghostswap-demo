import { FC } from 'react'

const Banner: FC = () => (
  <div className="w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 border-b border-purple-700">
    <div className="px-4 py-2 mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-center gap-x-3 text-center">
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-300 uppercase tracking-wide">
        <span className="text-base">👻</span>
        Demo Mode
      </span>
      <span className="text-sm text-gray-300 hidden sm:inline">·</span>
      <span className="text-sm text-gray-300">
        This is a portfolio demo with mocked data — no real blockchain transactions occur.
      </span>
      <span className="text-sm text-gray-300 hidden sm:inline">·</span>
      <a
        href="https://github.com/enticive/ghostswap-frontend"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-purple-400 hover:text-purple-300 underline underline-offset-2 whitespace-nowrap"
      >
        View source →
      </a>
    </div>
  </div>
)

export default Banner
