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

export default function WithdrawProceeds() {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const fundAddress =
        chainId in addresses
            ? addresses[chainId]["YieldFund"][addresses[chainId]["YieldFund"].length - 1]
            : null
    console.log(fundAddress)
    const [owner, setOwner] = useState("0")
    const [userAddress, setAddress] = useState("0")
    const [withdrawableProceeds, setWithdrawableProceeds] = useState(0)

    const chainIdNum = parseInt(chainIdHex!)

    const decimals = chainId in addresses ? networkConfig[chainIdNum].decimals : null
    const [fundAmount, setFundAmount] = useState()

    const [val, setVal] = useState("")

    const dispatch = useNotification()

    const {
        runContractFunction: withdrawProceeds,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!, // specify the networkId
        functionName: "withdrawProceeds",
        params: { amount: BigNumber.from((Number(val) * 10 ** decimals!).toString()) },
    })

    const { runContractFunction: getOwner } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getOwner",
        params: {},
    })

    const { runContractFunction: getWithdrawableProceeds } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getWithdrawableProceeds",
        params: {},
    })

    const handleSuccess = async function (tx: ContractTransaction) {
        try {
            await tx.wait(1)
            handleNewNotification()
        } catch (error) {
            console.log(error)
            handleNewNotification1()
        }
    }

    const initData = async function () {
        if (isWeb3Enabled) {
            const ownerFromCall = await getOwner()
            setOwner((ownerFromCall as string).toLowerCase())
            const withdrawableProceedsFromCall = await getWithdrawableProceeds()
            setWithdrawableProceeds(withdrawableProceedsFromCall as number)

            console.log(owner)
        }
    }

    // Gets called only on load.
    useEffect(() => {
        initData()
    }, [isWeb3Enabled])

    useEffect(() => {
        if (account) {
            setAddress(account.toLowerCase())
        }
    }, [account])

    const handleChange = async (event: { target: { value: SetStateAction<string> } }) => {
        const max = withdrawableProceeds || 1
        console.log("max is: ", max)
        const value = Math.max(0, Math.min(max as number, Number(event.target.value)))
        setVal(value.toString())
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
            {" "}
            {isWeb3Enabled && owner == userAddress ? (
                <div>
                    You're the Owner :D Available to withdraw: {withdrawableProceeds.toString()}
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
                    <br></br>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await withdrawProceeds({
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
                </div>
            ) : (
                // <div>Not Owner</div>
                <div></div>
            )}{" "}
        </div>
    )
}
