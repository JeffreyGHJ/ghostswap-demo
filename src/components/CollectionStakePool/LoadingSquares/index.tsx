const LoadingSquares = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div style={{ aspectRatio: '1 / 1' }} className="p-10 rounded-lg bg-dark-700 animate-pulse bg-opacity-5"></div>
      <div
        style={{ aspectRatio: '1 / 1' }}
        className="p-10 rounded-lg bg-dark-700 aspect-square animate-pulse bg-opacity-5"
      ></div>
      <div
        style={{ aspectRatio: '1 / 1' }}
        className="p-10 rounded-lg bg-dark-700 aspect-square animate-pulse bg-opacity-5"
      ></div>
    </div>
  )
}

export default LoadingSquares
