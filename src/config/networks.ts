import { ChainId } from '@ghostlabsweb3/sdk';

//TODO: Change these links
const bsc_icon = 'https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png';
const bsc_testnet_icon = 'https://www.logo.wine/a/logo/Binance/Binance-BNB-Icon-Logo.wine.svg';

export const NETWORK_ICON = {
    [ChainId.BSC]: bsc_icon,
    [ChainId.BSC_TEST]: bsc_testnet_icon,
};

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
    [ChainId.BSC]: 'Binance Smart Chain',
    [ChainId.BSC_TEST]: 'Binance Testnet',
};

export const TESTNET = 0;
