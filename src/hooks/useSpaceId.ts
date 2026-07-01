import axios from 'axios'
import { useEffect, useState } from 'react'

function useSpaceId(address) {
  const [spaceId, setSpaceId] = useState(null)

  useEffect(() => {
    try {
      axios.get(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/spaceid/${address}`).then((response) => {
        if (response?.data?.name !== null && response?.data?.name !== undefined) setSpaceId(response.data.name)
        else setSpaceId(null)
      })
    } catch (error) {
      console.error(error)
    }
  }, [address])

  return { spaceId }
}

export default useSpaceId
