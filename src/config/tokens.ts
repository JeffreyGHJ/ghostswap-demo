import { BAR_ADDRESS, ChainId, SOUL_ADDRESS, Token, WBNB } from '@ghostlabsweb3/sdk'

//TODO: Uncomment and modify
// export const FLEXUSD = new Token(ChainId.BSC, '0x7b2B3C5308ab5b2a1d9a94d20D35CCDf61e05b72', 18, 'flexUSD', 'flexUSD')
// export const LAWUSD = new Token(ChainId.BSC, '0xE1E655BE6F50344e6dd708c27BD8D66492d6ecAf', 18, 'lawUSD', 'LAW US Dollar')
// export const SBUSD = new Token(ChainId.BSC, '0x9288df32951386A8254aEaF80a66B78cCaf75b82', 2, 'sBUSD', 'Smart BUSD')
// export const LAW = new Token(ChainId.BSC, '0x0b00366fBF7037E9d75E4A569ab27dAB84759302', 18, 'LAW', 'LAW')
// export const GOB = new Token(ChainId.BSC, '0x56381cB87C8990971f3e9d948939e1a95eA113a3', 9, 'Goblin', 'GOB')
// export const BCUSDT = new Token(ChainId.BSC, '0xBc2F884680c95A02cea099dA2F524b366d9028Ba', 18, 'bcUSDT', 'BlockNG-Peg USDT Token');
// export const BCBCH = new Token(ChainId.BSC, '0xBc9bD8DDe6C5a8e1CBE293356E02f5984693b195', 18, 'bcBCH', 'BlockNG-Peg BCH Token');

// export const XMIST: ChainTokenMap = {
//     [ChainId.BSC]: new Token(ChainId.BSC, BAR_ADDRESS[ChainId.BSC], 18, 'xMIST', 'MistBar'),
//     [ChainId.BSC_TEST]: new Token(ChainId.BSC_TEST, BAR_ADDRESS[ChainId.BSC_TEST], 18, 'xMIST', 'MistBar'),
// }

type ChainTokenMap = {
  readonly [chainId in ChainId]?: Token
}

export const SOUL: ChainTokenMap = {
  [ChainId.BSC]: new Token(ChainId.BSC, SOUL_ADDRESS[ChainId.BSC], 18, 'SOUL', 'SoulToken'),
  [ChainId.BSC_TEST]: new Token(ChainId.BSC_TEST, SOUL_ADDRESS[ChainId.BSC_TEST], 18, 'SOUL', 'SoulToken'),
}

export const XSOUL: ChainTokenMap = {
  [ChainId.BSC]: new Token(ChainId.BSC, SOUL_ADDRESS[ChainId.BSC], 18, 'SOUL', 'SoulToken'),
  [ChainId.BSC_TEST]: new Token(ChainId.BSC_TEST, SOUL_ADDRESS[ChainId.BSC_TEST], 18, 'SOUL', 'SoulToken'),
}

export const WBCH_EXTENDED: { [chainId: number]: Token } = {
  ...WBNB,
}

type ChainTokenMapList = {
  readonly [chainId in ChainId]?: Token[]
}

//TODO: Modify

 export const BENSWAP_TOKENS: ChainTokenMapList = {
   [ChainId.BSC]: [
   ],
   [ChainId.BSC_TEST]: [
     new Token(ChainId.BSC_TEST, '0x842692f8A4D0743e942dF5D52155a037327d4f3f', 18, 'EBENS/BCH LP Token', 'EBEN-BCH'),
   ],
 }
