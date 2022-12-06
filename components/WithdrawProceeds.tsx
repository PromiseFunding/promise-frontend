import { contractAddresses, abi, erc20Abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { BigNumber, ContractTransaction } from "ethers"
import { contractAddressesInterface, propType } from "../config/types"
import { tokenConfig } from "../config/token-config"

export default function WithdrawProceeds(props: propType) {
    const fundAddress = props.fundAddress
    const tokenAddress = props.assetAddress
    const owner = props.ownerFund
    const tranche = props.tranche

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

    const [val, setVal] = useState("")

    const dispatch = useNotification()

    const {
        runContractFunction: withdrawProceeds,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "withdrawProceeds",
        params: { amount: BigNumber.from((Number(val) * 10 ** decimals!).toString()) },
    })

    const { runContractFunction: getTrancheAmountRaised } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getTrancheAmountRaised",
        params: { level: tranche },
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

    const initData = async function () {
        if (isWeb3Enabled && fundAddress) {
            //add if statement here for state for pre funding round
            let withdrawableProceedsFromCall = (await getTrancheAmountRaised()) as number
            if (withdrawableProceedsFromCall > 0) {
                setWithdrawableProceeds(withdrawableProceedsFromCall / 10 ** decimals!)
            }
        }
    }

    useEffect(() => {
        initData()
    }, [isWeb3Enabled, chainId])

    useEffect(() => {
        initData()
    }, [])

    useEffect(() => {
        if (account) {
            setAddress(account.toLowerCase())
        }
    }, [account])

    const handleChange = async (event: { target: { value: SetStateAction<string> } }) => {
        const max = withdrawableProceeds
        if (withdrawableProceeds == 0) {
            setVal("0")
        } else if ((event.target.value as unknown as number) > 0) {
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
            message: "Withdraw Complete!",
            title: "Transaction Notification",
            position: "topR",
        })
        initData()
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
                    <input
                        maxLength={21 - (decimals || 6)}
                        type="number"
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
