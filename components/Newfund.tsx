import { contractAddresses, erc20Abi, FundFactory } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { Dropdown, useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { BigNumber, ethers, ContractTransaction } from "ethers"
import { sendError } from "next/dist/server/api-utils"
import { networkConfig } from "../config/helper-config"
import { tokenConfig } from "../config/token-config"
import { contractAddressesInterface } from "../config/types"

//contract is already deployed... trying to look at features of contract
export default function NewFund() {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    //fundaddress will be for factory pattern here
    const fundAddress =
        chainId in addresses
            ? addresses[chainId]["YieldFundAAVE"][addresses[chainId]["YieldFundAAVE"].length - 1]
            : null

    const yieldAddress =
        chainId in addresses
            ? addresses[chainId]["FundFactory"][addresses[chainId]["FundFactory"].length - 1]
            : null
    //TODO: get helper-config working instead!... gets rid of decimal function
    const chainIdNum = parseInt(chainIdHex!)

    const decimals = chainId in addresses ? networkConfig[chainIdNum].decimals : null

    //const tokenAddress = chainId in addresses ? tokenConfig[chainIdNum]["USDC"].assetAddress : null

    // const poolAddress = chainId in addresses ? networkConfig[chainIdNum].poolAddress : null

    const [time, setTime] = useState("")

    const [assetValue, setAssetValue] = useState("USDC")

    const [assetAddy, setAssetAddy] = useState("")

    const [poolAddy, setPoolAddy] = useState("")

    const [aaveAddy, setAaveAddy] = useState("")

    const dispatch = useNotification()

    const handleSuccess = async function () {
        // const fundTx: any = await create()
        // try {
        //     await createTx.wait(1)
        //     handleNewNotification()
        // } catch (error) {
        //     console.log(error)
        //    handleNewNotification1()
        // }
    }

    const {
        runContractFunction: createYieldFundAAVE,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: FundFactory,
        contractAddress: yieldAddress!,
        functionName: "createYieldFundAAVE",
        params: {
            lockTime: time,
            assetAddress: assetAddy,
            aaveTokenAddress: aaveAddy,
            poolAddress: poolAddy,
        },
    })

    useEffect(() => {
        if (isWeb3Enabled && yieldAddress) {
            handleChangeDetails()
        }
    }, [assetValue])

    const handleChangeAsset = (event: any) => {
        setAssetValue(event.target.value)
    }

    const handleChangeDetails = () => {
        const tokenAddress =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].assetAddress : null
        const poolAddress =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].poolAddress : null
        const aaveAddress =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].aaveTokenAddress : null

        setAssetAddy(tokenAddress!)
        setPoolAddy(poolAddress!)
        setAaveAddy(aaveAddress!)
    }

    const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
        //max for now is 20 years
        const max = 630720000
        if ((event.target.value as unknown as number) > 0) {
            const value = Math.max(
                0,
                Math.min(max as number, Number(Number(event.target.value).toFixed(0)))
            )
            setTime(value.toString())
        } else {
            setTime("0")
        }
    }

    //Locktime, assetaddress, aaveAddress, poolAddress

    return (
        <div className="p-5">
            Depositing To Contract
            {isWeb3Enabled && yieldAddress ? (
                <div className="">
                    <div>Enter Locktime (in seconds)</div>
                    <input
                        maxLength={21 - (decimals || 6)}
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0 seconds"
                        id="message"
                        name="Locktime"
                        onChange={handleChange}
                        value={time}
                        autoComplete="off"
                    />
                    <br></br>
                    <br></br>
                    <div>
                        Choose Asset
                        <select id="assetName" onChange={handleChangeAsset}>
                            <option value="USDC">USDC</option>
                            <option value="USDT">USDT</option>
                            <option value="DAI">DAI</option>
                            <option value="WETH">WETH</option>
                        </select>
                    </div>
                    <br></br>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await createYieldFundAAVE()
                        }}
                    >
                        <div>Create New Fundraise</div>
                    </button>
                </div>
            ) : (
                <div>No Create Yield Address Detected</div>
            )}
        </div>
    )
}
