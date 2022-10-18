import { contractAddresses, abi, erc20Abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { BigNumber } from "ethers"
import { networkConfig } from "../config/helper-config"
import { contractAddressesInterface, propType } from "../config/types"
import { tokenConfig } from "../config/token-config"

//contract is already deployed... trying to look at features of contract
export default function Deposit(props: propType) {
    const fundAddress = props.fundAddress
    const tokenAddress = props.assetAddress

    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    //TODO: get helper-config working instead!... gets rid of decimal function
    const chainIdNum = parseInt(chainIdHex!)

    const poolAddress = chainId in addresses ? networkConfig[chainIdNum].poolAddress : null

    let coinName = "USDT"

    for (const coin in tokenConfig[chainIdNum]) {
        if (tokenConfig[chainIdNum][coin].assetAddress == tokenAddress) {
            coinName = coin
        }
    }

    const decimals = chainId in addresses ? tokenConfig[chainIdNum][coinName].decimals : null

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
        contractAddress: fundAddress!, // specify the networkId
        functionName: "fund",
        params: { amount: BigNumber.from((Number(val) * 10 ** decimals!).toString()) },
    })

    const handleSuccess = async function () {
        const fundTx: any = await fund()
        try {
            await fundTx.wait(1)
            handleNewNotification()
        } catch (error) {
            console.log(error)
            handleNewNotificationError()
        }
    }

    const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
        //making the max donation 100,000,000 tokens at a time
        const max = 100000000
        //for now we are only allowing to two decimal places for deposits and withdraws
        // const value = Math.round((Math.max(0, Math.min(max as number, Number(event.target.value))) + Number.EPSILON) * 100) / 100
        // setVal(value.toString())
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
        <div className="p-5 bg-slate-800 text-slate-200 rounded border-2 border-slate-500">
            <div>
                <h1 className="text-xl font-bold">Lossless Yield Generating Donation</h1>
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
                                onSuccess: () => handleSuccess(),
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
                </div>
            ) : (
                <div>No Fund Address Detected</div>
            )}
        </div>
    )
}
