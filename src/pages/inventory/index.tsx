import Head from 'next/head'
import Container from '../../components/Container'
import Inventory from '../../components/Inventory'
import ForceBnbSwitch from '../../components/ForceBnbSwitch'

const inventory = () => {
  return (
    <Container id="inventory-page-container" className="flex h-full " maxWidth="full">
      <Head>
        <title>Inventory | GhostSwap</title>
        <meta key="description" name="description" content="Explore..." />
      </Head>
      <ForceBnbSwitch>
        <Inventory />
      </ForceBnbSwitch>
    </Container>
  )
}

export default inventory
