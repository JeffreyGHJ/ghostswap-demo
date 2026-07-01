import { useEffect, useState } from 'react'
import MintControls from './MintControls'
import MintDetails from './MintDetails'
import ProductDescription from './ProductDescription'
import MintDisclaimer from './MintDisclaimer'
import MintReserves from './MintReserves'
import useCollectionApi from '../../hooks/useCollectionApi'
import BurnModal from './BurnModal'
import { useWeb3React } from '@web3-react/core'
import {
  checkApproval,
  getTotalSupply,
  getBurnedMints,
  checkAndApproveSoulEaters,
  executeMintWithBurn,
  getMintConfigVariables,
  fetchPolygonGhostsAndSetAddress,
  getBurnMintsPerAddress,
} from './functions'

const littleGhostsBinance = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48'
const littleGhostsPolygon = '0x5337b9e543cb80ffafeb08bf3d564fa11e28202b'
const separator = 'h-[1px] w-full border border-[#2181e7] border-opacity-[15%] mt-12 mb-4 lg:mt-32 lg:mb-10 '
const page = 'flex justify-center w-full px-4 py-4 xs:px-6 sm:px-10 h-fit'

const Launchpad = (props) => {
  const { account, chainId, provider } = useWeb3React()
  const { fetchNftsOwnedInCollection } = useCollectionApi()
  const maxSupply = 6600
  const [totalSupply, setTotalSupply] = useState(null)
  const [burnedMints, setBurnedMints] = useState(null)
  const [amountToMint, setAmountToMint] = useState(1)
  const [mintProgress, setMintProgress] = useState(0)
  const [soldOut, setSoldOut] = useState(props.amountMinted >= props.mintLimit)
  const [mintingEnded, setMintingEnded] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [selectedOption, setSelectedOption] = useState(null)
  const [maxMints, setMaxMints] = useState(null) // amountToMintMax
  const [modalOpen, setModalOpen] = useState(false)
  const [littleGhostsOwned, setLittleGhostsOwned] = useState([])
  const [selectedGhosts, setSelectedGhosts] = useState([])
  const [burnModalStep, setBurnModalStep] = useState(1)
  const [mintConfigs, setMintConfigs] = useState(null)
  const [isApproved, setIsApproved] = useState(undefined)
  const [approvalPending, setApprovalPending] = useState(false)
  const [approvalRejected, setApprovalRejected] = useState(false)
  const [burnMintsPerAddress, setBurnMintsPerAddress] = useState(null)

  // The value of 'now' is updated once every second to serve as a 'tick system' for the launchpad timers
  const [now, setNow] = useState(new Date(Date.now()))

  // On mount, begin running setNow() every 1000ms (1sec) to serve as clock that drives the 'tick system'
  useEffect(() => {
    const counter = setInterval(() => {
      setNow(new Date(Date.now()))
    }, 1000)
    return () => clearInterval(counter)
  }, [])

  // ----------------------- DEBUG OUTPUTS -----------------------------
  useEffect(() => {
    console.log('account: ', account)
  }, [account])

  useEffect(() => {
    console.log('isApproved: ', isApproved)
  }, [isApproved])

  useEffect(() => {
    console.log('approvalPending: ', approvalPending)
  }, [approvalPending])

  useEffect(() => {
    console.log('selectedGhosts: ', selectedGhosts)
  }, [selectedGhosts])

  useEffect(() => {
    console.log('littleGhostsOwned: ', littleGhostsOwned)
  }, [littleGhostsOwned])

  useEffect(() => {
    console.log('mintConfigs: ', mintConfigs)
  }, [mintConfigs])

  useEffect(() => {
    console.log('burnMintsPerAddress: ', burnMintsPerAddress)
  }, [burnMintsPerAddress])

  // ----------------------- END DEBUG OUTPUTS -------------------------

  useEffect(() => {
    if (burnModalStep === 2) checkApproval(account, provider, setIsApproved)
  }, [burnModalStep])

  useEffect(() => {
    if (chainId === 137 && !!provider) {
      getTotalSupply(provider, setTotalSupply)
      getBurnedMints(provider, setBurnedMints)
      if (!!account) getBurnMintsPerAddress(account, provider, setBurnMintsPerAddress)
    }
  }, [chainId, provider, account])

  useEffect(() => {
    if (totalSupply !== null && burnedMints !== null) {
      console.log('getting Mint configs')
      setSelectedOption(null)
      getMintConfigVariables(setMintConfigs, account, littleGhostsOwned, burnedMints, burnMintsPerAddress)
    }
  }, [totalSupply, burnedMints, littleGhostsOwned, account, burnMintsPerAddress])

  // hack: replace the token address of bridged polygon ghosts with the bnb address for image fetching
  useEffect(() => {
    if (!account) return
    fetchPolygonGhostsAndSetAddress(account, fetchNftsOwnedInCollection, setLittleGhostsOwned)
  }, [account])

  useEffect(() => {
    setMintProgress((totalSupply / maxSupply) * 100)
  }, [totalSupply, maxSupply])

  useEffect(() => {
    setDisabled(!account || selectedOption === null || totalSupply >= maxSupply)
  }, [account, selectedOption, totalSupply, maxSupply])

  useEffect(() => {
    setSoldOut(totalSupply >= maxSupply)
  }, [totalSupply, maxSupply])

  useEffect(() => {
    let maxMints = maxSupply - totalSupply
    if (amountToMint > maxMints) setAmountToMint(maxMints)
    setMaxMints(maxMints)
  }, [selectedOption, maxSupply, totalSupply])

  useEffect(() => {
    setMintingEnded(!mintConfigs?.some((config) => config.endDate > now))
  }, [mintConfigs, selectedOption])

  // Dummy test function
  const executeMint = () => {
    let newTotalSupply = +totalSupply + +amountToMint
    setTotalSupply(newTotalSupply)
    if (newTotalSupply + +amountToMint > maxSupply) setAmountToMint(maxSupply - +newTotalSupply)
  }

  return (
    <div id="launchpad-page" className={page}>
      <BurnModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        littleGhostsOwned={littleGhostsOwned}
        selectedGhosts={selectedGhosts}
        setSelectedGhosts={setSelectedGhosts}
        burnModalStep={burnModalStep}
        setBurnModalStep={setBurnModalStep}
        amountToMint={amountToMint}
        isApproved={isApproved}
        approvalPending={approvalPending}
        approvalRejected={approvalRejected}
        setApprovalRejected={setApprovalRejected}
        executeMintWithBurn={() => executeMintWithBurn(account, provider, selectedGhosts, setModalOpen)}
        checkAndApproveSoulEaters={() =>
          checkAndApproveSoulEaters(account, provider, setIsApproved, setApprovalPending, setApprovalRejected)
        }
      />
      <div id="launchpad-page-content-container" className="max-w-[1500px] h-fit">
        <div id="top-section" className="flex flex-col gap-8 md:justify-between md:flex-row-reverse">
          <MintControls
            mintProgress={mintProgress}
            amountMinted={totalSupply}
            mintLimit={maxSupply}
            amountToMint={amountToMint}
            setAmountToMint={setAmountToMint}
            disabled={disabled}
            account={account}
            executeMint={executeMint}
            soldOut={soldOut}
            mintingEnded={mintingEnded}
            maxMints={maxMints}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            whitelistConfigs={mintConfigs}
            now={now}
            setModalOpen={setModalOpen}
          />
          <MintDetails
            maxSupply={maxSupply}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            whitelistConfigs={mintConfigs}
            account={account}
            now={now}
          />
        </div>
        <div id="bottom-section" className="flex flex-col">
          <div className={separator} />
          <div id="bottom-section-content" className="flex flex-col justify-between md:flex-row ">
            <ProductDescription />
            <MintReserves />
          </div>
        </div>
        <MintDisclaimer />
      </div>
    </div>
  )
}

export default Launchpad
