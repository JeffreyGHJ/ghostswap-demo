import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Card, Container } from '@nextui-org/react'
import { useEffect } from 'react'

const AssetAmounts = (props) => {
  return (
    <Container id="asset-amounts" md className="flex w-full p-0">
      <Card variant="flat" className="p-3 m-3 bg-black border-2 border-gray-600 rounded-md">
        <Card.Body className="flex p-0 text-white">
          {props.poolType === 'BUY' && (
            <AssetAmountsBuy
                nftCollection={props.nftCollection}
                token={props.token}
              poolType={props.poolType}
              blockInvalidInput={props.blockInvalidInput}
              numValidTrades={props.numValidTrades}
              isValidInputs={props.isValidInputs}
              amountToBuy={props.amountToBuy}
              setAmountToBuy={props.setAmountToBuy}
              selectedPurchases={props.selectedPurchases}
              setSelectedPurchases={props.setSelectedPurchases}
              totalPurchasePrice={props.totalPurchasePrice}
              partialPurchasePrice={props.partialPurchasePrice}
            />
          )}
          {props.poolType === 'SELL' && (
            <AssetAmountsSell
                nftCollection={props.nftCollection}
                token={props.token}
              poolType={props.poolType}
              blockInvalidInput={props.blockInvalidInput}
              numValidTrades={props.numValidTrades}
              isValidInputs={props.isValidInputs}
              amountToSell={props.amountToSell}
              setAmountToSell={props.setAmountToSell}
              selectedSales={props.selectedSales}
              setSelectedSales={props.setSelectedSales}
              partialSalesPrice={props.partialSalesPrice}
              totalSalesPrice={props.totalSalesPrice}
            />
          )}
          {props.poolType === 'BUY_AND_SELL' && (
            <AssetAmountsTrade
              nftCollection={props.nftCollection}
              token={props.token}
              poolType={props.poolType}
              blockInvalidInput={props.blockInvalidInput}
              numValidTrades={props.numValidTrades}
              isValidInputs={props.isValidInputs}
              feeAmount={props.feeAmount}
              setFeeAmount={props.setFeeAmount}
              amountToBuy={props.amountToBuy}
              setAmountToBuy={props.setAmountToBuy}
              amountToSell={props.amountToSell}
              setAmountToSell={props.setAmountToSell}
              selectedPurchases={props.selectedPurchases}
              setSelectedPurchases={props.setSelectedPurchases}
              selectedSales={props.selectedSales}
              setSelectedSales={props.setSelectedSales}
              totalPurchasePrice={props.totalPurchasePrice}
              partialPurchasePrice={props.partialPurchasePrice}
              partialSalesPrice={props.partialSalesPrice}
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

const AssetAmountsTrade = (props) => {
  return (
    <>
      <div id="heading" className="text-[1.5rem] font-bold text-center w-full leading-[1.5]">
        Deposit Amounts
      </div>
      <div
        id="subheading"
        className="text-[15px] text-center mb-3 flex flex-wrap items-center justify-center whitespace-nowrap mt-1"
      >
        Set your
        <div className="font-bold flex items-center text-[16px] mx-1">
          <img src={'/images/tokens/bnb-icon.png'} width={24} height={24} className="flex mr-1" />
          {' BNB '}
        </div>
        and
        <div className="font-bold text-[16px] flex mx-1">
          <img src={'/nft.png'} width={24} height={24} className="flex mr-1" />
            {props.nftCollection.name}
        </div>
        deposit amounts.
      </div>
      <div className="flex flex-wrap items-center justify-center whitespace-nowrap mt-[22.5px] ">
        <div className="pr-3 font-bold text-[20px]">Buy up to</div>
        <div
          id="input-group"
          className="flex items-center border relative h-[2.8rem] border-gray-600 rounded-[5px] max-w-[360px]"
        >
          <span className="flex items-center justify-center">
            <input
              type="number"
              min={0}
              step={1}
              value={props.amountToBuy || ''}
              onKeyDown={(e) => props.blockInvalidInput(e, 'integer')}
              onChange={(e) => props.setAmountToBuy(+e.target.value)}
              className="pl-3 py-2 bg-black rounded w-full min-w-[60px] leading-[1.5] h-full"
            ></input>
            <ExclamationCircleIcon
              style={{ visibility: props.isValidInputs ? 'hidden' : 'visible' }}
              width={22}
              height={22}
              color={'red'}
            />
          </span>

          <div id="currency-display" className="flex items-center h-full px-3">
            <div className="ml-1">{props.nftCollection.name}</div>
          </div>
        </div>
      </div>

      {!props.isValidInputs && (
        <div id="invalid-notification" className="w-full text-center text-red text-[.9rem] mt-1">
          You can only buy up to {props.numValidTrades} NFTs at the current price curve. Either increase the start price
          or decrease the delta to allow for more buys.
        </div>
      )}

      <div className="m-1 text-center text-[15px] tracking-tight">
        Deposit <b>BNB</b> to buy up to <b>{props.amountToBuy} {props.nftCollection.name}</b>
      </div>

      <div className="w-full flex justify-center font-bold text-[1.25rem] my-3">and</div>
      <div className="flex flex-wrap items-center justify-center whitespace-nowrap ">
        <div className="pr-3 font-bold text-[20px]">Sell up to</div>
        <div
          id="input-group"
          className="flex items-center border relative h-[2.8rem] border-gray-600 rounded-[5px] max-w-[360px]"
        >
          <span className="flex items-center justify-center">
            <input
              type="number"
              min={0}
              step={1}
              value={props.amountToSell || ''}
              onKeyDown={(e) => props.blockInvalidInput(e, 'integer')}
              onChange={(e) => props.setAmountToSell(+e.target.value)}
              className="pl-3 py-2 bg-black rounded w-full min-w-[60px] leading-[1.5] h-full"
            ></input>
            <ExclamationCircleIcon
              style={{ visibility: props.isValidInputs ? 'hidden' : 'visible' }}
              width={22}
              height={22}
              color={'red'}
            />
          </span>

          <div id="currency-display" className="flex items-center h-full px-3">
            <div className="ml-1">{props.nftCollection.name}</div>
          </div>
        </div>
      </div>

      <div className="m-1 text-center text-[15px] tracking-tight">
        Deposit <b>{props.amountToSell} {props.nftCollection.name}</b> to sell for <b>BNB</b>
      </div>

      <hr className="bg-gray-800 h-[1px] my-4"></hr>

      <div className="text-[1.25rem] text-center">You will deposit:</div>

      <div className="m-1 flex items-center flex-wrap justify-center text-center text-[15px] tracking-tight">
        <div className="font-bold flex items-center text-[16px] mx-1">
          <b>{(+props.totalPurchasePrice).toFixed(3)}</b>
          <img src={'/images/tokens/bnb-icon.png'} width={24} height={24} className="flex mx-1" />
          {' BNB '}
        </div>
        and
        <div className="font-bold flex items-center text-[16px] mx-1">
          <b>{props.amountToSell}</b>
          <img src={'/nft.png'} width={24} height={24} className="flex mx-1" />
          {props.nftCollection.name}
        </div>
      </div>

      <hr className="bg-gray-800 h-[1px] my-4"></hr>

      <div className="flex flex-col items-center justify-around w-full h-full tracking-tight sm:flex-row">
        <div id="slider-group-1" className="w-full">
          <div className="w-full text-center">
            Buying {props.selectedPurchases} NFT{+props.selectedPurchases !== 1 && 's'}...
          </div>
          <div className="flex items-center justify-center w-full py-3">
            <input
              type="range"
              style={{ accentColor: 'dimgray', transform: 'rotate(180deg)' }}
              className="w-2/3 sm:w-full"
              value={props.selectedPurchases || 0}
              min={0}
              max={props.amountToBuy}
              step={1}
              onChange={(e) => props.setSelectedPurchases(e.target.value)}
            ></input>
          </div>
          <div className="w-full mb-2 text-center">Will cost you {(+props.partialPurchasePrice).toFixed(3)} BNB.</div>
        </div>
        <div className="w-[80%] h-[.5px] my-1 sm:my-0 sm:w-[.5px] sm:mx-2 sm:h-full bg-gray-800"></div>
        <div id="slider-group-2" className="w-full mt-2 sm:mt-0">
          <div className="w-full text-center">
            Selling {props.selectedSales} NFT{+props.selectedSales !== 1 && 's'}...
          </div>
          <div className="flex items-center justify-center w-full py-3">
            <input
              type="range"
              style={{ accentColor: 'dimgray' }}
              className="w-2/3 sm:w-full"
              value={props.selectedSales || 0}
              min={0}
              max={props.amountToSell}
              step={1}
              onChange={(e) => props.setSelectedSales(e.target.value)}
            ></input>
          </div>
          <div className="w-full mb-2 text-center">Will earn you {(+props.partialSalesPrice).toFixed(3)} BNB.</div>
        </div>
      </div>
    </>
  )
}

const AssetAmountsBuy = (props) => {
  return (
    <>
      <Heading />
      <div className="flex flex-wrap items-center justify-center whitespace-nowrap mt-[22.5px] ">
        <div className="pr-3">If you want to buy</div>
        <div
          id="input-group"
          className="flex items-center border relative h-[2.8rem] border-gray-600 rounded-[5px] max-w-[360px]"
        >
          <span className="flex items-center justify-center">
            <input
              type="number"
              min={0}
              step={1}
              value={props.amountToBuy || ''}
              onKeyDown={(e) => props.blockInvalidInput(e, 'integer')}
              onChange={(e) => props.setAmountToBuy(+e.target.value)}
              className="pl-3 py-2 bg-black rounded w-full min-w-[60px] leading-[1.5] h-full"
            ></input>
            <ExclamationCircleIcon
              style={{ visibility: props.isValidInputs ? 'hidden' : 'visible', width: 22, height: 22, color: 'red' }}
            />
          </span>

          <div id="currency-display" className="flex items-center h-full px-3">
            <div className="ml-1">{props.nftCollection.name}</div>
          </div>
        </div>
      </div>
      {!props.isValidInputs && (
        <div id="invalid-notification" className="w-full text-center text-red text-[.9rem] mt-1">
          You can only buy up to {props.numValidTrades} NFTs at the current price curve. Either increase the start price
          or decrease the delta to allow for more buys.
        </div>
      )}
      <div id="earnings" className="w-full text-center mt-[6px]">
        <span>you need to deposit </span>
        {(+props.totalPurchasePrice).toFixed(3)} BNB total.
      </div>

      <hr className="bg-gray-800 h-[1px] my-4"></hr>

      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="w-full text-center">
          <span>Buying </span>
          {props.selectedPurchases} NFTs...
        </div>

        <div className="flex items-center justify-center w-full p-3">
          <input
            type="range"
            style={{ accentColor: 'dimgray' }}
            className="w-2/3"
            value={props.selectedPurchases || 0}
            min={0}
            max={props.amountToBuy}
            step={1}
            onChange={(e) => props.setSelectedPurchases(e.target.value)}
          ></input>
        </div>

        <div className="w-full text-center mb-[10%]">
          Will <span>cost</span> you {(+props.partialPurchasePrice).toFixed(3)} BNB.
        </div>
      </div>
    </>
  )
}

const AssetAmountsSell = (props) => {
  return (
    <>
      <Heading />
      <div className="flex flex-wrap items-center justify-center whitespace-nowrap mt-[22.5px] ">
        <div className="pr-3">If you want to Sell</div>
        <div
          id="input-group"
          className="flex items-center border relative h-[2.8rem] border-gray-600 rounded-[5px] max-w-[360px]"
        >
          <span className="flex items-center justify-center">
            <input
              type="number"
              min={0}
              step={1}
              value={props.amountToSell || ''}
              onKeyDown={(e) => props.blockInvalidInput(e, 'integer')}
              onChange={(e) => props.setAmountToSell(+e.target.value)}
              className="pl-3 py-2 bg-black rounded w-full min-w-[60px] leading-[1.5] h-full"
            ></input>
            <ExclamationCircleIcon
              style={{ visibility: props.isValidInputs ? 'hidden' : 'visible', width: 22, height: 22, color: 'red' }}
            />
          </span>

          <div id="currency-display" className="flex items-center h-full px-3">
            <div className="ml-1">{props.nftCollection.name}</div>
          </div>
        </div>
      </div>
      {!props.isValidInputs && (
        <div id="invalid-notification" className="w-full text-center text-red text-[.9rem] mt-1">
          You can only buy up to {props.numValidTrades} NFTs at the current price curve. Either increase the start price
          or decrease the delta to allow for more buys.
        </div>
      )}
      <div id="earnings" className="w-full text-center mt-[6px]">
        <span>you will earn </span>
        {(+props.totalSalesPrice).toFixed(3)} BNB total.
      </div>

      <hr className="bg-gray-800 h-[1px] my-4"></hr>

      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="w-full text-center">
          <span>Selling </span>
          {props.selectedSales} NFTs...
        </div>

        <div className="flex items-center justify-center w-full p-3">
          <input
            type="range"
            style={{ accentColor: 'dimgray' }}
            className="w-2/3"
            value={props.selectedSales || 0}
            min={0}
            max={props.amountToSell}
            step={1}
            onChange={(e) => props.setSelectedSales(e.target.value)}
          ></input>
        </div>

        <div className="w-full text-center mb-[10%]">
          Will <span>earn</span> you {(+props.partialSalesPrice).toFixed(3)} BNB.
        </div>
      </div>
    </>
  )
}

const Heading = () => {
  return (
    <>
      <div id="heading" className="text-[1.5rem] font-bold text-center w-full">
        Asset Amounts
      </div>
      <div id="subheading" className="text-[15px] text-center mb-3 mt-1">
        Set how many tokens you deposit into the pool.
      </div>
    </>
  )
}

export default AssetAmounts
