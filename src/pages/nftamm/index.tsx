import Container from '../../components/Container'
import Head from 'next/head'
import NftMarket from '../../components/NftMarket'
import ForceBnbSwitch from '../../components/ForceBnbSwitch'

export default function nftamm() {
  return (
    <Container id="nft-market-page" className="py-4 mb-[9.5rem] md:mb-[4.5rem]" maxWidth="full">
      <Head>
        <title>Nfts | GhostSwap</title>
        <meta key="description" name="description" content="Explore..." />
      </Head>
      <ForceBnbSwitch>
        <NftMarket />
      </ForceBnbSwitch>
    </Container>
  )
}
