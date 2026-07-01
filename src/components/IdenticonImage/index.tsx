import Identicon from 'identicon.js'

const identiconOptions = (size) => {
  return {
    size: size || 20,
    background: [0, 0, 0, 255],
    margin: 0.2,
    // foreground: [255,0,0,255], /* default: random value */
    // saturation: 0.5,           /* between 0.0 and 1.0 */
    // brightness: 0.5            /* between 0.0 and 1.0 */
  }
}

const IdenticonImage = (props: any) => {
  return (
    <img
      id="identicon-image"
      src={'data:image/png;base64,' + new Identicon(props.address, identiconOptions(props.size))}
      width={props.width || props.height || '20px'}
      height={props.height || props.width || '20px'}
      className="rounded-full"
    ></img>
  )
}

export default IdenticonImage
