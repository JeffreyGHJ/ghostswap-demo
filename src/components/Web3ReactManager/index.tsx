import React, { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

const GnosisManagerNoSSR = dynamic(() => import('./GnosisManager'), {
  ssr: false,
})

export default function Web3ReactManager({ children }: { children: JSX.Element }) {

  return (
    <>

    </>
  )
}
