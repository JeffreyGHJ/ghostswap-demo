import Web3 from 'web3'

const SoulEatersMintConfigs = (
  littleGhostsOwned,
  account,
  presaleStartTime,
  presaleEndTime,
  presaleMaxMints,
  presaleMints,
  presaleMintPrice,
  burnStartTime,
  burnEndTime,
  burnMaxMints,
  burnMaxMintsPerWallet,
  burnedMints,
  burnMintsPerAddress
) => {
  const accountWhitelist = ['0xdf2d511a915e4fdc54f49d8a1150b6d451d9cf4a']

  const burnToMintEligible = () => {
    return littleGhostsOwned.length > 1
  }

  const whitelistEligible = () => {
    return accountWhitelist.includes(account?.toLowerCase())
  }

  const publicEligible = () => {
    return account !== null
  }

  const whitelistConfigs = [
    {
      optionName: 'Presale',
      eligible: publicEligible(),
      startDate: presaleStartTime,
      endDate: presaleEndTime,
      limit: null,
      stageLimit: presaleMaxMints,
      stageMints: presaleMints,
      price: { token: 'MATIC', amount: +Web3.utils.fromWei(presaleMintPrice.toString()), sigfigs: 2 },
      tags: ['Presale'],
      eligibleDescriptor: null,
      whitelist: null,
      burn: false,
    },
    {
      optionName: 'Burn-to-Mint',
      eligible: burnToMintEligible(),
      startDate: burnStartTime,
      endDate: burnEndTime,
      limit: { amount: burnMaxMintsPerWallet, type: 'per-wallet' },
      stageLimit: burnMaxMints,
      stageMints: burnedMints,
      stageMintsByUser: burnMintsPerAddress,
      price: { token: 'LittleGhosts', amount: 2, sigfigs: null },
      tags: ['Burn-to-Mint'],
      eligibleDescriptor: 'Only holders of LittleGhosts NFTs',
      whitelist: null,
      burn: true,
    },
    // {
    //   optionName: 'Whitelist',
    //   eligible: whitelistEligible(),
    //   startDate: new Date(Date.now() + 1000 * 15) /* starts in 5 sec*/,
    //   endDate: new Date(Date.now() + 1000 * 20) /* ends in 25 sec*/,
    //   limit: { amount: 3, type: 'per-wallet' },
    //   stageLimit: null,
    //   price: { token: 'MATIC', amount: 25, sigfigs: 2 },
    //   tags: ['Whitelist'],
    //   eligibleDescriptor: null,
    //   whitelist: 1000,
    //   burn: false,
    // },
    // {
    //   optionName: 'Public',
    //   eligible: publicEligible(),
    //   startDate: new Date(Date.now() + 1000 * 25) /* starts in 5 sec*/,
    //   endDate: new Date(Date.now() + 1000 * 30) /* ends in 25 sec*/,
    //   limit: null,
    //   stageLimit: null,
    //   price: { token: 'MATIC', amount: 40, sigfigs: 2 },
    //   tags: ['Public'],
    //   eligibleDescriptor: null,
    //   whitelist: null,
    //   burn: false,
    // },
  ]

  return whitelistConfigs
}

export default SoulEatersMintConfigs
