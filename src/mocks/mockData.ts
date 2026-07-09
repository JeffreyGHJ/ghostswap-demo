// ─────────────────────────────────────────────────────────────────────────────
// GhostSwap Demo – All mock data lives here.
// Images for Little Ghosts and Pancake Squad are served from the PancakeSwap
// CDN which still hosts these collections. Ecto Skeletons use DiceBear
// generated placeholders since their images aren't on that CDN.
// ─────────────────────────────────────────────────────────────────────────────

// ── Contract addresses ────────────────────────────────────────────────────────
export const LG_ADDRESS = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48'
export const ES_ADDRESS = '0x0fa48f20dddcf6ed724a36381f66c3e905fe7988'
export const PS_ADDRESS = '0x0a8901b0e25deb55a87524f0cc164e9644020eba'

// ── Image helpers ─────────────────────────────────────────────────────────────
const LG_CDN = 'https://static-nft.pancakeswap.com/mainnet/0x98F606A4cdDE68b9f68732D21fb9bA8B5510eE48'
const PS_CDN = 'https://static-nft.pancakeswap.com/mainnet/0x0a8901b0E25DEb55A87524f0cC164E9644020EBA'

const lgImg = (id: number) => `${LG_CDN}/little-ghosts-${id}.png`
const psImg = (id: number) => `${PS_CDN}/pancake-squad-${id}.png`
const esImg = (id: number) =>
  `https://api.dicebear.com/9.x/shapes/svg?seed=ecto${id}&backgroundColor=0a1628,12192e&shapeColor=8b5cf6,a78bfa`

// ── Pool addresses (realistic-looking fake addresses) ─────────────────────────
const POOL = {
  LG_BUY_1:   '0x3a2f1c0b9e4d7f2a6c8e9012b3c4d5e6f7a8b9c0',
  LG_BUY_2:   '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
  LG_BUY_3:   '0xce1d2a3b4c5e6f7a8b9c0d1e2f3a4b5c6d7e8f09',
  LG_BUY_4:   '0xfa2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f0a1b',
  LG_SELL_1:  '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e',
  LG_SELL_2:  '0xb3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f0a1b2c3',
  LG_TRADE_1: '0x5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b',
  LG_TRADE_2: '0xe4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
  LG_TRADE_3: '0xa5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4',
  LG_TRADE_4: '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
  ES_BUY_1: '0x2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
  ES_SELL_1: '0x8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d',
  PS_BUY_1: '0x4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a',
  PS_SELL_1: '0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
}

// ── BNB price helpers (BigNumber-style Wei strings) ───────────────────────────
// Uses BigInt arithmetic to avoid scientific notation for large volumes.
// JavaScript Numbers lose precision above ~9 BNB × 1e18, so we split into
// whole and fractional parts before converting to BigInt.
const toWei = (bnb: number): string => {
  const whole = Math.floor(bnb)
  const frac = Math.round((bnb - whole) * 1e9) // 9 decimal places
  return (BigInt(whole) * BigInt('1000000000000000000') + BigInt(frac) * BigInt('1000000000')).toString()
}

// ── Little Ghosts trait lookup (from on-chain metadata JSON) ──────────────────
// The JSON's tokens array is sorted by rarity rank, not token ID, so we extract
// each NFT's real ID from its name field and build a proper tokenId → attributes
// map at module load time. This runs server-side only (API routes).
import lgTraitsJson from '../constants/little-ghost-traits/0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48.json'

type LgAttribute = { trait_type: string; value: string }
const _lgTypes: string[] = lgTraitsJson.traitTypes as string[]
const _lgValues: string[][] = lgTraitsJson.traitValues as unknown as string[][]
const _lgByTokenId = new Map<number, LgAttribute[]>()

