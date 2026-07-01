import { useEffect, useState } from 'react'

import { hooks, trustWallet } from '../../../connectors/trustWallet'
import { Card } from '../Card'

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

export default function TrustWalletCard({ desiredChainId, setDesiredChainId }) {
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()

  const isActive = useIsActive()

  const provider = useProvider()
  const ENSNames = useENSNames(provider)

  const [error, setError] = useState(undefined)

  // attempt to connect eagerly on mount
  useEffect(() => {
    void trustWallet.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask')
    })
  }, [])

  return (
    <Card
      connector={trustWallet}
      activeChainId={chainId}
      isActivating={isActivating}
      isActive={isActive}
      error={error}
      setError={setError}
      accounts={accounts}
      provider={provider}
      ENSNames={ENSNames}
      iconSrc={'/images/wallets/trust.svg'}
      name={'TrustWallet'}
      desiredChainId={desiredChainId}
      setDesiredChainId={setDesiredChainId}
    />
  )
}
