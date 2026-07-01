import type { NextApiRequest, NextApiResponse } from 'next'
import {
  COLLECTION_TRADES,
  COLLECTION_DETAILS,
  COLLECTION_STATS,
  POOLS_BY_COLLECTION,
  STAKING_POOLS,
  getNftShort,
  resolveImageUrl,
  LG_ADDRESS,
  ES_ADDRESS,
  PS_ADDRESS,
} from '../../../mocks/mockData'

// Normalise an address for keyed lookups
const norm = (s: string) => (s || '').toLowerCase()

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS – allow the demo to be embedded anywhere
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const params: string[] = (req.query.params as string[]) || []

  // ── GET /api/collection/collectionTrades ─────────────────────────────────
  if (params.length === 1 && params[0] === 'collectionTrades') {
    return res.status(200).json(COLLECTION_TRADES)
  }

  // ── GET /api/collection/staking ──────────────────────────────────────────
  if (params.length === 1 && params[0] === 'staking') {
    return res.status(200).json(STAKING_POOLS)
  }

  // ── GET /api/collection/listings ────────────────────────────────────────
  if (params.length === 1 && params[0] === 'listings') {
    return res.status(200).json(
      COLLECTION_TRADES.map(({ address, name, avatar }) => ({ address, name, avatar }))
    )
  }

  // ── GET /api/collection/spaceid/:address ─────────────────────────────────
  if (params.length === 2 && params[0] === 'spaceid') {
    return res.status(200).json({ name: null })
  }

  // ── GET /api/collection/image/full/:address/:id ──────────────────────────
  // ── GET /api/collection/image/low/:address/:id  ──────────────────────────
  if (params.length === 4 && params[0] === 'image') {
    const [, /* 'full'|'low' */, address, tokenId] = params
    return res.status(200).json({ imageURL: resolveImageUrl(address, tokenId) })
  }

  // ── GET /api/collection/details/:address/short ───────────────────────────
  if (params.length === 3 && params[0] === 'details' && params[2] === 'short') {
    const address = norm(params[1])
    const details = COLLECTION_DETAILS[address] || {
      name: 'Unknown Collection',
      address,
      description: '',
      avatar: resolveImageUrl(address, '1'),
      banner: '',
      status: 'default',
    }
    return res.status(200).json(details)
  }

  // ── GET /api/collection/details/:address/short/:id ───────────────────────
  if (params.length === 4 && params[0] === 'details' && params[2] === 'short') {
    const address = norm(params[1])
    const tokenId = params[3]
    return res.status(200).json(getNftShort(address, tokenId))
  }

  // ── GET /api/collection/details/:address/meta/:id ────────────────────────
  if (params.length === 4 && params[0] === 'details' && params[2] === 'meta') {
    const address = norm(params[1])
    const tokenId = params[3]
    return res.status(200).json({
      name: `NFT #${tokenId}`,
      description: COLLECTION_DETAILS[address]?.description || '',
      image: resolveImageUrl(address, tokenId),
      attributes: [],
    })
  }

  // ── GET /api/collection/account/:address/moralis/assets ──────────────────
  if (params.length === 4 && params[0] === 'account' && params[2] === 'moralis' && params[3] === 'assets') {
    // Return empty — no real wallet holdings in demo
    return res.status(200).json([])
  }

  // ── GET /api/collection/account/:address/moralis/collections ─────────────
  if (params.length === 4 && params[0] === 'account' && params[2] === 'moralis' && params[3] === 'collections') {
    return res.status(200).json([])
  }

  // ── GET /api/collection/account/:address/moralis/assets/collection/:collAddr/:chainId ──
  if (
    params.length >= 6 &&
    params[0] === 'account' &&
    params[2] === 'moralis' &&
    params[3] === 'assets' &&
    params[4] === 'collection'
  ) {
    return res.status(200).json([])
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  console.warn('[mock] unhandled collection route:', params.join('/'))
  return res.status(404).json({ error: 'Mock: route not implemented', path: params.join('/') })
}
