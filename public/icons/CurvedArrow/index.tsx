const CurvedArrow = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox="0 0 24 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="17 1 21 5 17 9"></polyline>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
    </svg>
  )
}
export default CurvedArrow
