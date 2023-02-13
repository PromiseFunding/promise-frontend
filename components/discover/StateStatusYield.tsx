import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress"
import styles from "../../styles/Home.module.css"
import { styled } from "@mui/material/styles"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { propType, fundSummary, propTypeFundCard } from "../../config/types"
import { useState, useEffect } from "react"
import { abi, yieldAbi } from "../../constants"
import { BigNumber } from "ethers"
import { tokenConfig } from "../../config/token-config"
import { ethers } from "ethers";
import { DEFAULT_CHAIN_ID } from "../../config/helper-config"


export default function StateStatusYield(props: propType) {
    const fundAddress = props.fundAddress
    const format = props.format
    const fundSummary = props.fundSummary
    const funderSummary = props.funderSummaryYield
    const decimals = props.decimals
    const coinName = props.coinName
    const title = props.yieldFundTitle

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId: string = chainIdHex ? parseInt(chainIdHex!).toString() : DEFAULT_CHAIN_ID
    const chainIdNum = parseInt(chainId!)

    const rpcUrl = chainId == "421613" ? process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_RPC_URL : "http://localhost:8545"
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const signer = provider

    const [totalActiveFunded, settotalActiveFunded] = useState(0)
    const [interestProceeds, setInterestProceeds] = useState(0)
    const [totalActiveInterestFunded, settotalActiveInterestFunded] = useState(0)
    const [totalLifetimeFunded, settotalLifetimeFunded] = useState(0)
    const [totalLifetimeStraightFunded, settotalLifetimeStraightFunded] = useState(0)
    const [totalLifetimeInterestFunded, settotalLifetimeInterestFunded] = useState(0)
    const [amountWithdrawnByOwner, setamountWithdrawnByOwner] = useState(0)
    const [asset, setAsset] = useState("")
    const [userAddress, setUserAddress] = useState("")
    const [percent, setPercent] = useState(0)
    const [owner, setOwner] = useState("")
    const [lockTime, setLockTime] = useState(0)
    const [withdrawableAmount, setWithdrawableAmount] = useState(0)
    const [totalStraightFunderAmount, setTotalStraightFunderAmount] = useState(0)
    const [entryTime, setEntryTime] = useState(0)
    const [ownerWithdrawResult, setownerWithdrawResult] = useState(0)

    const getFundSummary = async () => {
        const contract = new ethers.Contract(fundAddress, yieldAbi as any[], signer)

        const getResult = async () => {
            const result = await contract.getFundSummary()
            return result
        }

        return getResult()
    }

    async function updateUI() {
        const fundInfo = (fundSummary ? fundSummary : await getFundSummary()) as fundSummary
        const totalActiveFunded = fundInfo.totalActiveFunded
        const totalActiveInterestFunded = fundInfo.totalActiveInterestFunded
        const totalLifetimeFunded = fundInfo.totalLifetimeFunded
        const totalLifetimeStraightFunded = fundInfo.totalLifetimeStraightFunded
        const totalLifetimeInterestFunded = fundInfo.totalLifetimeInterestFunded
        const totalWithdrawnByOwner = fundInfo.totalWithdrawnByOwner
        const lockTime = fundInfo.i_lockTime
        const withdrawableProceeds = fundInfo.withdrawableInterestProceeds
        setLockTime(lockTime.toNumber())
        setOwner(fundInfo.owner.toLowerCase())
        const assetAddressFromCall = fundInfo.assetAddress
        const coinName = getAssetName(assetAddressFromCall!)
        setAsset(coinName)
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
                10 ** tokenConfig[chainIdNum][coinName].decimals!
            ).toFixed(decimals)
        )
        setInterestProceeds(
            +(
                withdrawableProceeds.toNumber() /
                10 ** tokenConfig[chainIdNum][coinName].decimals!
            ).toFixed(decimals)
        )
        settotalActiveInterestFunded(
            +(
                totalActiveInterestFunded.toNumber() /
                10 ** tokenConfig[chainIdNum][coinName].decimals!
            ).toFixed(decimals)
        )
        settotalLifetimeFunded(
            +(
                totalLifetimeFunded.toNumber() /
                10 ** tokenConfig[chainIdNum][coinName].decimals!
            ).toFixed(2)
        )
        settotalLifetimeStraightFunded(
            +(
                totalLifetimeStraightFunded.toNumber() /
                10 ** tokenConfig[chainIdNum][coinName].decimals!
            ).toFixed(2)
        )
        settotalLifetimeInterestFunded(
            +(
                totalLifetimeInterestFunded.toNumber() /
                10 ** tokenConfig[chainIdNum][coinName].decimals!
            ).toFixed(2)
        )
        setamountWithdrawnByOwner(
            +(
                totalWithdrawnByOwner.toNumber() /
                10 ** tokenConfig[chainIdNum][coinName].decimals!
            ).toFixed(2)
        )
        if (format != "discover") {
            const amountFundedFromCall = funderSummary!.amountWithdrawable.toNumber()
            setWithdrawableAmount(+(amountFundedFromCall / 10 ** decimals!).toFixed(decimals))
            const amountTotalFundedFromCall = funderSummary!.amountStraightTotal.toNumber()
            setTotalStraightFunderAmount(amountTotalFundedFromCall / 10 ** decimals!)
            const entryTimeFromCall = funderSummary!.entryTime.toNumber()
            setEntryTime(entryTimeFromCall)
        }
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
        if (fundAddress) {
            updateUI()
        }
    }, [isWeb3Enabled, fundAddress, fundSummary, funderSummary])

    useEffect(() => {
        if (account) {
            setUserAddress(account.toLowerCase())
        }
    }, [account])

    return (
        <div className={styles.stateStatus}>
            {format == "discover" ? (
                <>
                    <div style={{ fontWeight: "500", fontSize: "15px" }}>
                        <b style={{ color: "green" }}>
                            {totalLifetimeFunded.toLocaleString("en-US")}
                        </b>{" "}
                        {asset} Pledged
                    </div>
                    <br></br>
                </>
            ) : (
                <>
                    {userAddress == owner ? (
                        <>
                            <div>
                                <div
                                    style={{ fontWeight: "400", fontSize: "40px", color: "green" }}
                                >
                                    {totalLifetimeFunded.toLocaleString("en-US")}
                                </div>
                                <div style={{ fontWeight: "700" }}>
                                    {coinName} Total Pledged to {title}
                                </div>
                                <br></br>
                                <div
                                    style={{
                                        marginTop: "10px",
                                        marginBottom: "10px",
                                        textAlign: "center",
                                    }}
                                >
                                    Amount You Can Withdraw: <br></br>
                                    <b
                                        style={{
                                            color: "green",
                                            fontWeight: "500",
                                            fontSize: "20px",
                                        }}
                                    >
                                        {Math.round(
                                            (interestProceeds +
                                                totalActiveFunded -
                                                totalActiveInterestFunded) *
                                                10 ** decimals!
                                        ) /
                                            10 ** decimals!}{" "}
                                    </b>
                                    {coinName}
                                </div>
                            </div>
                        </>
                    ) : withdrawableAmount > 0 ? (
                        <>
                            <div style={{ fontWeight: "400", fontSize: "40px", color: "green" }}>
                                {totalLifetimeFunded.toLocaleString("en-US")}
                            </div>
                            <div style={{ fontWeight: "700" }}>
                                {coinName} Total Pledged to {title}
                            </div>
                            <br></br>
                            <div
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    textAlign: "center",
                                }}
                            >
                                Amount You Have In Interest Method:
                                <br></br>
                                <b style={{ color: "green", fontWeight: "500", fontSize: "20px" }}>
                                    {withdrawableAmount}
                                </b>{" "}
                                {coinName}
                            </div>
                        </>
                    ) : totalStraightFunderAmount > 0 ? (
                        <>
                            <div style={{ fontWeight: "400", fontSize: "40px", color: "green" }}>
                                {totalLifetimeFunded.toLocaleString("en-US")}
                            </div>
                            <div style={{ fontWeight: "700" }}>
                                {coinName} Total Pledged to {title}
                            </div>
                            <br></br>
                            <div
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    textAlign: "center",
                                }}
                            >
                                Amount You Have Straight Donated:
                                <br></br>
                                <b style={{ color: "green", fontWeight: "500", fontSize: "20px" }}>
                                    {totalStraightFunderAmount}
                                </b>{" "}
                                {coinName}
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontWeight: "400", fontSize: "40px", color: "green" }}>
                                {totalLifetimeFunded.toLocaleString("en-US")}
                            </div>
                            <div style={{ fontWeight: "700" }}>
                                {coinName} Total Pledged to {title}
                            </div>
                            <br></br>
                            <div
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    textAlign: "center",
                                }}
                            >
                                Donating Is Just A Click Away!
                                <br></br>
                                Check Out The Donation Options Below!
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}
