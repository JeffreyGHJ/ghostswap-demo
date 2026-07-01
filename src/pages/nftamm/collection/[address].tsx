import Container from '../../../components/Container'
import ForceBnbSwitch from '../../../components/ForceBnbSwitch'
import NftCollection from '../../../components/NftCollection'
import React from 'react'

const Collection = (props) => {
  return (
    <Container id="nft-collection-page" className="pb-4 mb-[9.5rem] md:mb-[4.5rem]" maxWidth="full">
      <ForceBnbSwitch>
        <NftCollection />
      </ForceBnbSwitch>
    </Container>
  )
}

export default React.memo(Collection)
