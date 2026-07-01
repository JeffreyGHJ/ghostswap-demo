import React, { useState, useEffect } from 'react'
import Container from '../components/Container'
import Head from 'next/head'
import { Grid, Button, Text } from '@nextui-org/react'
import { useRouter } from 'next/router'
import TelegramSvg from '../../public/icons/TelegramIconSvg'
import { MouseoverArrowTooltipFlat as Tooltip } from '../components/Tooltip'
import { Globe, Twitter } from 'react-feather'
import ExternalLink from '../components/ExternalLink'

const link = ' flex items-center justify-center h-[24px] cursor-pointer text-white hover:text-white '
const discord = ' w-[24px] '
const twitter = ' w-[24px] ml-[10px] mr-1 '
const telegram = ' w-[30px] mr-1 '
const website = ' w-[24px] '

export default function Home() {
  const [emoji, setEmoji] = useState('🚀')
  const router = useRouter()

  function handleSwapNow() {
    router.push('/nftamm')
  }

  function handleLearnMore() {
    window.open('https://docs.ghostswap.finance', '_blank')
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (emoji === '🚀') {
        setEmoji('👻')
      } else if (emoji === '👻') {
        setEmoji('🌚')
      } else {
        setEmoji('🚀')
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [emoji])
  return (
    // <>
    //   <div className="flex-col invisible border border-red">
    //     <MetaMaskCard />
    //     <WalletConnectV2Card />
    //     <CoinbaseWalletCard />
    //     <NetworkCard />
    //     <GnosisSafeCard />
    //   </div>
    // </>
    <Container id="home-page" className="flex items-center justify-center h-full" maxWidth="full">
      <Head>
        <title>Home | GhostSwap</title>
        <meta name="description" content="GhostSwap" />
      </Head>
      <div className="flex flex-wrap items-center justify-center h-full px-3 overflow-x-hidden lg:flex-row">
        <div id="content" className="flex px-3 lg:min-w-[756px] lg:max-w-[756px]">
          <div className=" text-[38px] sm:text-[55px] font-bold">
            <div className="">
              <Text h2 css={{ color: 'white' }} weight="bold">
                {' '}
                The Moon is haunted
              </Text>
            </div>
            <div className="mb-9">
              <Grid.Container>
                <Grid>
                  <Text h2 css={{ color: 'white', marginRight: '10px' }} weight="bold">
                    by
                  </Text>
                </Grid>
                <Grid>
                  <Text h2 css={{ color: '#A8C3DF' }} weight="bold">
                    ghosts {emoji}
                  </Text>
                </Grid>
              </Grid.Container>
            </div>

            <div className="text-[23px] mb-4">
              GhostSwap is an innovative DeFi platform on BNBChain that has an advanced DEX, NFT AMM, and more.
            </div>

            <div id="main-external-links" className="flex mb-6">
              <Tooltip placement="top" content={'Discord'}>
                <ExternalLink href="https://discord.gg/ghostlabs" className={link + discord}>
                  <img src={'/discord-mark-white.png'} className="h-[18px]" />
                </ExternalLink>
              </Tooltip>

              <Tooltip placement="top" content={'Twitter'}>
                <ExternalLink href="https://twitter.com/GhostSwapAMM" className={link + twitter}>
                  <Twitter fill="White" height={22} color="white" />
                </ExternalLink>
              </Tooltip>

              <Tooltip placement="top" content={'Telegram'}>
                <ExternalLink href="https://t.me/GhostSwapBNB" className={link + telegram}>
                  <TelegramSvg fill={'white'} width={28} height={28} />
                </ExternalLink>
              </Tooltip>

              <Tooltip placement="top" content={'LittleGhosts Website'}>
                <ExternalLink href="https://littleghosts.com/" className={link + website}>
                  <Globe width={26} height={28} color="white" />
                </ExternalLink>
              </Tooltip>
            </div>

            <Grid.Container className="flex gap-6 pb-5">
              <Grid>
                <Button shadow color="primary" auto onClick={handleLearnMore}>
                  Learn More
                </Button>
              </Grid>
              <Grid>
                <Button shadow color="secondary" auto onClick={handleSwapNow}>
                  Swap Now
                </Button>
              </Grid>
            </Grid.Container>
          </div>
        </div>
        <div id="image" className="hidden sm:block w-[556px]  lg:w-[756px] ">
          <img src={'/ghost_moon3.png'}></img>
        </div>
      </div>
    </Container>
  )
}
