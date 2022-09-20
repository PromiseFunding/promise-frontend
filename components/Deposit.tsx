import { contractAddresses, abi, erc20Abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { Dropdown, useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { BigNumber, ethers, ContractTransaction } from "ethers"
import { sendError } from "next/dist/server/api-utils"
import { networkConfig } from "../helper-config"

interface contractAddressesInterface {
    [key: string]: { YieldFund: string[] }
}

//contract is already deployed... trying to look at features of contract
export default function Deposit() {
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

    const decimals = chainId in addresses ? networkConfig[chainIdNum].decimals : null

    const tokenAddress = chainId in addresses ? networkConfig[chainIdNum].assetAddress : null

    const poolAddress = chainId in addresses ? networkConfig[chainIdNum].poolAddress : null

    const [timeLock, setTimeLock] = useState("0") //changes entranceFee to a stateHook and triggers a rerender for us... entranceFee starts out as 0
    //setEntranceFee triggers the update
    const [owner, setOwner] = useState("0")

    const [val, setVal] = useState("")

    const dispatch = useNotification()

    const {
        runContractFunction: approve,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: erc20Abi,
        contractAddress: tokenAddress!,
        functionName: "approve",
        params: {
            _spender: fundAddress,
            _value: BigNumber.from((Number(val) * 10 ** decimals!).toString()),
            // _value: BigNumber.from(Number(val)).mul(BigNumber.from(10).pow(decimals)); might need to use this instead
        },
    })

    const { runContractFunction: fund } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!, // specify the networkId
        functionName: "fund",
        params: { amount: BigNumber.from((Number(val) * 10 ** decimals!).toString()) },
    })

    /* View Functions */
    // const { runContractFunction: getAssetAddress } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: fundAddress!, // specify the networkId
    //     functionName: "getAssetAddress",
    //     params: {},
    // })

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

    const handleSuccess = async function () {
        // await tx.wait(1)

        const fundTx: any = await fund()
        try {
            await fundTx.wait(1)
            handleNewNotification()
        } catch (error) {
            console.log(error)
            handleNewNotification1()
        }
        updateUI()
    }

    const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
        setVal(event.target.value)
        console.log("value is:", event.target.value)
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Donation Complete!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleNewNotification1 = function () {
        dispatch({
            type: "info",
            message: "Donation Failed!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    return (
        <div className="p-5">
            Depositing To Contract
            {isWeb3Enabled && fundAddress ? (
                <div className="">
                    <input
                        maxLength={21 - (decimals || 6)}
                        type="number"
                        min="0"
                        id="message"
                        name="message"
                        onChange={handleChange}
                        value={val}
                        autoComplete="off"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            //gets asset address and decimals
                            // const assetFromCall = (
                            //     (await getAssetAddress()) as BigNumber
                            // ).toString()
                            // setAsset(assetFromCall)

                            await approve({
                                onSuccess: () => handleSuccess(),
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Donate</div>
                        )}
                    </button>
                    <h2>Deposit Amount: {val} USDT</h2>
                </div>
            ) : (
                <div>No Fund Address Detected</div>
            )}
        </div>
    )
}
