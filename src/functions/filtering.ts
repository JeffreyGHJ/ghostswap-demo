import { Token } from '@ghostlabsweb3/sdk'
import { TokenInfo } from '@uniswap/token-lists'
import { isAddress } from './validate'
import { useMemo } from 'react'

const alwaysTrue = () => true

const ectoSkeletonsCollectionAddress = '0x0fa48f20dddcf6ed724a36381f66c3e905fe7988'

/**
 * Create a filter function to apply to a token for whether it matches a particular search query
 * @param search the search query to apply to the token
 */
export function createTokenFilterFunction<T extends Token | TokenInfo>(search: string): (tokens: T) => boolean {
  const searchingAddress = isAddress(search)

  if (searchingAddress) {
    const lower = searchingAddress.toLowerCase()
    return (t: T) => ('isToken' in t ? searchingAddress === t.address : lower === t.address.toLowerCase())
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (lowerSearchParts.length === 0) return alwaysTrue

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)

    return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
  }

  return ({ name, symbol }: T): boolean => Boolean((symbol && matchesSearch(symbol)) || (name && matchesSearch(name)))
}

export function filterTokens<T extends Token | TokenInfo>(tokens: T[], search: string): T[] {
  return tokens.filter(createTokenFilterFunction(search))
}

export const filterNfts = (nftsToBuy, traitFilters, address) => {
  console.log('filtering nfts')
  //   console.log(traitFilters)
  let filteredNfts = nftsToBuy.filter((nftData) => {
    let traitTypesToCheck = new Set(traitFilters.keys())
    // if in ectoskeletons collection
    if (address.toLowerCase() === ectoSkeletonsCollectionAddress) {
      // check traitFilters against nftData.buffs
      let buffsToCheck = new Set(traitFilters.get('Buffs'))

      if (buffsToCheck.size > 0) {
        let pass = false
        // if this nfts buffs matches on at least one filtered buff, it will pass
        for (let buff of Object.values(nftData.buffs)) if (buffsToCheck.has(buff)) pass = true
        if (pass === false) return false
        traitTypesToCheck.delete('Buffs')
      }
    }

    // STANDARD FILTER CHECK AGAINST NFT METADATA --- GHOST BUFFS ARE HANDLED IN THIS BLOCK
    if (nftData?.metadata?.length > 0 && traitTypesToCheck.size > 0) {
      for (let entry of nftData.metadata) {
        // Find a way to shorten this process, know which metadatas to compare and skip rest
        if (traitTypesToCheck.has(entry.trait_type)) {
          // console.log(entry.trait_type, traitFilters.get(entry.trait_type), entry.value)
          // the nft may have a trait among this type but not the correct value
          if (!traitFilters.get(entry.trait_type).includes(entry.value)) {
            return false
          }
        }
        traitTypesToCheck.delete(entry.trait_type)
      }
      if (traitTypesToCheck.size > 0) return false // then this nft did not test all filtered traits
    }
    return true
  })
  console.log('filtering done')
  return filteredNfts
}

export function useSortedTokensByQuery(tokens: Token[] | undefined, searchQuery: string): Token[] {
  return useMemo(() => {
    if (!tokens) {
      return []
    }

    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)

    if (symbolMatch.length > 1) {
      return tokens
    }

    const exactMatches: Token[] = []
    const symbolSubtrings: Token[] = []
    const rest: Token[] = []

    // sort tokens by exact match -> subtring on symbol match -> rest
    tokens.map((token) => {
      if (token.symbol?.toLowerCase() === symbolMatch[0]) {
        return exactMatches.push(token)
      } else if (token.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase().trim())) {
        return symbolSubtrings.push(token)
      } else {
        return rest.push(token)
      }
    })

    return [...exactMatches, ...symbolSubtrings, ...rest]
  }, [tokens, searchQuery])
}