for (const token of lgTraitsJson.tokens as unknown as [string, string, string, number[]][]) {
  const m = token[1].match(/#(\d+)$/)
  if (!m) continue
  const nftId = parseInt(m[1])
  const indices = token[3]
  _lgByTokenId.set(
    nftId,
    _lgTypes.map((type, i) => ({ trait_type: type, value: _lgValues[i][indices[i]] }))
  )
}

// ── NFT asset shape used inside pool.nftAssets ────────────────────────────────
const makeLgAsset = (tokenId: number) => ({
  address: LG_ADDRESS,
  attributes: [],
  description: `LittleGhosts #${tokenId}`,
  id: `${LG_ADDRESS}:${tokenId}`,
  media: { image: lgImg(tokenId), thumbLg: lgImg(tokenId), thumbSm: lgImg(tokenId) },
  name: `LittleGhosts #${tokenId}`,
  networkId: 56,
  originalImage: lgImg(tokenId),
  tokenId: String(tokenId),
  uri: `ipfs://QmLittleGhosts/${tokenId}`,
})

const makeEsAsset = (tokenId: number) => ({
  address: ES_ADDRESS,
  attributes: [],
  description: `EctoSkeletons #${tokenId}`,
  id: `${ES_ADDRESS}:${tokenId}`,
  media: { image: esImg(tokenId), thumbLg: esImg(tokenId), thumbSm: esImg(tokenId) },
  name: `EctoSkeletons #${tokenId}`,
  networkId: 56,
  originalImage: esImg(tokenId),
  tokenId: String(tokenId),
  uri: `ipfs://QmEctoSkeletons/${tokenId}`,
})

const makePsAsset = (tokenId: number) => ({
  address: PS_ADDRESS,
  attributes: [],
  description: `Pancake Squad #${tokenId}`,
  id: `${PS_ADDRESS}:${tokenId}`,
  media: { image: psImg(tokenId), thumbLg: psImg(tokenId), thumbSm: psImg(tokenId) },
  name: `Pancake Squad #${tokenId}`,
  networkId: 56,
  originalImage: psImg(tokenId),
  tokenId: String(tokenId),
  uri: `ipfs://QmPancakeSquad/${tokenId}`,
})

// ── Pool builder ──────────────────────────────────────────────────────────────
const makePool = (
  poolAddress: string,
  collectionAddress: string,
  poolType: 'BUY' | 'SELL' | 'BUY_AND_SELL',
  floorBnb: number,
  offerBnb: number,
  balanceBnb: number,
  nftAssets: any[],
  bondingCurveType: 'LINEAR' | 'EXPONENTIAL' = 'LINEAR',
  deltaBnb: number = 0.005,
  feePct: number = 0,
  owner: string = '0xDeAd000000000000000000000000000000000001'
) => ({
  assetRecipientAddress: owner,
  balanceNBT: toWei(balanceBnb),
  bondingCurveAddress: '0xF67368dD8F27DCEb6dc4e20a76fAe61d688853DF',
  bondingCurveType,
  collectionAddress,
  delta: toWei(deltaBnb),
  exchangeAddress: '0x180898e3C779e22c25c35A78BDB33b98a10e9be4',
  fee: String(feePct * 1e18),
  floorNBT: toWei(floorBnb),
  networkId: 56,
  nftAssets,
  nftBalance: nftAssets.length,
  nftVolumeAllTime: Math.round(nftAssets.length * 3.4),
  offerNBT: toWei(offerBnb),
  owner,
  poolAddress,
  poolId: `${poolAddress}:56`,
  poolType,
  spotPriceNBT: toWei(poolType === 'SELL' ? offerBnb : floorBnb),
  tokenAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
  volumeAllTimeNBT: toWei(nftAssets.length * floorBnb * 3.4),
})

// ── Pools ─────────────────────────────────────────────────────────────────────
export const POOLS = {
  // Little Ghosts – BUY pool 1: 8 NFTs for sale at 0.04 BNB
  [POOL.LG_BUY_1]: makePool(POOL.LG_BUY_1, LG_ADDRESS, 'BUY', 0.04, 0, 0, [0, 2, 3, 4, 5, 6, 7, 8].map(makeLgAsset)),
  // Little Ghosts – BUY pool 2: 7 NFTs for sale at 0.055 BNB
  [POOL.LG_BUY_2]: makePool(
    POOL.LG_BUY_2,
    LG_ADDRESS,
    'BUY',
    0.055,
    0,
    0,
    [9, 10, 11, 12, 13, 14, 15].map(makeLgAsset)
  ),
  // Little Ghosts – BUY pool 3:
  [POOL.LG_BUY_3]: makePool(
    POOL.LG_BUY_3,
    LG_ADDRESS,
    'BUY',
    0.2,
    0,
    0,
    [21, 32, 43, 5470, 65, 76, 87, 7750].map(makeLgAsset)
  ),
  // Little Ghosts – BUY pool 4:
  [POOL.LG_BUY_4]: makePool(
    POOL.LG_BUY_4,
    LG_ADDRESS,
    'BUY',
    0.13,
    0,
    0,
    [24, 1361, 48, 3916, 1169, 276, 487, 5010].map(makeLgAsset)
  ),
  // Little Ghosts – SELL pool: offers 0.033 BNB per NFT (users sell to it)
  // balance=0.2 keeps getMaxBought≈6, so prices (0.033→0.008) stay above MIN_TRADE_PRICE
  [POOL.LG_SELL_1]: makePool(POOL.LG_SELL_1, LG_ADDRESS, 'SELL', 0, 0.033, 0.2, []),
  // Little Ghosts – SELL pool: offers 0.033 BNB per NFT (users sell to it)
  // balance=0.2 keeps getMaxBought≈6, so prices (0.033→0.008) stay above MIN_TRADE_PRICE
  // balance=0.2 keeps getMaxBought≈5, so prices (0.038→0.018) stay above MIN_TRADE_PRICE
  [POOL.LG_SELL_2]: makePool(POOL.LG_SELL_2, LG_ADDRESS, 'SELL', 0, 0.038, 0.2, []),
  // Little Ghosts – TRADE pool: 5 NFTs + BNB balance, 8% exponential delta
  [POOL.LG_TRADE_1]: makePool(
    POOL.LG_TRADE_1,
    LG_ADDRESS,
    'BUY_AND_SELL',
    0.048,
    0.036,
    1.2,
    [16, 17, 18, 19, 20].map(makeLgAsset),
    'EXPONENTIAL',
    1.08
  ),
  // Little Ghosts – TRADE pool:
  [POOL.LG_TRADE_2]: makePool(
    POOL.LG_TRADE_2,
    LG_ADDRESS,
    'BUY_AND_SELL',
    0.051,
    0.04,
    1.07,
    [2816, 9017, 1218, 6319, 220, 6881].map(makeLgAsset),
    'EXPONENTIAL',
    1.13
  ),
  // Little Ghosts – TRADE pool:
  [POOL.LG_TRADE_3]: makePool(
    POOL.LG_TRADE_3,
    LG_ADDRESS,
    'BUY_AND_SELL',
    0.044,
    0.04,
    1.4,
    [7862, 9234, 8121, 9876, 333, 444].map(makeLgAsset),
    'EXPONENTIAL',
    1.13
  ),
  // Little Ghosts – TRADE pool:
  [POOL.LG_TRADE_4]: makePool(
    POOL.LG_TRADE_4,
    LG_ADDRESS,
    'BUY_AND_SELL',
    0.054,
    0.034,
    1.27,
    [5555, 6736, 1444, 7774, 855, 5363].map(makeLgAsset),
    'LINEAR',
    0.003
  ),
  // Ecto Skeletons – BUY pool: 6 NFTs at 0.13 BNB
  [POOL.ES_BUY_1]: makePool(POOL.ES_BUY_1, ES_ADDRESS, 'BUY', 0.13, 0, 0, [1, 9, 21, 42, 100, 221].map(makeEsAsset)),
  // Ecto Skeletons – SELL pool
  [POOL.ES_SELL_1]: makePool(POOL.ES_SELL_1, ES_ADDRESS, 'SELL', 0, 0.1, 1.8, []),
  // Pancake Squad – BUY pool: 5 NFTs at 0.88 BNB
  [POOL.PS_BUY_1]: makePool(POOL.PS_BUY_1, PS_ADDRESS, 'BUY', 0.88, 0, 0, [0, 1, 2, 3, 4].map(makePsAsset)),
  // Pancake Squad – SELL pool
  [POOL.PS_SELL_1]: makePool(POOL.PS_SELL_1, PS_ADDRESS, 'SELL', 0, 0.75, 8.5, []),
}

// Pools grouped by collection
export const POOLS_BY_COLLECTION: Record<string, any[]> = {
  [LG_ADDRESS]: [
    POOLS[POOL.LG_BUY_1],
    POOLS[POOL.LG_BUY_2],
    POOLS[POOL.LG_BUY_3],
    POOLS[POOL.LG_BUY_4],
    POOLS[POOL.LG_SELL_1],
    POOLS[POOL.LG_SELL_2],
    POOLS[POOL.LG_TRADE_1],
    POOLS[POOL.LG_TRADE_2],
    POOLS[POOL.LG_TRADE_3],
    POOLS[POOL.LG_TRADE_4],
  ],
  [ES_ADDRESS]: [POOLS[POOL.ES_BUY_1], POOLS[POOL.ES_SELL_1]],
  [PS_ADDRESS]: [POOLS[POOL.PS_BUY_1], POOLS[POOL.PS_SELL_1]],
}

// ── Collection stats (from getNftPoolCollectionsByExchange) ───────────────────
const makeCollectionStats = (
  address: string,
  name: string,
  imgUrl: string,
  floorBnb: number,
  offerBnb: number,
  balanceBnb: number,
  nftBalance: number,
  nftVolumeAllTime: number,
  volumeAllTimeBnb: number
) => ({
  balanceNBT: toWei(balanceBnb),
  collectionAddress: address,
  collectionId: `${address}:56`,
  exchangeAddress: '0x180898e3C779e22c25c35A78BDB33b98a10e9be4',
  exchangeId: '0x180898e3C779e22c25c35A78BDB33b98a10e9be4:56',
  floorNBT: toWei(floorBnb),
  media: { image: imgUrl, thumbLg: imgUrl, thumbSm: imgUrl },
  name,
  networkId: 56,
  nftBalance,
  nftVolumeAllTime,
  offerNBT: toWei(offerBnb),
  volumeAllTimeNBT: toWei(volumeAllTimeBnb),
})

export const COLLECTION_STATS: Record<string, any> = {
  [LG_ADDRESS]: makeCollectionStats(LG_ADDRESS, 'Little Ghosts', lgImg(9990), 0.04, 0.033, 3.7, 20, 244, 50.98),
  [ES_ADDRESS]: makeCollectionStats(ES_ADDRESS, 'Ecto Skeletons', esImg(1), 0.12, 0.1, 1.8, 6, 11, 2.25),
  [PS_ADDRESS]: makeCollectionStats(
    PS_ADDRESS,
    'Pancake Squad',
    `${PS_CDN}/pancake-squad-1.png`,
    0.88,
    0.75,
    8.5,
    5,
    202,
    1726.85
  ),
}

// ── Collection trades list (from /api/collection/collectionTrades) ────────────
export const COLLECTION_TRADES = [
  {
    address: LG_ADDRESS,
    name: 'Little Ghosts',
    avatar: lgImg(9990),
    volumeBNB: 183.4,
    volumeUSD: 88641,
    trades: 1284,
    volumeBNB_last24h: 1.2,
    volumeUSD_last24h: 580,
    trades_last24h: 8,
    volumeBNB_7d: 8.4,
    volumeUSD_7d: 4062,
    trades_7d: 56,
    volumeBNB_last7d: 8.4,
    volumeUSD_last7d: 4062,
    trades_last7d: 56,
    volumeBNB_30d: 50.98,
    volumeUSD_30d: 24634,
    trades_30d: 244,
    volumeBNB_last30d: 50.98,
    volumeUSD_last30d: 24634,
    trades_last30d: 244,
    holders: 1301,
    holders_24h: 0,
    holders_7d: -3,
    holders_30d: -12,
    status: 'default',
  },
  {
    address: ES_ADDRESS,
    name: 'Ecto Skeletons',
    avatar: esImg(1),
    volumeBNB: 12.8,
    volumeUSD: 6186,
    trades: 47,
    volumeBNB_last24h: 0.12,
    volumeUSD_last24h: 58,
    trades_last24h: 1,
    volumeBNB_7d: 0.8,
    volumeUSD_7d: 387,
    trades_7d: 4,
    volumeBNB_last7d: 0.8,
    volumeUSD_last7d: 387,
    trades_last7d: 4,
    volumeBNB_30d: 2.25,
    volumeUSD_30d: 1088,
    trades_30d: 11,
    volumeBNB_last30d: 2.25,
    volumeUSD_last30d: 1088,
    trades_last30d: 11,
    holders: 408,
    holders_24h: 0,
    holders_7d: -1,
    holders_30d: -8,
    status: 'default',
  },
  {
    address: PS_ADDRESS,
    name: 'Pancake Squad',
    avatar: `${PS_CDN}/pancake-squad-1.png`,
    volumeBNB: 9840.2,
    volumeUSD: 4756177,
    trades: 8104,
    volumeBNB_last24h: 12.4,
    volumeUSD_last24h: 5993,
    trades_last24h: 14,
    volumeBNB_7d: 86.5,
    volumeUSD_7d: 41823,
    trades_7d: 95,
    volumeBNB_last7d: 86.5,
    volumeUSD_last7d: 41823,
    trades_last7d: 95,
    volumeBNB_30d: 1726.85,
    volumeUSD_30d: 834768,
    trades_30d: 202,
    volumeBNB_last30d: 1726.85,
    volumeUSD_last30d: 834768,
    trades_last30d: 202,
    holders: 4981,
    holders_24h: 2,
    holders_7d: 15,
    holders_30d: 42,
    status: 'default',
  },
]

// ── Collection details short (banner, description) ───────────────────────────
export const COLLECTION_DETAILS: Record<string, any> = {
  [LG_ADDRESS]: {
    name: 'Little Ghosts',
    address: LG_ADDRESS,
    description:
      'LittleGhosts is a collection of 10,000 animated NFTs on the Binance Smart Chain. ' +
      'Each ghost is unique — combining a play-to-earn MMORPG with on-chain provable rarity.',
    avatar: lgImg(9990),
    banner: `${LG_CDN}/banner-lg.png`,
    status: 'default',
    website: 'https://littleghosts.com',
    twitter: 'https://twitter.com/LittleGhostsNFT',
    discord: 'https://discord.com/invite/NrqgFxJF6k',
  },
  [ES_ADDRESS]: {
    name: 'Ecto Skeletons',
    address: ES_ADDRESS,
    description:
      'Ecto Skeletons is a collection of 2,500 NFTs on the Binance Smart Chain, created by the Little Ghosts team. ' +
      'Holding an Ecto Skeleton grants in-game buffs in the LittleGhosts MMORPG.',
    avatar: esImg(1),
    banner: esImg(999),
    status: 'default',
  },
  [PS_ADDRESS]: {
    name: 'Pancake Squad',
    address: PS_ADDRESS,
    description:
      'Pancake Squad is the flagship NFT collection from PancakeSwap — 10,000 unique bunnies ' +
      'generated on the Binance Smart Chain. A founding collection of the BNB NFT scene.',
    avatar: `${PS_CDN}/pancake-squad-1.png`,
    banner: `https://static-nft.pancakeswap.com/mainnet/0x0a8901b0E25DEb55A87524f0cC164E9644020EBA/banner-lg.png`,
    status: 'default',
    website: 'https://pancakeswap.finance/',
    twitter: 'https://twitter.com/PancakeSwap',
  },
}

// ── Per-NFT metadata (for /api/collection/details/:address/short/:id) ─────────
// Returns the compact "short" response the frontend parses for traits + image.
export function getLgNftShort(tokenId: string | number) {
  const id = Number(tokenId)
  const attributes: LgAttribute[] = _lgByTokenId.get(id) ?? []
  return {
    address: LG_ADDRESS,
    name: `LittleGhosts #${id}`,
    metadata: { attributes },
    imageURL: lgImg(id),
    rawData: true,
  }
}

export function getEsNftShort(tokenId: string | number) {
  const id = Number(tokenId)
  return {
    address: ES_ADDRESS,
    name: `EctoSkeletons #${id}`,
    metadata: { attributes: [{ trait_type: 'Type', value: 'Skeleton' }] },
    imageURL: esImg(id),
    rawData: true,
  }
}

export function getPsNftShort(tokenId: string | number) {
  const id = Number(tokenId)
  return {
    address: PS_ADDRESS,
    name: `Pancake Squad #${id}`,
    metadata: { attributes: [{ trait_type: 'Collection', value: 'Pancake Squad' }] },
    imageURL: psImg(id),
    rawData: true,
  }
}

// ── Staking pools (for /api/collection/staking) ───────────────────────────────
export const STAKING_POOLS = [
  {
    id: '1',
    collectionAddress: LG_ADDRESS,
    collectionName: 'Little Ghosts',
    collectionAvatar: lgImg(9990),
    rewardTokenAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    rewardTokenSymbol: 'BNB',
    totalStaked: 482,
    apr: 12.4,
    pendingRewards: '0',
    stakedNfts: [],
  },
  {
    id: '2',
    collectionAddress: ES_ADDRESS,
    collectionName: 'Ecto Skeletons',
    collectionAvatar: esImg(1),
    rewardTokenAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    rewardTokenSymbol: 'BNB',
    totalStaked: 88,
    apr: 18.2,
    pendingRewards: '0',
    stakedNfts: [],
  },
]

// ── Pool events (trade history for charts) ────────────────────────────────────
const now = Math.floor(Date.now() / 1000)
const makeSwapEvent = (
  i: number,
  collectionAddress: string,
  poolAddress: string,
  tokenId: number,
  priceBnb: number,
  minutesAgo: number
) => ({
  blockHash: `0xblock${i.toString(16).padStart(8, '0')}`,
  blockNumber: 28000000 + i,
  collectionAddress,
  collectionId: `${collectionAddress}:56`,
  eventType: 'SwapNftOutPool',
  exchangeAddress: '0x180898e3C779e22c25c35A78BDB33b98a10e9be4',
  id: `event_${i}`,
  logIndex: i % 8,
  maker: '0xDeAd000000000000000000000000000000000001',
  networkId: 56,
  poolAddress,
  poolType: 'BUY',
  timestamp: now - minutesAgo * 60,
  tokenAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  transactionHash: `0xtx${i.toString(16).padStart(10, '0')}`,
  transactionIndex: i % 4,
  data: {
    __typename: 'SwapNftOutPoolEventData',
    nftTokenIds: [String(tokenId)],
    amountNBT: toWei(priceBnb),
    protocolFeeAmountNBT: toWei(priceBnb * 0.005),
    isQuote: false,
  },
})

export const POOL_EVENTS: Record<string, any[]> = {
  [LG_ADDRESS]: [
    makeSwapEvent(1, LG_ADDRESS, POOL.LG_BUY_1, 0, 0.041, 15),
    makeSwapEvent(2, LG_ADDRESS, POOL.LG_BUY_1, 5, 0.041, 45),
    makeSwapEvent(3, LG_ADDRESS, POOL.LG_BUY_2, 10, 0.055, 90),
    makeSwapEvent(4, LG_ADDRESS, POOL.LG_BUY_2, 13, 0.055, 180),
    makeSwapEvent(5, LG_ADDRESS, POOL.LG_TRADE_1, 16, 0.048, 320),
    makeSwapEvent(6, LG_ADDRESS, POOL.LG_BUY_1, 2, 0.042, 500),
    makeSwapEvent(7, LG_ADDRESS, POOL.LG_BUY_2, 11, 0.056, 720),
    makeSwapEvent(8, LG_ADDRESS, POOL.LG_BUY_1, 4, 0.04, 1080),
    makeSwapEvent(9, LG_ADDRESS, POOL.LG_TRADE_2, 18, 0.049, 1440),
    makeSwapEvent(10, LG_ADDRESS, POOL.LG_BUY_2, 12, 0.055, 2160),
  ],
  [ES_ADDRESS]: [
    makeSwapEvent(20, ES_ADDRESS, POOL.ES_BUY_1, 1, 0.13, 30),
    makeSwapEvent(21, ES_ADDRESS, POOL.ES_BUY_1, 9, 0.13, 240),
    makeSwapEvent(22, ES_ADDRESS, POOL.ES_BUY_1, 21, 0.14, 720),
    makeSwapEvent(23, ES_ADDRESS, POOL.ES_BUY_1, 42, 0.13, 1440),
  ],
  [PS_ADDRESS]: [
    makeSwapEvent(30, PS_ADDRESS, POOL.PS_BUY_1, 0, 0.89, 60),
    makeSwapEvent(31, PS_ADDRESS, POOL.PS_BUY_1, 1, 0.88, 300),
    makeSwapEvent(32, PS_ADDRESS, POOL.PS_BUY_1, 2, 0.9, 900),
  ],
}

// ── Image URL resolver (used by /api/collection/image/full/:addr/:id) ──────────
export function resolveImageUrl(collectionAddress: string, tokenId: string): string {
  const addr = collectionAddress.toLowerCase()
  const id = Number(tokenId)
  if (addr === LG_ADDRESS) return lgImg(id)
  if (addr === ES_ADDRESS) return esImg(id)
  if (addr === PS_ADDRESS) return psImg(id)
  // fallback for any unknown collection
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${addr}${id}&backgroundColor=0f172a`
}

// ── NFT metadata resolver ─────────────────────────────────────────────────────
export function getNftShort(collectionAddress: string, tokenId: string | number) {
  const addr = collectionAddress.toLowerCase()
  if (addr === LG_ADDRESS) return getLgNftShort(tokenId)
  if (addr === ES_ADDRESS) return getEsNftShort(tokenId)
  if (addr === PS_ADDRESS) return getPsNftShort(tokenId)
  // generic fallback
  return {
    address: addr,
    name: `NFT #${tokenId}`,
    metadata: { attributes: [] },
    imageURL: resolveImageUrl(addr, String(tokenId)),
    rawData: true,
  }
}
