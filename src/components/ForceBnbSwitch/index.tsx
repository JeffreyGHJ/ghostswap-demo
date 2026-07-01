import { useWeb3React } from '@web3-react/core'
import BnbSwitch from '../BnbSwitch'

const ForceBnbSwitch = ({ children }) => {
  const { chainId, account } = useWeb3React()
  return (
    <>
      {(!account || chainId === 56) && <>{children}</>}
      {account && chainId !== 56 && <BnbSwitch />}
    </>
  )
}

export default ForceBnbSwitch
