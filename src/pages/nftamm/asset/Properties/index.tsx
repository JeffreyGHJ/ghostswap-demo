function isUnixTimestamp(value) {
  return /^\d+$/.test(value) && parseInt(value) >= 946684800
}

function timestampToDate(timestamp) {
  return new Date(parseInt(timestamp) * 1000).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  })
}

const Properties = ({ traitValues, traitIds, traitNames, metadata }) => {
  return (
    <div
      id="properties"
      className="flex-col items-center justify-center w-full p-3 mt-6 border border-gray-800 rounded-md"
    >
      <div id="label" className="w-full text-[20px] font-black text-left mb-[0.375rem]">
        Properties
      </div>
      <div
        id="properties-grid"
        className="grid grid-cols-1 xxs:grid-cols-2 lg:grid-cols-3 gap-x-[6px] gap-y-2 leading-[1.25]"
      >
        {Array.isArray(traitIds) &&
          traitIds.map((traits, i) => {
            const value =
              traitValues[i] && traitValues[i][traitIds[i]] ? traitValues[i][traitIds[i]].replace(/"/g, '') : 'None'
            const formattedValue = isUnixTimestamp(value) ? timestampToDate(value) : value
            return (
              <div id="property" className="px-3 py-3 bg-gray-900 rounded-md" key={i}>
                <div className="flex flex-col gap-1">
                  <div id="property-name" className="text-[16px] text-[#b9b9ff] font-black">
                    {traitNames[i]}
                  </div>
                  <div id="property-value" className="text-[20px] font-black">
                    {formattedValue}
                  </div>
                </div>
              </div>
            )
          })}
        {Array.isArray(metadata) && metadata.length > 0 ? (
          metadata.map((meta, i) => {
            const value = meta.value
            const formattedValue = isUnixTimestamp(value) ? timestampToDate(value) : value
            return (
              <div id="property" className="px-3 py-3 bg-gray-900 rounded-md" key={i}>
                <div className="flex flex-col gap-1">
                  <div id="property-name" className="text-[16px] text-[#b9b9ff] font-black">
                    {meta.trait_type}
                  </div>
                  <div id="property-value" className="text-[20px] font-black">
                    {formattedValue}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default Properties
