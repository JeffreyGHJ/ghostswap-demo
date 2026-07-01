import { ChainId } from '@ghostlabsweb3/sdk';

export enum Feature {
    AMM = 'AMM',
    AMM_V2 = 'AMM V2',
    LIQUIDITY_MINING = 'Liquidity Mining',
    BENTOBOX = 'Mirror',
    KASHI = 'Lend',
    MISO = 'MISO',
    MMO = 'MMO',
    ANALYTICS = 'Analytics',
    MIGRATE = 'Migrate',
    STAKING = 'Staking',
    BRIDGE = 'Bridge',
    GOVERNANCE = 'Governance',
}

const features = {
    [ChainId.BSC]: [
       // Feature.AMM,
        //Feature.LIQUIDITY_MINING,
        // Feature.MIGRATE
        //Feature.ANALYTICS,
        //Feature.STAKING,
       // Feature.MMO,
      //  Feature.BRIDGE,
       // Feature.GOVERNANCE,
    ],
    [ChainId.BSC_TEST]: [
       // Feature.AMM,
       // Feature.LIQUIDITY_MINING,
        /*
    Feature.MIGRATE,
    Feature.ANALYTICS,
    */ //Feature.MMO,
     //   Feature.BRIDGE,
       // Feature.STAKING,
       // Feature.BENTOBOX,
        //Feature.KASHI,
    ],
};

export function featureEnabled(feature: Feature, chainId: ChainId): boolean {
    return features?.[chainId]?.includes(feature);
}

export function chainsWithFeature(feature: Feature): ChainId[] {
    return Object.keys(features)
        .filter((chain) => features[chain].includes(feature))
        .map((chain) => ChainId[chain]);
}
