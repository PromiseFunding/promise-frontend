import { contractAddresses, abi, erc20Abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { Dropdown, useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { BigNumber, ethers, ContractTransaction } from "ethers"
import { sendError } from "next/dist/server/api-utils"

interface contractAddressesInterface {
    [key: string]: { YieldFund: string[] }
}

//contract is already deployed... trying to look at features of contract
export default function Deposit() {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()
    const fundAddress = chainId in addresses ? addresses[chainId]["YieldFund"][0] : null

    const [timeLock, setTimeLock] = useState("0") //changes entranceFee to a stateHook and triggers a rerender for us... entranceFee starts out as 0
    //setEntranceFee triggers the update
    const [owner, setOwner] = useState("0")
    const [poolAddy, setPoolAddress] = useState("0")
    const [val, setVal] = useState("")

    const dispatch = useNotification()

    const {
        runContractFunction: approve,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: erc20Abi,
        contractAddress: "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49",
        functionName: "approve",
        params: {
            _spender: fundAddress,
            _value: BigNumber.from((Number(val) * 10 ** 6).toString()),
        },
    })

    const { runContractFunction: fund } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!, // specify the networkId
        functionName: "fund",
        params: { amount: BigNumber.from((Number(val) * 10 ** 6).toString()) },
    })

    /* View Functions */

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

    const { runContractFunction: getPoolAddress } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getPoolAddress",
        params: {},
    })

    async function updateUI() {
        const timeFromCall = ((await getTimeLock()) as BigNumber).toString()
        const ownerFromCall = ((await getOwner()) as BigNumber).toString()
        const poolFromCall = ((await getPoolAddress()) as BigNumber).toString()
        setTimeLock(timeFromCall)
        setOwner(ownerFromCall)
        setPoolAddress(poolFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx: ContractTransaction) {
        // await tx.wait(1)

        const fundTx: any = await fund()
        await fundTx.wait(1)
        handleNewNotification()
        updateUI()
    }

    const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
        setVal(event.target.value)
        console.log("value is:", event.target.value)
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    return (
        <div className="p-5">
            Depositing To Contract
            {fundAddress ? (
                <div className="">
                    <input
                        type="text"
                        id="message"
                        name="message"
                        onChange={handleChange}
                        value={val}
                        autoComplete="off"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await approve({
                                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                onError: (error) => console.log(error),
                            })
                            // await fund({
                            //     onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                            //     onError: (error) => console.log(error),
                            // })
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
                    <h2>Pool Information:</h2>
                    <div>TimeLock: {timeLock} seconds</div>
                    <div>Owner Address: {owner} </div>
                    <div> Pool Address: {poolAddy} </div>
                </div>
            ) : (
                <div>No Fund Address Deteched</div>
            )}
        </div>
    )
}
