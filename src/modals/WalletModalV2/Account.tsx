import Copy from '../../components/AccountDetails/Copy'
import Typography from '../../components/Typography'
import { shortenAddress } from '../../functions'
import ExternalLink from '../../components/ExternalLink'
import { ExternalLink as LinkIcon } from 'react-feather'
import { getExplorerLink } from '../../functions/explorer'
import { useWeb3React } from '@web3-react/core'
import { getName } from '../../constants/walletconnectupdate'

const Account = ({ account, ENSName, chainId, showConnectionOptions }) => {
  const { connector } = useWeb3React()
  return (
    <>
      <div className="flex items-center text-[14px] justify-between mb-2">
        {connector && <div className="text-secondary ">Connected with {getName(connector)}</div>}
        <div
          className="px-2 py-1 text-xs rounded-full cursor-pointer bg-dark-700"
          onClick={() => showConnectionOptions()}
        >
          Connection Options
        </div>
      </div>

      {account && (
        <div id="web3-account-identifier-row" className="flex flex-col justify-center space-y-3">
          {/*getStatusIcon()*/}
          {ENSName ? (
            <div className="bg-dark-800">
              <Typography>{ENSName}</Typography>
            </div>
          ) : (
            <div className="px-3 py-2 rounded bg-dark-800">
              <Typography>{account && shortenAddress(account)}</Typography>
            </div>
          )}
          <div className="flex items-center gap-2 space-x-3">
            {chainId && account && (
              <ExternalLink
                color="blue"
                startIcon={<LinkIcon size={16} />}
                href={chainId && getExplorerLink(chainId, ENSName || account, 'address')}
              >
                <Typography variant="sm">{`View on explorer`}</Typography>
              </ExternalLink>
            )}
            {account && (
              <Copy toCopy={account}>
                <Typography variant="sm">{`Copy Address`}</Typography>
              </Copy>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Account
