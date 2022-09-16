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
export default function Withdraw() {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const fundAddress = chainId in addresses ? addresses[chainId]["YieldFund"][0] : null

    //TODO: get helper-config working instead!... gets rid of decimal function
    const chainIdNum = parseInt(chainIdHex!)

    const decimals = chainId in addresses ? networkConfig[chainIdNum].decimals : null

    //const tokenAddress = chainId in addresses ? networkConfig[chainIdNum].assetAddress : null

    //const poolAddress = chainId in addresses ? networkConfig[chainIdNum].poolAddress : null

    //setEntranceFee triggers the update
    const [fundAmount, setFundAmount] = useState("")

    const [val, setVal] = useState("")

    const dispatch = useNotification()

    const {
        runContractFunction: withdraw,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!, // specify the networkId
        functionName: "withdrawFundsFromPool",
        params: { amount: BigNumber.from((Number(val) * 10 ** decimals!).toString()) },
    })

    /* View Functions */
    // const { runContractFunction: getFundAmount } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: fundAddress!, // specify the networkId
    //     functionName: "getFundAmount",
    //     params: { address: "0x861Aea40c9AcC62435cEa31b2078FF3e022D6627"},
    // })

    // async function updateUI() {

    //     const fundFromCall = ((await getFundAmount()) as BigNumber).toString()
    //     setFundAmount(fundFromCall)
    // }

    // useEffect(() => {
    //     if (isWeb3Enabled && fundAddress) {
    //         updateUI()
    //     }
    // }, [isWeb3Enabled, fundAddress])

    const handleSuccess = async function (tx: ContractTransaction) {
        try {
            await tx.wait(1)
            handleNewNotification()
        } catch (error) {
            console.log(error)
            handleNewNotification1()
        }
        //updateUI()
    }

    const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
        setVal(event.target.value)
        console.log("value is:", event.target.value)
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Withdraw Complete!",
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
            Withdraw from Contract
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
                            await withdraw({
                                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Withdraw</div>
                        )}
                    </button>
                    <h2>Withdraw Amount: {val} USDT</h2>
                    <h2>Your Information:</h2>
                    <div>Amount Funded: {fundAmount} USDT</div>
                </div>
            ) : (
                <div>No Funds Detected</div>
            )}
        </div>
    )
}
