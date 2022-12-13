import { abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { ContractTransaction, BigNumber } from "ethers"
import { propType } from "../config/types"

export default function EndVote(props: propType) {
    const fundAddress = props.fundAddress
    const tranche = props.tranche
    const owner = props.ownerFund
    const decimals = props.decimals
    const timeLeftVoting = props.timeLeftVoting
    const funderSummary = props.funderSummary

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()

    const [amountFundedInTranche, setAmountFundedInTranche] = useState(0)

    const [userAddress, setAddress] = useState("0")

    const dispatch = useNotification()


    const {
        runContractFunction: endVote,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "endVote",
        params: {},
    })

    const { runContractFunction: getFunderTrancheAmountRaised } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getFunderTrancheAmountRaised",
        params: { funder: account, level: tranche },
    })

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


    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Vote Ended!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleNewNotification1 = function () {
        dispatch({
            type: "info",
            message: "Vote End Failed.",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    return (
        <div className="flex flex-col">
            {isWeb3Enabled && timeLeftVoting == 0 ? (
                owner != userAddress ? (
                    amountFundedInTranche > 0 ? (
                        <div className="flex-1 p-5 bg-slate-800 text-slate-200">
                            <div>
                                <h1 className="text-xl font-bold">End Vote</h1>
                            </div>
                            <br></br>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                                onClick={async function () {
                                    await endVote({
                                        onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                        onError: (error) => console.log(error),
                                    })
                                }}
                                disabled={isLoading || isFetching}
                            >
                                {isLoading || isFetching ? (
                                    <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                                ) : (
                                    <div>Submit</div>
                                )}
                            </button>
                            <br></br>
                            The voting period has ended. Press the button above to process the vote.
                        </div>) : (<></>))
                    : (
                        <div className="flex-1 p-5 bg-slate-800 text-slate-200">
                            <div>
                                <h1 className="text-xl font-bold">End Vote</h1>
                            </div>
                            <br></br>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                                onClick={async function () {
                                    await endVote({
                                        onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                        onError: (error) => console.log(error),
                                    })
                                }}
                                disabled={isLoading || isFetching}
                            >
                                {isLoading || isFetching ? (
                                    <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                                ) : (
                                    <div>Submit</div>
                                )}
                            </button>
                            <br></br>
                            The voting period has ended. Press the button above to process the vote.
                        </div>
                    )
            ) : (
                <p></p>
            )}{" "}
        </div>
    )
}

