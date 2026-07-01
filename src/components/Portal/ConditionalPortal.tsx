import Portal from '.'

const ConditionalPortal = (props) => {
  return <>{props.condition === true ? <Portal selector={props.selector}>{props.children}</Portal> : props.children}</>
}

export default ConditionalPortal
