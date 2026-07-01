// FILTERS FOR DEFINED API DATA
export const byVolumeAsc = (a, b) => +b.volumeBNB_def - +a.volumeBNB_def
export const byVolumeDesc = (a, b) => +a.volumeBNB_def - +b.volumeBNB_def
export const byOfferAsc = (a, b) => +b.offerNBT - +a.offerNBT
export const byOfferDesc = (a, b) => +a.offerNBT - +b.offerNBT
export const byFloorAsc = (a, b) => +b.floorNBT - +a.floorNBT
export const byFloorDesc = (a, b) => +a.floorNBT - +b.floorNBT
export const byTradesAsc = (a, b) => +b.trades_def - +a.trades_def
export const byTradesDesc = (a, b) => +a.trades_def - +b.trades_def
export const byHoldersAsc = (a, b) => +b.holders - +a.holders
export const byHoldersDesc = (a, b) => +a.holders - +b.holders
export const byRankDefDesc = (a, b) => +a.rank_def - +b.rank_def
export const byRankDesc = (a, b) => +a.rank - +b.rank

// FILTERS FOR SCRAPED DATA
// volume usd - ascending
export const byVolUsd1dAsc = (a, b) => b.volumeUSD_last24h - a.volumeUSD_last24h
export const byVolUsd1wAsc = (a, b) => b.volumeUSD_7d - a.volumeUSD_7d
export const byVolUsd1mAsc = (a, b) => b.volumeUSD_30d - a.volumeUSD_30d
export const byVolUsdAllAsc = (a, b) => b.volumeUSD - a.volumeUSD

// volume usd - descending
export const byVolUsd1dDesc = (a, b) => a.volumeUSD_last24h - b.volumeUSD_last24h
export const byVolUsd1wDesc = (a, b) => a.volumeUSD_7d - b.volumeUSD_7d
export const byVolUsd1mDesc = (a, b) => a.volumeUSD_30d - b.volumeUSD_30d
export const byVolUsdAllDesc = (a, b) => a.volumeUSD - b.volumeUSD

// volume bnb - ascending
export const byVolBnb1dAsc = (a, b) => b.volumeBNB_last24h - a.volumeBNB_last24h
export const byVolBnb1wAsc = (a, b) => b.volumeBNB_7d - a.volumeBNB_7d
export const byVolBnb1mAsc = (a, b) => b.volumeBNB_30d - a.volumeBNB_30d
export const byVolBnbAllAsc = (a, b) => b.volumeBNB - a.volumeBNB

// volume bnb - descending
export const byVolBnb1dDesc = (a, b) => a.volumeBNB_last24h - b.volumeBNB_last24h
export const byVolBnb1wDesc = (a, b) => a.volumeBNB_7d - b.volumeBNB_7d
export const byVolBnb1mDesc = (a, b) => a.volumeBNB_30d - b.volumeBNB_30d
export const byVolBnbAllDesc = (a, b) => a.volumeBNB - b.volumeBNB

// trades - ascending
export const byTrades1dAsc = (a, b) => b.trades_last24h - a.trades_last24h
export const byTrades1wAsc = (a, b) => b.trades_last7d - a.trades_last7d
export const byTrades1mAsc = (a, b) => b.trades_last30d - a.trades_last30d
export const byTradesAllAsc = (a, b) => b.trades - a.trades

// trades - descending
export const byTrades1dDesc = (a, b) => a.trades_last24h - b.trades_last24h
export const byTrades1wDesc = (a, b) => a.trades_last7d - b.trades_last7d
export const byTrades1mDesc = (a, b) => a.trades_last30d - b.trades_last30d
export const byTradesAllDesc = (a, b) => a.trades - b.trades
