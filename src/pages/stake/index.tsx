import Container from '../../components/Container'
import Head from 'next/head'
import { useRouter } from 'next/router'
import StakingPoolsList from '../../components/StakingPoolsList'
import { useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import { setStakePools } from '../../state/stakePools'

const Stake = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_AWS_URL}api/collection/staking`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(setStakePools(data))
        console.log(data)
      })
  }, [])

  return (
    <Container id="stake-page" className="py-4" maxWidth="full">
      <Head>
        <title>Stake | GhostSwap</title>
        <meta key="description" name="description" content="Explore..." />
      </Head>

      <div className="relative z-0 text-sm">
        <div className="flex flex-wrap justify-between gap-10 px-8 py-4 md:px-16">
          <div className="flex flex-col gap-2">
            <div style={{ WebkitTextStrokeWidth: '1px' }} className="mb-2 text-5xl leading-[3.5rem]">
              Staking
            </div>
            <div className="text-lg text-[rgb(141,139,155)]">
              Lock your NFTs or tokens to earn rewards from various reward mechanisms including
              <br />
              tokens, merchandise, redeemable rewards, referral tokens and more.
            </div>
          </div>
          <div className="flex flex-col items-end justify-end gap-5 ">
            <div className="flex w-fit flex-wrap gap-3 rounded-xl border-[2px] border-[rgba(221,218,218,0.2)] p-4 text-[14px]">
              <div className="flex items-center gap-2">
                <div className="text-[rgb(141,139,155)]">Total Staked Tokens</div>
                <div>{Number(~~(Math.random() * 10000000)).toLocaleString('en-US')}</div>
                <div className="text-[rgb(141,139,155)]">Total Staked NFTS</div>
                <div>{Number(~~(Math.random() * 10000)).toLocaleString('en-US')}</div>
                <div className="text-[rgb(141,139,155)]">Total Stake Pools</div>
                <div>{Number(~~(Math.random() * 1000)).toLocaleString('en-US')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-16 px-8 mx-auto md:px-16">
        <StakingPoolsList />
      </div>
    </Container>
  )
}

export default Stake
