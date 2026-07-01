import { ChainId, Currency, WNATIVE } from '@ghostlabsweb3/sdk'
import React, { FunctionComponent, useMemo } from 'react'

import Logo from '../Logo'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import useHttpLocations from '../../hooks/useHttpLocations'

//TODO: Update these token logo urls
const BLOCKCHAIN = {
  [ChainId.BSC]: 'bsc',
  [ChainId.BSC_TEST]: 'bsc_test',
}

function getCurrencySymbol(currency) {
  if (currency.symbol === 'WBNB') {
    return 'BNB'
  }
  return currency.symbol.toLowerCase()
}

export function getCurrencyLogoUrls(currency) {
  const urls = []


  return urls
}

const BnbLogo = 'https://www.logo.wine/a/logo/Binance/Binance-BNB-Icon-Logo.wine.svg'

const LOGO: { readonly [chainId in ChainId]?: string } = {
  [ChainId.BSC]: BnbLogo,
  [ChainId.BSC_TEST]: BnbLogo,
}

interface CurrencyLogoProps {
  currency?: Currency
  size?: string | number
  style?: React.CSSProperties
  className?: string
  squared?: boolean
}

const unknown = ''

const CurrencyLogo: FunctionComponent<CurrencyLogoProps> = ({
  currency,
  size = '24px',
  style,
  className = '',
  ...rest
}) => {
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI || currency.tokenInfo.logoURI : undefined
  )

  const srcs = useMemo(() => {
    if (!currency) {
      return [unknown]
    }

    if (currency['logoURI']) {
      return [currency['logoURI']]
    }

    if (currency.isNative || currency.equals(WNATIVE[currency.chainId])) {
      return [LOGO[currency.chainId], unknown]
    }

    if (currency.isToken) {
      const defaultUrls = [...getCurrencyLogoUrls(currency)]
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, ...defaultUrls, unknown]
      }
      return defaultUrls
    }
  }, [currency, uriLocations])

  return <Logo srcs={srcs} width={size} height={size} alt={currency?.symbol} className={className} {...rest} />
}

export default CurrencyLogo
