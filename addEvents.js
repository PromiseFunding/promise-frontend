const Moralis = require("moralis-v1/node")
require("dotenv").config()
const contractAddresses = require("./constants/contractAddresses.json")

let chainId = process.env.chainId || 31337
let moralisChainID = chainId == "31337" ? "1337" : chainId
const addresses = contractAddresses
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const appId = process.env.NEXT_PUBLIC_APP_ID
const masterKey = process.env.MASTER_KEY

async function main() {
    const fundAddress =
        chainId in addresses
            ? addresses[chainId]["YieldFundAAVE"][addresses[chainId]["YieldFundAAVE"].length - 1]
            : null

    const factoryAddress =
        chainId in addresses
            ? addresses[chainId]["FundFactory"][addresses[chainId]["FundFactory"].length - 1]
            : null

    await Moralis.start({ serverUrl, appId, masterKey })
    console.log(`Working with Contract Address: ${fundAddress}`)

    let funderAddedOptions = {
        chainId: moralisChainID,
        sync_historical: true,
        address: fundAddress,
        topic: "FunderAdded(address,address,address,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "funder",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "assetAddress",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "FunderAdded",
            type: "event",
        },
        tableName: "FunderAdded",
    }
    let fundsWithdrawnOptions = {
        chainId: moralisChainID,
        sync_historical: true,
        address: fundAddress,
        topic: "FundsWithdrawn(address,address,address,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "funder",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "assetAddress",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "FundsWithdrawn",
            type: "event",
        },
        tableName: "FundsWithdrawn",
    }
    let proceedsWithdrawnOptions = {
        chainId: moralisChainID,
        sync_historical: true,
        address: fundAddress,
        topic: "ProceedsWithdrawn(address,address,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "assetAddress",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "ProceedsWithdrawn",
            type: "event",
        },
        tableName: "ProceedsWithdrawn",
    }

    let fundCreatedOptions = {
        chainId: moralisChainID,
        sync_historical: true,
        address: factoryAddress,
        topic: "Created(address,address,address)",
        abi: {
            type: "event",
            anonymous: false,
            name: "Created",
            inputs: [
                { type: "address", name: "owner", indexed: true },
                { type: "address", name: "assetAddress", indexed: true },
                { type: "address", name: "fundAddress", indexed: true },
            ],
        },
        tableName: "Created",
    }

    const fundResponse = await Moralis.Cloud.run("watchContractEvent", funderAddedOptions, {
        useMasterKey: true,
    })
    const fundsWithdrawnResponse = await Moralis.Cloud.run(
        "watchContractEvent",
        fundsWithdrawnOptions,
        {
            useMasterKey: true,
        }
    )
    const proceedsWithdrawnResponse = await Moralis.Cloud.run(
        "watchContractEvent",
        proceedsWithdrawnOptions,
        {
            useMasterKey: true,
        }
    )

    const fundCreatedResponse = await Moralis.Cloud.run("watchContractEvent", fundCreatedOptions, {
        useMasterKey: true,
    })

    if (
        fundResponse.success &&
        fundsWithdrawnResponse.success &&
        proceedsWithdrawnResponse.success &&
        fundCreatedResponse.success
    ) {
        console.log("Success! Database Updated with watching events")
    } else {
        console.log("Failed, something went wrong...")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
