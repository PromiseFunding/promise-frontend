import { contractAddresses, abi, erc20Abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { BigNumber, ContractTransaction } from "ethers"
import { contractAddressesInterface, propType } from "../config/types"
import { tokenConfig } from "../config/token-config"

export default function StartVote(props: propType) {
    const fundAddress = props.fundAddress

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()

    const [val, setVal] = useState("")

    const dispatch = useNotification()


    const {
        runContractFunction: startVote,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!, // specify the networkId
        functionName: "startVote",
        params: { length: val },
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
                    If you believe you have met your goals for this milestone, start a vote of minimum length 14 days.
                </div>
            ) : (
                <p></p>
            )}{" "}
        </div>
    )
}
