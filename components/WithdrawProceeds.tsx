import { contractAddresses, abi, erc20Abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { ContractTransaction } from "ethers"
import { contractAddressesInterface, propType } from "../config/types"
import { tokenConfig } from "../config/token-config"

export default function WithdrawProceeds(props: propType) {
    const fundAddress = props.fundAddress
    const tokenAddress = props.assetAddress
    const owner = props.ownerFund
    const tranche = props.tranche
    const state = props.currState
    const milestoneSummary = props.milestoneSummary

    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()
    const [userAddress, setAddress] = useState("0")
    const [withdrawableProceeds, setWithdrawableProceeds] = useState(0)

    const chainIdNum = parseInt(chainIdHex!)

    let coinName = "USDT"

    for (const coin in tokenConfig[chainIdNum]) {
        if (tokenConfig[chainIdNum][coin].assetAddress == tokenAddress) {
            coinName = coin
        }
    }

    const decimals = chainId in addresses ? tokenConfig[chainIdNum][coinName].decimals : null

    const dispatch = useNotification()

    const {
        runContractFunction: withdrawProceeds,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "withdrawProceeds",
        params: {},
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

    const updateUI = async function () {
        if (isWeb3Enabled && fundAddress && milestoneSummary) {
            if (state == 4) {
                let withdrawableProceedsFromCall = milestoneSummary!.preMilestoneTotalFunded.toNumber()
                if (withdrawableProceedsFromCall > 0) {
                    setWithdrawableProceeds(withdrawableProceedsFromCall / 10 ** decimals!)
                }
            }
            else {
                let withdrawableProceedsFromCall = milestoneSummary!.milestones[tranche!].activeRaised!.toNumber()
                setWithdrawableProceeds(withdrawableProceedsFromCall / 10 ** decimals!)
            }
        }
    }

    useEffect(() => {
        if (milestoneSummary) {
            updateUI()
        }
    }, [isWeb3Enabled, chainId, milestoneSummary])

    useEffect(() => {
        if (milestoneSummary) {
            updateUI()
        }
    }, [])

    useEffect(() => {
        if (account) {
            setAddress(account.toLowerCase())
        }
    }, [account])

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Withdraw Complete!",
            title: "Transaction Notification",
            position: "topR",
        })
        updateUI()
    }

    const handleNewNotification1 = function () {
        dispatch({
            type: "info",
            message: "Withdraw Failed!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    return (
        <div className="flex flex-col">
            {isWeb3Enabled && owner == userAddress ? (
                <div className="flex-1 p-5 bg-slate-800 text-slate-200">
                    <div>
                        <h1 className="text-xl font-bold">Withdraw Proceeds</h1>
                    </div>
                    <br></br>
                    <h1 className="p-5 text-2xl font-normal bg-slate-800">
                        Withdrawing is all or none. Clicking the button will result in {withdrawableProceeds.toString()} {coinName} being sent to your account.</h1>
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
                    <div>
                        <br></br>
                        Available to withdraw: {withdrawableProceeds.toString()} {coinName}
                    </div>
                </div>
            ) : (
                <p></p>
            )}{" "}
        </div>
    )
}
