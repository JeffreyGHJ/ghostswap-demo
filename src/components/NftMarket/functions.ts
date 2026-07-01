import * as filters from './filters'

const compare = (a: any, b: any) => {
  if (a.name < b.name) {
    return -1
  }
  if (a.name > b.name) {
    return 1
  }
  return 0
}

// function compare(a, b) {
//     return a.name.localeCompare(b.name)
//   }

export const sortCollections = (sortBy, timeFilter, filteredListings, sortOrder, prevSortBy, setFilteredListings) => {
  let sortByFunc
  if (sortBy === 'Name') {
    sortByFunc = compare
  } else if (sortBy === `Vol_${timeFilter}`) {
    sortByFunc = (a: any, b: any) => {
      const timeFilterVolA =
        timeFilter === '1d'
          ? a.volumeUSD_last24h
          : timeFilter === '1w'
          ? a.volumeUSD_last7d
          : timeFilter === '1m'
          ? a.volumeUSD_last30d
          : a.volumeUSD
      const timeFilterVolB =
        timeFilter === '1d'
          ? b.volumeUSD_last24h
          : timeFilter === '1w'
          ? b.volumeUSD_last7d
          : timeFilter === '1m'
          ? b.volumeUSD_last30d
          : b.volumeUSD
      return sortOrder === 'asc' ? timeFilterVolA - timeFilterVolB : timeFilterVolB - timeFilterVolA
    }
  } else if (sortBy === `Trades_${timeFilter}`) {
    sortByFunc = (a: any, b: any) => {
      const timeFilterTradesA =
        timeFilter === '1d'
          ? a.trades_last24h
          : timeFilter === '1w'
          ? a.trades_last7d
          : timeFilter === '1m'
          ? a.trades_last30d
          : a.trades
      const timeFilterTradesB =
        timeFilter === '1d'
          ? b.trades_last24h
          : timeFilter === '1w'
          ? b.trades_last7d
          : timeFilter === '1m'
          ? b.trades_last30d
          : b.trades
      return sortOrder === 'asc' ? timeFilterTradesA - timeFilterTradesB : timeFilterTradesB - timeFilterTradesA
    }
  } else if (sortBy === `Vol`) {
    sortByFunc = (a: any, b: any) => (sortOrder === 'asc' ? a.volumeUSD - b.volumeUSD : b.volumeUSD - a.volumeUSD)
  } else if (sortBy === `Trades`) {
    sortByFunc = (a: any, b: any) => (sortOrder === 'asc' ? a.trades - b.trades : b.trades - a.trades)
  } else if (sortBy === `Holders`) {
    sortByFunc = (a: any, b: any) => (sortOrder === 'asc' ? a.holders - b.holders : b.holders - a.holders)
  }

  // Set the prevSortBy ref to the current sortBy value
  prevSortBy.current = sortBy

  setFilteredListings(filteredListings.sort(sortByFunc))
}

export const formatNumber = (num) => {
  if (!num) {
    return 0
  }
  if (num < 1000) {
    return num
  } else if (num < 10000) {
    return (num / 100 / 10).toFixed(2) + 'k'
  } else if (num < 100000) {
    return (num / 1000).toFixed(2) + 'k'
  } else if (num < 1000000) {
    return (num / 1000).toFixed(2) + 'k'
  } else if (num < 1000000000) {
    return (num / 1000000).toFixed(2) + 'm'
  } else {
    return (num / 1000000).toFixed(2) + 'b'
  }
}

