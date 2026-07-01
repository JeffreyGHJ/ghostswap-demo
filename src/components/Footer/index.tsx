import Polling from '../Polling'

const Footer = () => {
  return (
    <footer className="absolute bottom-[3.5rem] left-0">
      <div className="relative z-[11] flex items-center justify-between pl-4 pb-2">
        <Polling />
      </div>
    </footer>
  )
}

export default Footer
