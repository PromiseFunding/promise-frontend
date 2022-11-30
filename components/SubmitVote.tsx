import { abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { ContractTransaction } from "ethers"
import { propType } from "../config/types"

export default function SubmitVote(props: propType) {
    const fundAddress = props.fundAddress

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()

    const [voteVal, setVoteVal] = useState<boolean>(true)

    const [alreadyVoted, setAlreadyVoted] = useState<boolean>(false)

    const dispatch = useNotification()

    const {
        runContractFunction: submitVote,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "submitVote",
        params: { support: voteVal },
    })

    const {
        runContractFunction: didFunderVote,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "didFunderVote",
        params: { funder: account },
    })

    async function updateUI() {
        const didFunderVoteFromCall = (await didFunderVote()) as boolean
        setAlreadyVoted(didFunderVoteFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            updateUI()
        }
    }, [isWeb3Enabled, fundAddress])

    const handleSuccess = async function (tx: ContractTransaction) {
        try {
            await tx.wait(1)
            handleNewNotification()
            updateUI()
        } catch (error) {
            console.log(error)
            handleNewNotification1()
        }
    }


    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Vote Submitted!",
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
        event.target.value == "Yes" ? setVoteVal(true) : setVoteVal(false)
    }

    return (
        <div className="flex flex-col">
            {!alreadyVoted && isWeb3Enabled ? (
                <div className="flex-1 p-5 bg-slate-800 text-slate-200">
                    <div>
                        <h1 className="text-xl font-bold">Submit Vote</h1>
                    </div>
                    <br></br>
                    <select
                        id="assetName"
                        onChange={handleChange}
                        className="text-slate-800"
                    >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await submitVote({
                                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Vote</div>
                        )}
                    </button>
                    <br></br>
                    Do you believe the project followed through on the promises they made for this milestone?
                </div>
            ) : (
                <h1 className="p-5 text-2xl font-bold bg-slate-800">
                    You have successfully submitted your vote for this milestone. Thank you!</h1>
            )}{" "}
        </div>
    )
}