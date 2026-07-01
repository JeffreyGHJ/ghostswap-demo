import axios from 'axios'

// an easy place to call our defined api backend queries
function useDefinedApi() {
  const getNftPool = async (address, setData = null, cancelSource = null) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/defined/getNftPool/${address}`, {
        cancelToken: cancelSource?.token,
      })
      .then((response) => {
        if (setData) setData(response.data.data.getNftPool)
        else return response.data.data.getNftPool
      })
      .catch((error) => {
        if (axios.isCancel(error)) console.log('getNftPool() aborted')
        else console.log(error?.response?.data)
      })
  }

  const getNftPoolEvents = async (collectionAddress, poolAddress, setData = null, cancelSource = null, limit = 50) => {
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_AWS_URL}` +
          `api/defined/getNftPoolEvents/` +
          `${collectionAddress}/` +
          `${poolAddress}/` +
          `${limit}`,
        {
          cancelToken: cancelSource?.token,
        }
      )
      .then((result) => {
        if (result?.data?.data?.getNftPoolEvents?.items !== undefined) {
          console.log('getNftPoolEvents(): Success!')
          console.log(result?.data?.data?.getNftPoolEvents?.items)
          if (setData) setData(result.data.data.getNftPoolEvents.items)
          else return result.data.data.getNftPoolEvents.items
        } else {
          throw new Error('unhandled exception in getNftPoolEvents()')
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) console.log('getNftPoolEvents() aborted')
        else console.log(error)
      })
  }

  const getAllNftPoolEvents = async (address, setData = null, filter = null, cancelSource = null) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/defined/getAllNftPoolEvents/` + address + '/1000', {
        cancelToken: cancelSource?.token,
      })
      .then((response) => {
        let events = response?.data?.data?.getNftPoolEvents
        if (events && events.items) {
          events = events.items.filter(filter || ((item) => item))
          // console.log(events)
          if (setData) setData(events)
          else return events
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) console.log('getAllNftPoolEvents() aborted')
        else console.log(error)
      })
  }

  const getNftPoolCollection = async (address, setData = null, cancelSource = null) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/defined/getNftPoolCollection/${address}`, {
        cancelToken: cancelSource?.token,
      })
      .then((response) => {
        if (setData) setData(response.data.data.getNftPoolCollection)
        else return response.data.data.getNftPoolCollection
      })
      .catch((error) => {
        if (axios.isCancel(error)) console.log('getNftPoolCollection() aborted')
        else console.log(error?.response?.data)
      })
  }

  const getNftPoolsByCollectionAndExchange = async (address, setData = null, cancelSource = null) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/defined/getNftPoolsByCollectionAndExchange/${address}/9999`, {
        cancelToken: cancelSource?.token,
      })
      .then((response) => {
        if (setData) setData(response.data.data.getNftPoolsByCollectionAndExchange.items)
        else return response.data.data.getNftPoolsByCollectionAndExchange.items
      })
      .catch((error) => {
        if (axios.isCancel(error)) console.log('getNftPoolsByCollectionAndExchange() aborted')
        else console.log(error?.response?.data)
      })
  }

  const getNftPoolCollectionsByExchange = async (setData = null, cancelSource = null, limit = 2000) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/defined/getNftPoolCollectionsByExchange/${limit}`, {
        cancelToken: cancelSource?.token,
      })
      .then((response) => {
        if (setData) setData(response.data.data.getNftPoolCollectionsByExchange.items)
        return response.data.data.getNftPoolCollectionsByExchange.items
      })
      .catch((error) => {
        if (axios.isCancel(error)) console.log('getNftPoolsByCollectionAndExchange() aborted')
        else console.log(error?.response?.data)
      })
  }

  const getNftPoolsByOwner = async (address, setData = null, cancelSource = null) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/defined/getNftPoolsByOwner/${address}/9999`, {
        cancelToken: cancelSource?.token,
      })
      .then((response) => {
        if (setData) setData(response.data.data.getNftPoolsByOwner.items)
        else return response.data.data.getNftPoolsByOwner.items
      })
      .catch((error) => {
        if (axios.isCancel(error)) console.log('getNftPoolsByOwner() aborted')
        else console.log(error?.response?.data)
      })
  }

  const searchNfts = async (networkFilter, search, limit = 999) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_AWS_URL}api/defined/searchNfts/${networkFilter}/${search}/${limit}`)
      .then((response) => {
        // if (setData) setData(response.data.data.getNftPoolsByOwner.items)
        console.log(response)
      })
      .catch((error) => {
        if (axios.isCancel(error)) console.log('searchNfts() aborted')
        else console.log(error?.response?.data)
      })
  }

  return {
    getNftPool,
    getNftPoolEvents,
    getAllNftPoolEvents,
    getNftPoolCollection,
    getNftPoolsByCollectionAndExchange,
    getNftPoolCollectionsByExchange,
    getNftPoolsByOwner,
    searchNfts,
  }
}

export default useDefinedApi
