import { contractAddresses, abi, erc20Abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useState, useEffect } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { BigNumber } from "ethers"
import { contractAddressesInterface, propType } from "../config/types"
import { tokenConfig } from "../config/token-config"
import styles from "../styles/Home.module.css"
import { ContractTransaction } from "ethers"
import { database, storage } from "../firebase-config"
import { update, set, ref as refDb, ref, onValue } from "firebase/database"

//contract is already deployed... trying to look at features of contract
export default function CurrentTrancheDonation(props: propType) {
    const fundAddress = props.fundAddress
    const tokenAddress = props.assetAddress
    const tranche = props.tranche
    const decimals = props.decimals
    const coinName = props.coinName
    const totalRaised = props.totalRaised
    const funderSummary = props.funderSummary

    const milestone = tranche! + 1
    // const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()
    const [amountFunded, setAmountFunded] = useState(0)
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

    const { runContractFunction: fundCurrent } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "fund",
        params: {
            amount: BigNumber.from((Number(val) * 10 ** decimals!).toString()),
            current: true,
        },
    })

    async function updateUI() {
        const amountFundedFromCall = funderSummary!.funderTrancheAmountRaised.toNumber()
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

    const handleSuccess = async function (tx: ContractTransaction) {
        //alert("Friendly Reminder: By confirming the next MetaMask transaction you will be funding " + JSON.stringify(val + " " + coinName) + " to Milestone " + JSON.stringify(milestone))
        try {
            await tx.wait(1)
        } catch (error) {
            console.log(error)
            handleNewNotificationError()
        }
        const fundTx: any = await fundCurrent()
        setVal("0")
        try {
            await fundTx.wait(1)
            props.onChangeAmountFunded!()
            handleNewNotification()
            props.onGetFunderInfo!(account!, tranche!)
            var donorRef = ref(database, chainId + "/users/" + account + "/donor/" + fundAddress)

            onValue(donorRef, (snapshot) => {
                if (!snapshot.exists()) {
                    set(refDb(database, `${chainId}/users/${account}/donor/${fundAddress}`), {
                        fundAddress: fundAddress,
                    })
                }
            })
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
        } else {
            setVal("0")
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
                <h1 className="text-xl font-bold">Donation to Current Milestone Only</h1>
                {/* <span className={styles.tooltiptext}>You will be donating x amount in milestone ___</span>
                <br></br> */}
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
                                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
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
                    Funds Locked In Milestone {tranche! + 1}: {amountFunded} {coinName}
                </div>
            ) : (
                <div>No Fund Address Detected</div>
            )}
        </div>
    )
}
