import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { BigNumber, ContractTransaction } from "ethers"
import { contractAddressesInterface, propType } from "../config/types"
import { tokenConfig } from "../config/token-config"

//contract is already deployed... trying to look at features of contract
export default function Withdraw(props: propType) {
    const fundAddress = props.fundAddress
    const tokenAddress = props.assetAddress
    const updateAmount = props.updateAmount

    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    //TODO: get helper-config working instead!... gets rid of decimal function
    const chainIdNum = parseInt(chainIdHex!)

    let coinName = "USDT"

    for (const coin in tokenConfig[chainIdNum]) {
        if (tokenConfig[chainIdNum][coin].assetAddress == tokenAddress) {
            coinName = coin
        }
    }

    const decimals = chainId in addresses ? tokenConfig[chainIdNum][coinName].decimals : null

    const [amountFunded, setAmountFunded] = useState(0)

    const [val, setVal] = useState("")

    const dispatch = useNotification()

    const {
        runContractFunction: withdraw,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "withdrawProceedsFunder",
        params: { amount: BigNumber.from((Number(val) * 10 ** decimals!).toString()) },
    })

    const { runContractFunction: getFundAmount } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getFundAmount",
        params: { funder: account },
    })


    async function updateUI() {
        const amountFundedFromCall = (await getFundAmount()) as number
        setAmountFunded(amountFundedFromCall / 10 ** decimals!)
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            updateUI()
        }
    }, [isWeb3Enabled, fundAddress, updateAmount])

    const handleSuccess = async function (tx: ContractTransaction) {
        try {
            await tx.wait(1)
            setVal("0")
            handleNewNotification()
        } catch (error) {
            console.log(error)
            handleNewNotification1()
        }
        updateUI()
    }

    const handleChange = async (event: { target: { value: SetStateAction<string> } }) => {
        const max = amountFunded
        if (amountFunded == 0) {
            setVal("0")
        } else if ((event.target.value as unknown as number) > 0) {
            const value = Math.max(
                1 * 10 ** -decimals!,
                Math.min(max as number, Number(Number(event.target.value).toFixed(decimals!)))
            )
            setVal(value.toString())
        } else if ((event.target.value as unknown as number) <= 0) {
            setVal("0")
        } else {
            setVal(event.target.value)
        }
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
            message: "Withdraw Failed!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    return (
        <div className="p-5 bg-slate-800 text-slate-200">
            <div>
                <h1 className="text-xl font-bold">Withdraw from Contract</h1>
                <br></br>
            </div>
            {isWeb3Enabled && fundAddress ? (
                true ? (
                    <div className="">
                        <input
                            maxLength={21 - (decimals || 6)}
                            type="number"
                            placeholder="0.00"
                            id="message1"
                            name="message"
                            onChange={handleChange}
                            value={val}
                            autoComplete="off"
                            className="text-slate-900"
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                            onClick={async function () {
                                await withdraw({
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
                        <h2>
                            <br></br>
                            Withdraw Amount: {val || 0} {coinName}
                        </h2>
                        <h2>Your Information:</h2>
                        <div>
                            Amount Withdrawable: {amountFunded} {coinName}
                        </div>
                    </div>
                ) : (
                    <>
                        <h1>Time Lock Still Initiated. Unable to Withdraw</h1>
                        <h2>Your Information:</h2>
                        <div>Amount Funded: {amountFunded} {coinName}</div>
                    </>
                )
            ) : (
                <div>No Funds Detected</div>
            )}
        </div>
    )
}
