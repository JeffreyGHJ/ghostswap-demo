import Head from 'next/head'
import Container from '../../../components/Container'
import PoolViewer from '../../../components/PoolViewer'
import ForceBnbSwitch from '../../../components/ForceBnbSwitch'

const view = () => {
  return (
    <ForceBnbSwitch>
      <Container id="nft-page" maxWidth="full">
        <Head>
          <title>Pool Viewer | GhostSwap</title>
          <meta key="description" name="description" content="Explore..." />
        </Head>
        <PoolViewer />
      </Container>
    </ForceBnbSwitch>
  )
}

export default view
