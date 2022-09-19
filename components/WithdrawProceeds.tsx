import { contractAddresses, abi, erc20Abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { Dropdown, useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { BigNumber, ethers, ContractTransaction } from "ethers"
import { sendError } from "next/dist/server/api-utils"
import { networkConfig } from "../helper-config"

interface contractAddressesInterface {
    [key: string]: { YieldFund: string[] }
}

export default function WithdrawProceeds() {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const fundAddress = chainId in addresses ? addresses[chainId]["YieldFund"][0] : null
    const [owner, setOwner] = useState("0")
    const [userAddress, setAddress] = useState("0")

    const chainIdNum = parseInt(chainIdHex!)

    const decimals = chainId in addresses ? networkConfig[chainIdNum].decimals : null
    const [fundAmount, setFundAmount] = useState()

    const [val, setVal] = useState("")

    const dispatch = useNotification()

    const {
        runContractFunction: withdrawProceeds,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!, // specify the networkId
        functionName: "withdrawProceeds",
        params: { amount: BigNumber.from((Number(val) * 10 ** decimals!).toString()) },
    })

    const { runContractFunction: getOwner } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getOwner",
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

    const initData = async function () {
        if (isWeb3Enabled) {
            console.log("test1")
            const ownerFromCall = await getOwner()
            console.log(`Owner from call: ${ownerFromCall}`)
            setOwner((ownerFromCall as string).toLowerCase())
            console.log(owner)
        }
    }

    // Gets called only on load.
    useEffect(() => {
        initData()
    }, [isWeb3Enabled])

    useEffect(() => {
        if (account) {
            setAddress(account.toLowerCase())
        }
    }, [account])

    const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
        setVal(event.target.value)
        console.log("value is:", event.target.value)
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
            message: "Donation Failed!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    return (
        <div className="p-5">
            {" "}
            {isWeb3Enabled && owner == userAddress ? (
                <div>You're the Owner {owner}</div>
            ) : (
                <div>Not Owner</div>
            )}{" "}
        </div>
    )
}
