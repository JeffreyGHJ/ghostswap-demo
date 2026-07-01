import Head from 'next/head'
import Container from '../../components/Container'
import Launchpad from '../../components/Launchpad'

const launchpad = () => {
  return (
    <Container id="launchpad-page-container" className="flex h-full " maxWidth="full">
      <Head>
        <title>Launchpad | GhostSwap</title>
        <meta key="description" name="description" content="Explore..." />
      </Head>
      <Launchpad />
    </Container>
  )
}

export default launchpad
