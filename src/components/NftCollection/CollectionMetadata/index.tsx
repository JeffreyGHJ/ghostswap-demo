import AddressHolder from '../../AddressHolder'
import DropdownMenu from '../../DropdownMenu'
import CollectionDescription from './CollectionDescription'

const CollectionMetadata = ({ details, description }) => {
  return (
    <div id="auxiliary-controls" className="w-full">
      <div id="control-group-row" className="flex flex-row flex-wrap items-center justify-center mt-6 mb-4">
        <AddressHolder address={details.address} />
        <DropdownMenu details={details} />
      </div>
      <CollectionDescription
        description={description}
        fallback={details?.description !== 'null' ? details.description : null}
      />
    </div>
  )
}

export default CollectionMetadata
