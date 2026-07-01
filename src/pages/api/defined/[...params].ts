import type { NextApiRequest, NextApiResponse } from 'next'
import {
  COLLECTION_STATS,
  POOLS_BY_COLLECTION,
  POOLS,
  POOL_EVENTS,
  LG_ADDRESS,
  ES_ADDRESS,
  PS_ADDRESS,
} from '../../../mocks/mockData'

const norm = (s: string) => (s || '').toLowerCase()

// All known collection addresses for the exchange-wide listing
const ALL_ADDRESSES = [LG_ADDRESS, ES_ADDRESS, PS_ADDRESS]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const params: string[] = (req.query.params as string[]) || []

  // ── GET /api/defined/getNftPoolCollectionsByExchange/:limit ──────────────
  if (params.length === 2 && params[0] === 'getNftPoolCollectionsByExchange') {
    const items = ALL_ADDRESSES.map((addr) => COLLECTION_STATS[addr]).filter(Boolean)
    return res.status(200).json({
      data: {
        getNftPoolCollectionsByExchange: { items },
      },
    })
  }

  // ── GET /api/defined/getNftPoolCollection/:address ───────────────────────
  if (params.length === 2 && params[0] === 'getNftPoolCollection') {
    const address = norm(params[1])
    const stats = COLLECTION_STATS[address] || null
    return res.status(200).json({
      data: { getNftPoolCollection: stats },
    })
  }

  // ── GET /api/defined/getNftPool/:poolAddress ─────────────────────────────
  if (params.length === 2 && params[0] === 'getNftPool') {
    const poolAddress = norm(params[1])
    const pool = POOLS[poolAddress] || null
    return res.status(200).json({
      data: { getNftPool: pool },
    })
  }

  // ── GET /api/defined/getNftPoolsByCollectionAndExchange/:address/:limit ──
  if (params.length === 3 && params[0] === 'getNftPoolsByCollectionAndExchange') {
    const address = norm(params[1])
    const items = POOLS_BY_COLLECTION[address] || []
    return res.status(200).json({
      data: {
        getNftPoolsByCollectionAndExchange: { items, cursor: null },
      },
    })
  }

  // ── GET /api/defined/getNftPoolsByOwner/:address/:limit ──────────────────
  if (params.length === 3 && params[0] === 'getNftPoolsByOwner') {
    // In demo mode no user pools exist — the owner address is a random wallet
    return res.status(200).json({
      data: {
        getNftPoolsByOwner: { items: [], cursor: null },
      },
    })
  }

  // ── GET /api/defined/getAllNftPoolEvents/:collectionAddress/:limit ────────
  if (params.length === 3 && params[0] === 'getAllNftPoolEvents') {
    const address = norm(params[1])
    const events = POOL_EVENTS[address] || []
    return res.status(200).json({
      data: { getNftPoolEvents: { items: events } },
    })
  }

  // ── GET /api/defined/getNftPoolEvents/:collection/:pool/:limit ────────────
  if (params.length === 4 && params[0] === 'getNftPoolEvents') {
    const collectionAddress = norm(params[1])
    const poolAddress = norm(params[2])
    const allEvents = POOL_EVENTS[collectionAddress] || []
    const poolEvents = allEvents.filter((e) => norm(e.poolAddress) === poolAddress)
    return res.status(200).json({
      data: { getNftPoolEvents: { items: poolEvents } },
    })
  }

  // ── GET /api/defined/searchNfts/:networkFilter/:search/:limit ────────────
  if (params.length === 4 && params[0] === 'searchNfts') {
    return res.status(200).json({
      data: { searchNfts: { items: [] } },
    })
  }

  // ── GET /api/defined/getNftPoolStats/:collection/:start/:end ─────────────
  if (params.length === 4 && params[0] === 'getNftPoolStats') {
    return res.status(200).json({ data: { getNftPoolStats: [] } })
  }

  // ── GET /api/defined/getChartData/:collection/:start/:end ────────────────
  if (params.length === 4 && params[0] === 'getChartData') {
    return res.status(200).json({
      lineChartData: [],
      lineChartOptions: {},
      barChartData: { labels: [], datasets: [] },
      barChartOptions: {},
    })
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  console.warn('[mock] unhandled defined route:', params.join('/'))
  return res.status(404).json({ error: 'Mock: route not implemented', path: params.join('/') })
}