export const applySort = (
  sort,
  filteredListings,
  showAggregateVolume,
  timeFilter,
  currencyFilter,
  setFilteredListings
) => {
  let col = sort.col
  let mode = sort.mode
  let listingsUpdate = [...filteredListings]

  if (showAggregateVolume === true) {
    listingsUpdate?.sort(filters.byRankDesc)
    if (sort.col === 1) {
      if (sort.mode === 'asc') {
        if (timeFilter === '1d') {
          if (currencyFilter === 'USD') setFilteredListings(listingsUpdate?.sort(filters.byVolUsd1dAsc))
          if (currencyFilter === 'BNB') setFilteredListings(listingsUpdate?.sort(filters.byVolBnb1dAsc))
        }
        if (timeFilter === '1w') {
          if (currencyFilter === 'USD') setFilteredListings(listingsUpdate?.sort(filters.byVolUsd1wAsc))
          if (currencyFilter === 'BNB') setFilteredListings(listingsUpdate?.sort(filters.byVolBnb1wAsc))
        }
        if (timeFilter === '1m') {
          if (currencyFilter === 'USD') setFilteredListings(listingsUpdate?.sort(filters.byVolUsd1mAsc))
          if (currencyFilter === 'BNB') setFilteredListings(listingsUpdate?.sort(filters.byVolBnb1mAsc))
        }
        if (timeFilter === 'All') {
          if (currencyFilter === 'USD') setFilteredListings(listingsUpdate?.sort(filters.byVolUsdAllAsc))
          if (currencyFilter === 'BNB') setFilteredListings(listingsUpdate?.sort(filters.byVolBnbAllAsc))
        }
      }
      if (sort.mode === 'desc') {
        if (timeFilter === '1d') {
          if (currencyFilter === 'USD') setFilteredListings(listingsUpdate?.sort(filters.byVolUsd1dDesc))
          if (currencyFilter === 'BNB') setFilteredListings(listingsUpdate?.sort(filters.byVolBnb1dDesc))
        }
        if (timeFilter === '1w') {
          if (currencyFilter === 'USD') setFilteredListings(listingsUpdate?.sort(filters.byVolUsd1wDesc))
          if (currencyFilter === 'BNB') setFilteredListings(listingsUpdate?.sort(filters.byVolBnb1wDesc))
        }
        if (timeFilter === '1m') {
          if (currencyFilter === 'USD') setFilteredListings(listingsUpdate?.sort(filters.byVolUsd1mDesc))
          if (currencyFilter === 'BNB') setFilteredListings(listingsUpdate?.sort(filters.byVolBnb1mDesc))
        }
        if (timeFilter === 'All') {
          if (currencyFilter === 'USD') setFilteredListings(listingsUpdate?.sort(filters.byVolUsdAllDesc))
          if (currencyFilter === 'BNB') setFilteredListings(listingsUpdate?.sort(filters.byVolBnbAllDesc))
        }
      }
    } else if (sort.col === 2) {
      if (sort.mode === 'asc') {
        if (timeFilter === '1d') setFilteredListings(listingsUpdate?.sort(filters.byTrades1dAsc))
        if (timeFilter === '1w') setFilteredListings(listingsUpdate?.sort(filters.byTrades1wAsc))
        if (timeFilter === '1m') setFilteredListings(listingsUpdate?.sort(filters.byTrades1mAsc))
        if (timeFilter === 'All') setFilteredListings(listingsUpdate?.sort(filters.byTradesAllAsc))
      }
      if (sort.mode === 'desc') {
        if (timeFilter === '1d') setFilteredListings(listingsUpdate?.sort(filters.byTrades1dDesc))
        if (timeFilter === '1w') setFilteredListings(listingsUpdate?.sort(filters.byTrades1wDesc))
        if (timeFilter === '1m') setFilteredListings(listingsUpdate?.sort(filters.byTrades1mDesc))
        if (timeFilter === 'All') setFilteredListings(listingsUpdate?.sort(filters.byTradesAllDesc))
      }
    } else if (sort.col === 3) {
      if (mode === 'asc') setFilteredListings(listingsUpdate?.sort(filters.byVolUsdAllAsc))
      if (mode === 'desc') setFilteredListings(listingsUpdate?.sort(filters.byVolUsdAllDesc))
    } else if (sort.col === 4) {
      if (mode === 'asc') setFilteredListings(listingsUpdate?.sort(filters.byTradesAllAsc))
      if (mode === 'desc') setFilteredListings(listingsUpdate?.sort(filters.byTradesAllDesc))
    } else if (sort.col === 5) {
      if (mode === 'asc') setFilteredListings(listingsUpdate?.sort(filters.byHoldersAsc))
      if (mode === 'desc') setFilteredListings(listingsUpdate?.sort(filters.byHoldersDesc))
    }
  } else if (!showAggregateVolume) {
    listingsUpdate?.sort(filters.byRankDefDesc)
    if (col === 1) {
      if (mode === 'asc') setFilteredListings(listingsUpdate?.sort(filters.byVolumeAsc))
      if (mode === 'desc') setFilteredListings(listingsUpdate?.sort(filters.byVolumeDesc))
    } else if (col === 2) {
      if (mode === 'asc') setFilteredListings(listingsUpdate?.sort(filters.byOfferAsc))
      if (mode === 'desc') setFilteredListings(listingsUpdate?.sort(filters.byOfferDesc))
    } else if (col === 3) {
      if (mode === 'asc') setFilteredListings(listingsUpdate?.sort(filters.byFloorAsc))
      if (mode === 'desc') setFilteredListings(listingsUpdate?.sort(filters.byFloorDesc))
    } else if (col === 4) {
      if (mode === 'asc') setFilteredListings(listingsUpdate?.sort(filters.byTradesAsc))
      if (mode === 'desc') setFilteredListings(listingsUpdate?.sort(filters.byTradesDesc))
    } else if (col === 5) {
      if (mode === 'asc') setFilteredListings(listingsUpdate?.sort(filters.byHoldersAsc))
      if (mode === 'desc') setFilteredListings(listingsUpdate?.sort(filters.byHoldersDesc))
    }
  }
}
