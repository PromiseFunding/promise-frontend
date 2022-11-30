//trying to use this instead of updateUI() for everything

export interface networkConfigItem {
    name?: string
    subscriptionId?: string
    gasLane?: string
    keepersUpdateInterval?: string
    raffleEntranceFee?: string
    callbackGasLimit?: string
    vrfCoordinatorV2?: string
    blockConfirmations?: number
    assetAddress?: string
    poolAddress?: string
    assetName?: string
    poolAddressProvider?: string
    decimals?: number
    tracker?: string
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: "localhost",
        callbackGasLimit: "500000", // 500,000 gas
        blockConfirmations: 1,
        poolAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        decimals: 6,
    },
    5: {
        name: "goerli",
        blockConfirmations: 6,
        poolAddress: "0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6",
        decimals: 6,
        tracker: "https://goerli.etherscan.io/address/"
    },
    1: {
        name: "mainnet",
        keepersUpdateInterval: "30",
        decimals: 6,
    },
    421613: {
        name: "arbitrum_goerli",
        blockConfirmations: 6,
        poolAddress: "0x6Cbb4E8eC402E07fDF96DbbC6c752aCfB0eB6075",
        tracker: "https://goerli.arbiscan.io/address/"
    },
}

export const states = [
    "Accepting Donations",
    "Voting In Progress",
    "Project Owner Can Withdraw",
    "Funders of the Current Milestone and Beyond Can Withdraw Donations",
]

export const developmentChains = ["hardhat", "localhost"]
export const DEFAULT_ASSET_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
export const DEFAULT_POOL_ADDRESS = "0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6"
