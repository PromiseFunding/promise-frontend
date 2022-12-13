import { abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { ContractTransaction } from "ethers"
import { propType } from "../config/types"

export default function StartVote(props: propType) {
    const fundAddress = props.fundAddress
    const tranche = props.tranche
    const owner = props.ownerFund
    const decimals = props.decimals
    const funderSummary = props.funderSummary

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()

    const [val, setVal] = useState("")
    const [amountFundedInTranche, setAmountFundedInTranche] = useState(0)
    const [userAddress, setAddress] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: startVote,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "startVote",
        params: { length: val },
    })

    async function updateUI() {
        const amountFundedFromCall = funderSummary!.funderTrancheAmountRaised.toNumber()
        setAmountFundedInTranche(amountFundedFromCall / 10 ** decimals!)
    }

    useEffect(() => {
        if (account) {
            setAddress(account.toLowerCase())
        }
    }, [account])

    useEffect(() => {
        if (funderSummary) {
            updateUI()
        }
    }, [funderSummary])

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            props.onGetFunderInfo!(account!, tranche!)
        }
    }, [isWeb3Enabled, fundAddress])


    const handleSuccess = async function (tx: ContractTransaction) {
        try {
            await tx.wait(1)
            props.onChangeState!()
            handleNewNotification()
        } catch (error) {
            console.log(error)
            handleNewNotification1()
        }
    }


    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Vote Started!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleNewNotification1 = function () {
        dispatch({
            type: "info",
            message: "Vote Failed.",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleChange = async (event: { target: { value: SetStateAction<string> } }) => {
        setVal(event.target.value)
    }

    return (
        <div className="flex flex-col">
            {isWeb3Enabled ? (
                owner != userAddress ? (
                    amountFundedInTranche > 0 ? (
                        <div className="flex-1 p-5 bg-slate-800 text-slate-200">
                            <div>
                                <h1 className="text-xl font-bold">Start Vote</h1>
                            </div>
                            <br></br>
                            <input
                                maxLength={3}
                                type="number"
                                id="message"
                                name="message"
                                onChange={handleChange}
                                placeholder="Length in days..."
                                value={val}
                                autoComplete="off"
                                className="text-slate-900"
                            />
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                                onClick={async function () {
                                    await startVote({
                                        onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                        onError: (error) => console.log(error),
                                    })
                                }}
                                disabled={isLoading || isFetching}
                            >
                                {isLoading || isFetching ? (
                                    <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                                ) : (
                                    <div>Start</div>
                                )}
                            </button>
                            <br></br>
                            If you believe this milestone has met its goals, start a vote of minimum length 7 days and maximum 14 days.
                        </div>
                    ) : (<h1 className="p-5 text-2xl font-bold bg-slate-800">
                        You cannot start the voting progress, because you have not donated to the project.</h1>)
                ) : (
                    <div className="flex-1 p-5 bg-slate-800 text-slate-200">
                        <div>
                            <h1 className="text-xl font-bold">Start Vote</h1>
                        </div>
                        <br></br>
                        <input
                            maxLength={3}
                            type="number"
                            id="message"
                            name="message"
                            onChange={handleChange}
                            placeholder="Length in days..."
                            value={val}
                            autoComplete="off"
                            className="text-slate-900"
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                            onClick={async function () {
                                await startVote({
                                    onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                    onError: (error) => console.log(error),
                                })
                            }}
                            disabled={isLoading || isFetching}
                        >
                            {isLoading || isFetching ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            ) : (
                                <div>Start</div>
                            )}
                        </button>
                        <br></br>
                        If you believe this milestone has met its goals, start a vote of minimum length 7 days and maximum 14 days. As the owner of this fundraiser, you can call for a vote a maximum of 2 times.
                    </div>
                ))

                : (
                    <p></p>
                )}{" "}
        </div>
    )
}
