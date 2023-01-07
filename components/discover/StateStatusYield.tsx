import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress"
import styles from "../../styles/Home.module.css"
import { styled } from "@mui/material/styles"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { propType, fundSummary, propTypeFundCard } from "../../config/types"
import { useState, useEffect } from "react"
import { abi, YieldFundFactory } from "../../constants"
import { BigNumber } from "ethers"
import { tokenConfig } from "../../config/token-config"
import { ref, get } from "firebase/database"
import { database } from "../../firebase-config"
import { formatDuration, convertSeconds } from "../../utils/utils"

export default function StateStatusYield(props: propType) {
    const fundAddress = props.fundAddress
    const [fundInfo, setFundInfo] = useState(props.fundSummary!)
    const format = props.format

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainIdNum = parseInt(chainIdHex!)
    const chainId: string = parseInt(chainIdHex!).toString()
    const [totalActiveFunded, settotalActiveFunded] = useState(0)
    const [totalActiveInterestFunded, settotalActiveInterestFundeded] = useState(0)
    const [totalLifetimeFunded, settotalLifetimeFunded] = useState(0)
    const [totalLifetimeStraightFunded, settotalLifetimeStraightFunded] = useState(0)
    const [totalLifetimeInterestFunded, settotalLifetimeInterestFunded] = useState(0)
    const [amountWithdrawnByOwner, setamountWithdrawnByOwner] = useState(0)
    const [asset, setAsset] = useState("")
    const [userAddress, setUserAddress] = useState("")


    const { runContractFunction: getFundSummary } = useWeb3Contract({
        abi: YieldFundFactory,
        contractAddress: fundAddress!,
        functionName: "getFundSummary",
        params: {},
    })

    async function updateUI() {
        const totalActiveFunded = fundInfo.totalActiveFunded
        const totalActiveInterestFunded = fundInfo.totalActiveInterestFunded
        const totalLifetimeFunded = fundInfo.totalLifetimeFunded
        const totalLifetimeStraightFunded = fundInfo.totalLifetimeStraightFunded
        const totalLifetimeInterestFunded = fundInfo.totalLifetimeInterestFunded
        const amountWithdrawnByOwner = fundInfo.amountWithdrawnByOwner
        settotalActiveFunded(totalActiveFunded.toNumber())
        settotalActiveInterestFundeded(totalActiveInterestFunded.toNumber())
        settotalLifetimeFunded(totalLifetimeFunded.toNumber())
        settotalLifetimeStraightFunded(totalLifetimeStraightFunded.toNumber())
        settotalLifetimeInterestFunded(totalLifetimeInterestFunded.toNumber())
        setamountWithdrawnByOwner(amountWithdrawnByOwner.toNumber())
        // const assetAddressFromCall = fundInfo.assetAddress
        // const coinName = getAssetName(assetAddressFromCall!)
        // setAsset(coinName)
    }

    const getAssetName = (address: string) => {
        for (const coin in tokenConfig[chainIdNum]) {
            if (tokenConfig[chainIdNum][coin].assetAddress == address) {
                return coin
            }
        }
        return ""
    }

    useEffect(() => {
        async function fetchData() {
            if (format == "discover") {
                setFundInfo((await getFundSummary()) as fundSummary)
            }
        }

        if (isWeb3Enabled && fundAddress && fundInfo) {
            updateUI()
        }
        fetchData()
    }, [isWeb3Enabled, fundAddress, fundInfo])

    useEffect(() => {
        if (account) {
            setUserAddress(account.toLowerCase())
        }
    }, [account])

    return (
        <div className={styles.stateStatus}>
            {format == "discover" ? (
                <div>
                    <>
                        {totalLifetimeFunded.toLocaleString("en-US")} {asset} Lifetime Raised
                        {totalLifetimeStraightFunded.toLocaleString("en-US")} {asset} Donated Straight
                        {totalLifetimeInterestFunded.toLocaleString("en-US")} {asset} Donated To Interest Pool
                    </>
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}
