import { contractAddresses, abi, erc20Abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useState, useEffect } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { BigNumber } from "ethers"
import { propType } from "../config/types"
import styles from "../styles/Home.module.css"

//contract is already deployed... trying to look at features of contract
export default function StraightDonation(props: propType) {
    const fundAddress = props.fundAddress
    const tokenAddress = props.assetAddress
    const decimals = props.decimals
    const coinName = props.coinName
    const totalRaised = props.totalRaised
    const tranche = props.tranche
    const state = props.currState
    const milestone = tranche! + 1
    const funderSummary = props.funderSummary

    // const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const [amountFunded, setAmountFunded] = useState<number>()
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
        },
    })

    const { runContractFunction: fund } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "fund",
        params: { amount: BigNumber.from((Number(val) * 10 ** decimals!).toString()), current: false },
    })

    async function updateUI() {
        const amountFundedFromCall = funderSummary!.fundAmount.toNumber()
        setAmountFunded(amountFundedFromCall / 10 ** decimals!)
    }
    useEffect(() => {
        if (funderSummary) {
            updateUI()
        }
    }, [funderSummary])

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            props.onGetFunderInfo!(account!, tranche!)
        }
    }, [isWeb3Enabled, fundAddress, account, totalRaised])

    let alertMessage = ""
    const handleSuccess = async function () {
        if (state == 4) {
            alertMessage = "Friendly Reminder: By confirming the next MetaMask transaction you will be funding " +
                JSON.stringify(val + " " + coinName) +
                " to the seed round and it will go straight to the fundraiser."
        }
        else {
            alertMessage = "Friendly Reminder: By confirming the next MetaMask transaction you will be funding " +
                JSON.stringify(val + " " + coinName) +
                " split evenly among the remaining Milestones. We are currently in Milestone " +
                JSON.stringify(milestone) +
                "."
        }
        alert(
            alertMessage
        )
        const fundTx: any = await fund()
        setVal("0")
        try {
            await fundTx.wait(1)
            props.onChangeAmountFunded!()
            handleNewNotification()
            props.onGetFunderInfo!(account!, tranche!)
        } catch (error) {
            console.log(error)
            handleNewNotificationError()
        }
    }

    const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
        //making the max donation 100,000,000 tokens at a time
        const max = 100000000
        //for now we are only allowing to two decimal places for deposits and withdraws
        if ((event.target.value as unknown as number) > 0) {
            const value = Math.max(
                1 * 10 ** -decimals!,
                Math.min(max as number, Number(Number(event.target.value).toFixed(decimals!)))
            )
            setVal(value.toString())
        } else if ((event.target.value as unknown as number) < 0) {
            setVal("0")
        } else {
            setVal(event.target.value)
        }
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Donation Complete!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleNewNotificationError = function () {
        dispatch({
            type: "info",
            message: "Donation Failed!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    return (
        <div className="p-5 bg-slate-800 text-slate-200">
            <div className={styles.tooltip}>
                {state == 4 ? (
                    <h1 className="text-xl font-bold">
                        Pre Milestone Round Donation
                    </h1>
                ) : (<h1 className="text-xl font-bold">
                    Donation Split Equally Among Remaining Milestones
                </h1>)}
                {/* <span className={styles.tooltiptext}>You will be donating x amount in each remaining milestone</span>
                <br></br> */}
                <br></br>
            </div>

            {isWeb3Enabled && fundAddress ? (
                <div className="">
                    <input
                        maxLength={21 - (decimals || 6)}
                        type="number"
                        min="0"
                        placeholder="0.00"
                        id="message"
                        name="message"
                        onChange={handleChange}
                        value={val}
                        autoComplete="off"
                        className="text-slate-900"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await approve({
                                onSuccess: (tx) => handleSuccess(),
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
                    <h2>
                        <br></br>
                        Deposit Amount: {val || 0} {coinName}
                    </h2>
                    {state == 0 ? (
                        <h1>
                            Total Funds Donated: {amountFunded} {coinName}</h1>
                    ) : (<></>)
                    }
                    {/* Total Funds In Escrow: {amountFunded} {coinName} */}
                </div>
            ) : (
                <div>No Fund Address Detected</div>
            )}
        </div>
    )
}
