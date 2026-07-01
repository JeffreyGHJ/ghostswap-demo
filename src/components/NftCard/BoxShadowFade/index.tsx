const BoxShadowFade = ({ show }) => {
  return (
    <div id="box-shadows" className="absolute z-10 w-full h-full">
      <div
        style={show ? { boxShadow: 'inset 0px 0px 0px black' } : { boxShadow: 'inset 8px 8px 10px black' }}
        className="absolute w-full h-full overflow-hidden transition-all ease-in-out duration-[2s]"
      ></div>
      <div
        style={show ? { boxShadow: 'inset 0px 0px 0px black' } : { boxShadow: 'inset -8px -8px 10px black' }}
        className="absolute w-full h-full overflow-hidden transition-all ease-in-out duration-[2s]"
      ></div>
      <div
        style={show ? { boxShadow: 'inset 0px 0px 0px black' } : { boxShadow: 'inset 0px 0px 40px black' }}
        className="absolute w-full h-full overflow-hidden transition-all ease-in-out duration-[2s]"
      ></div>
    </div>
  )
}

export default BoxShadowFade
