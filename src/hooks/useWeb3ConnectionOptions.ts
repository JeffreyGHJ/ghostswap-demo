import { useDispatch, useSelector } from 'react-redux'
import { showConnections, hideConnections } from '../state/web3Connections'

function useWeb3ConnectionOptions() {
  const dispatch = useDispatch()
  const connectionsVisible = useSelector((state: any) => state.web3Connections.connectionsVisible)

  const showConnectionOptions = () => {
    dispatch(showConnections())
  }

  const hideConnectionOptions = () => {
    dispatch(hideConnections())
  }

  return {
    showConnectionOptions,
    hideConnectionOptions,
  }
}

export default useWeb3ConnectionOptions
