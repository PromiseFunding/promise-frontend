import { contractAddresses, abi, erc20Abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { BigNumber, ContractTransaction } from "ethers"
import { contractAddressesInterface, propType } from "../config/types"
import { tokenConfig } from "../config/token-config"

export default function EndVote(props: propType) {
    const fundAddress = props.fundAddress

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()

    const [timeLeftVoting, setTimeLeftVoting] = useState(0)

    const dispatch = useNotification()


    const {
        runContractFunction: endVote,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!, // specify the networkId
        functionName: "endVote",
        params: {},
    })

    const {
        runContractFunction: getTimeLeftVoting,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!, // specify the networkId
        functionName: "getTimeLeftVoting",
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

    async function updateUI() {
        const timeLeftFromCall = (await getTimeLeftVoting()) as number
        setTimeLeftVoting(timeLeftFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            updateUI()
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
            {isWeb3Enabled && timeLeftVoting == 0? (
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
            ) : (
                <p></p>
            )}{" "}
        </div>
    )
}

