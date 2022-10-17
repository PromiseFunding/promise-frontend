//Only for Goerli for now
export interface tokenConfigItem {
    assetAddress?: string
    aaveTokenAddress?: string
    poolAddress?: string
    assetName?: string
    decimals?: number
}

type Dictionary = {
    [x: string]: tokenConfigItem
}

export interface tokenConfigInfo {
    [key: number]: Dictionary
}

export const tokenConfig: tokenConfigInfo = {
    5: {
        USDT: {
            assetAddress: "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49",
            aaveTokenAddress: "0x73258E6fb96ecAc8a979826d503B45803a382d68",
            poolAddress: "0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6",
            assetName: "TetherToken",
            decimals: 6,
        },
        USDC: {
            assetAddress: "0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43",
            aaveTokenAddress: "0x1Ee669290939f8a8864497Af3BC83728715265FF",
            poolAddress: "0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6",
            assetName: "USDCToken",
            decimals: 6,
        },
        DAI: {
            assetAddress: "0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464",
            aaveTokenAddress: "0x310839bE20Fc6a8A89f33A59C7D5fC651365068f",
            poolAddress: "0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6",
            assetName: "DAIToken",
            decimals: 18,
        },
        WETH: {
            assetAddress: "0x2e3A2fb8473316A02b8A297B982498E661E1f6f5",
            aaveTokenAddress: "0x27B4692C93959048833f40702b22FE3578E77759",
            poolAddress: "0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6",
            assetName: "WETHToken",
            decimals: 18,
        },
    },
    31337: {
        USDT: {
            assetAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
            aaveTokenAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            assetName: "USDT",
            poolAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            decimals: 6,
        },
        // DAI, USDC, WETH are just dummies
        DAI: {
            assetAddress: "0x1",
            aaveTokenAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            assetName: "USDT",
            poolAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            decimals: 6,
        },
        USDC: {
            assetAddress: "0x2",
            aaveTokenAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            assetName: "USDT",
            poolAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            decimals: 6,
        },
        WETH: {
            assetAddress: "0x3",
            aaveTokenAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            assetName: "USDT",
            poolAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            decimals: 6,
        },
    },
    421613: {
        USDT: {
            assetAddress: "0xbAc565f93f3192D35E9106E67B9d5c9348bD9389",
            aaveTokenAddress: "0x4c78955a00c4b2a623267eb68bec88DFCb4cb4C4",
            assetName: "USDT",
            poolAddress: "0x6Cbb4E8eC402E07fDF96DbbC6c752aCfB0eB6075",
            decimals: 6,
        },
        // DAI, USDC, WETH are just dummies
        DAI: {
            assetAddress: "0x7e752bC77eBE2225B327e6ebF09fAD7801873931",
            aaveTokenAddress: "0x113B76f72294eC2aF8E8911AF864245B5d1cAbb4",
            assetName: "DAI",
            poolAddress: "0x6Cbb4E8eC402E07fDF96DbbC6c752aCfB0eB6075",
            decimals: 6,
        },
        USDC: {
            assetAddress: "0x6775842AE82BF2F0f987b10526768Ad89d79536E",
            aaveTokenAddress: "0x4de6918B9D2c953bb003168D64A49A6A189510D5",
            assetName: "USDC",
            poolAddress: "0x6Cbb4E8eC402E07fDF96DbbC6c752aCfB0eB6075",
            decimals: 6,
        },
        WETH: {
            assetAddress: "0xCDa739D69067333974cD73A722aB92E5e0ad8a4F",
            aaveTokenAddress: "0x4f57EAA84fe40cC1eCaa77D3db3108A146c9a39B",
            assetName: "WETH",
            poolAddress: "0x6Cbb4E8eC402E07fDF96DbbC6c752aCfB0eB6075",
            decimals: 6,
        },
    },
}

// export const developmentChains = ["hardhat", "localhost"]
// export const DEFAULT_ASSET_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
// export const DEFAULT_POOL_ADDRESS = "0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6"
