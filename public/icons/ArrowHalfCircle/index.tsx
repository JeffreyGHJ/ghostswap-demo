const ArrowHalfCircle = (props) => {
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
      <polyline points="1 4 1 10 7 10"></polyline>
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10"></path>
    </svg>
  )
}
export default ArrowHalfCircle
