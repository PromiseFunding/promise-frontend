import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress"
import styles from "../../styles/Home.module.css"
import { styled } from "@mui/material/styles"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { propType, fundSummary, propTypeFundCard } from "../../config/types"
import { useState, useEffect } from "react"
import { abi, yieldAbi } from "../../constants"
import { BigNumber } from "ethers"
import { tokenConfig } from "../../config/token-config"
import { ref, get } from "firebase/database"
import { database } from "../../firebase-config"
import { formatDuration, convertSeconds } from "../../utils/utils"
import Tooltip from "@mui/material/Tooltip"

export default function StateStatusYield(props: propType) {
    const fundAddress = props.fundAddress
    const [fundInfo, setFundInfo] = useState(props.fundSummary!)
    const format = props.format

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainIdNum = parseInt(chainIdHex!)
    const chainId: string = parseInt(chainIdHex!).toString()
    const [totalActiveFunded, settotalActiveFunded] = useState(0)
    const [totalActiveInterestFunded, settotalActiveInterestFunded] = useState(0)
    const [totalLifetimeFunded, settotalLifetimeFunded] = useState(0)
    const [totalLifetimeStraightFunded, settotalLifetimeStraightFunded] = useState(0)
    const [totalLifetimeInterestFunded, settotalLifetimeInterestFunded] = useState(0)
    const [amountWithdrawnByOwner, setamountWithdrawnByOwner] = useState(0)
    const [asset, setAsset] = useState("")
    const [userAddress, setUserAddress] = useState("")
    const [percent, setPercent] = useState(0)

    const { runContractFunction: getFundSummary } = useWeb3Contract({
        abi: yieldAbi,
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
        if (totalLifetimeFunded.toNumber() == 0) {
            setPercent(0)
        } else {
            //percent equals how much was straight donated
            const percent =
                ((totalLifetimeFunded!.toNumber() - totalLifetimeInterestFunded!.toNumber()) /
                    totalLifetimeFunded!.toNumber()) *
                100
            setPercent(percent)
        }
        settotalActiveFunded(
            +(
                totalActiveFunded.toNumber() /
                10 ** tokenConfig[chainIdNum]["USDC"].decimals!
            ).toFixed(2)
        )
        settotalActiveInterestFunded(
            +(
                totalActiveInterestFunded.toNumber() /
                10 ** tokenConfig[chainIdNum]["USDC"].decimals!
            ).toFixed(2)
        )
        settotalLifetimeFunded(
            +(
                totalLifetimeFunded.toNumber() /
                10 ** tokenConfig[chainIdNum]["USDC"].decimals!
            ).toFixed(2)
        )
        settotalLifetimeStraightFunded(
            +(
                totalLifetimeStraightFunded.toNumber() /
                10 ** tokenConfig[chainIdNum]["USDC"].decimals!
            ).toFixed(2)
        )
        settotalLifetimeInterestFunded(
            +(
                totalLifetimeInterestFunded.toNumber() /
                10 ** tokenConfig[chainIdNum]["USDC"].decimals!
            ).toFixed(2)
        )
        // setamountWithdrawnByOwner(+(amountWithdrawnByOwner!.toNumber()/ 10 ** tokenConfig[chainIdNum]["USDC"].decimals!).toFixed(2))
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

    async function fetchData() {
        if (format == "discover") {
            setFundInfo((await getFundSummary()) as fundSummary)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress && fundInfo) {
            updateUI()
        }
        if (isWeb3Enabled && fundAddress && !fundInfo) {
            fetchData()
        }
    }, [isWeb3Enabled, fundAddress, fundInfo])

    useEffect(() => {
        if (account) {
            setUserAddress(account.toLowerCase())
        }
    }, [account])

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 0,
        [`&.${linearProgressClasses.colorSecondary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            backgroundColor: theme.palette.mode === "light" ? "lightgreen" : "yellow",
        },
    }))

    return (
        <div className={styles.stateStatus}>
            {format == "discover" ? (
                <>
                    <div>
                        <>
                            <div style={{ fontWeight: "500" }}>
                                {totalLifetimeFunded.toLocaleString("en-US")} {asset} USDC Lifetime
                                Raised
                            </div>
                            <BorderLinearProgress variant="determinate" value={percent} />
                            <div style={{ color: "lightgreen", fontWeight: "500" }}>
                                {totalLifetimeStraightFunded.toLocaleString("en-US")} {asset}{" "}
                                USDC Straight Donated
                            </div>
                            <div style={{ color: "lightblue", fontWeight: "500" }}>
                                {totalLifetimeInterestFunded.toLocaleString("en-US")} {asset}{" "}
                                USDC &apos;Lossless&apos; Donated
                            </div>
                        </>
                    </div>
                    {/* <div>
                        <div style={{ fontWeight: "500" }}>
                            {totalLifetimeFunded.toLocaleString("en-US")} {asset} Lifetime Raised
                        </div>
                        <Tooltip
                            title={
                                <>
                                    <div>
                                        <>
                                            <div style={{ color: "lightgreen" }}>
                                                {totalLifetimeStraightFunded.toLocaleString(
                                                    "en-US"
                                                )}{" "}
                                                {asset} Straight Donated
                                            </div>
                                            <div style={{ color: "lightblue" }}>
                                                {totalLifetimeInterestFunded.toLocaleString(
                                                    "en-US"
                                                )}{" "}
                                                {asset} &apos;Lossless&apos; Donated
                                            </div>
                                        </>
                                    </div>
                                </>
                            }
                            placement="right"
                            arrow
                        >
                            <BorderLinearProgress variant="determinate" value={percent} />
                        </Tooltip>
                        <br></br>
                    </div> */}
                </>
            ) : (
                <></>
            )}
        </div>
    )
}
