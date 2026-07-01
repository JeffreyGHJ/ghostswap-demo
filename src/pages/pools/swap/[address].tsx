import Head from 'next/head'
import Container from '../../../components/Container'
import PoolSwap from '../../../components/PoolSwap'
import ForceBnbSwitch from '../../../components/ForceBnbSwitch'

const swap = () => {
  return (
    <ForceBnbSwitch>
      <Container id="pool-swap-page" maxWidth="full">
        <Head>
          <title>Pool Viewer | GhostSwap</title>
          <meta key="description" name="description" content="Explore..." />
        </Head>
        <PoolSwap />
      </Container>
    </ForceBnbSwitch>
  )
}

export default swap
