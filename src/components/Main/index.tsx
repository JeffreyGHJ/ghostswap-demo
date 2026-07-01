const Main = ({ children, styles = null }) => {
  return (
    <main className={'relative flex flex-col items-center justify-start w-full h-[calc(100%-3.5rem)] max-h-full '}>
      {children}
    </main>
  )
}

export default Main
