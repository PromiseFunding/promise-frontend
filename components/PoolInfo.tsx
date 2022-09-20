import { contractAddresses, abi, erc20Abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { Dropdown, useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { BigNumber, ethers, ContractTransaction } from "ethers"
import { networkConfig } from "../helper-config"

interface contractAddressesInterface {
    [key: string]: { YieldFund: string[] }
}

//contract is already deployed... trying to look at features of contract
export default function PoolInfo() {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const fundAddress =
        chainId in addresses
            ? addresses[chainId]["YieldFund"][addresses[chainId]["YieldFund"].length - 1]
            : null
    console.log(`fundAddress: ${fundAddress}`)

    //TODO: get helper-config working instead!... gets rid of decimal function
    const chainIdNum = parseInt(chainIdHex!)

    const poolAddress = chainId in addresses ? networkConfig[chainIdNum].poolAddress : null

    const [timeLock, setTimeLock] = useState("0") //changes entranceFee to a stateHook and triggers a rerender for us... entranceFee starts out as 0
    //setEntranceFee triggers the update
    const [owner, setOwner] = useState("0")

    const { runContractFunction: getTimeLock } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!, // specify the networkId
        functionName: "getTimeLock",
        params: {},
    })

    const { runContractFunction: getOwner } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getOwner",
        params: {},
    })

    async function updateUI() {
        const timeFromCall = ((await getTimeLock()) as BigNumber).toString()
        const ownerFromCall = ((await getOwner()) as BigNumber).toString()
        setTimeLock(timeFromCall)
        setOwner(ownerFromCall)
        //decimal = (await decimals()) as BigNumber
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            updateUI()
        }
    }, [isWeb3Enabled, fundAddress])

    return (
        <div className="p-5">
            {isWeb3Enabled && fundAddress ? (
                <div className="">
                    <h2>Pool Information:</h2>
                    <div>TimeLock: {timeLock} seconds</div>
                    <div>Owner Address: {owner} </div>
                    <div> Pool Address: {poolAddress} </div>
                </div>
            ) : (
                <div>No Fund Address Detected</div>
            )}
        </div>
    )
}
