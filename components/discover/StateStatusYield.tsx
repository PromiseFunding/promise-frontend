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
    const [totalFunderAmount, setTotalFunderAmount] = useState(0)
    const [entryTime, setEntryTime] = useState(0)

    const getFundSummary = async () => {
        const contract = new ethers.Contract(fundAddress, yieldAbi as any[], signer)

        const getResult = async () => {
            const result = await contract.getFundSummary()
            return result
        }

        return getResult()
    }

    async function updateUI() {
        const fundInfo = await getFundSummary() as fundSummary

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
            setWithdrawableAmount(amountFundedFromCall / 10 ** decimals!)
            const amountTotalFundedFromCall = funderSummary!.amountTotal.toNumber()
            setTotalFunderAmount(amountTotalFundedFromCall / 10 ** decimals!)
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

    // const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    //     height: 10,
    //     borderRadius: 0,
    //     [`&.${linearProgressClasses.colorSecondary}`]: {
    //         backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    //     },
    //     [`& .${linearProgressClasses.bar}`]: {
    //         backgroundColor: theme.palette.mode === "light" ? "lightgreen" : "yellow",
    //     },
    // }))

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
                    {/* <Tooltip
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
                        </Tooltip> */}
                    <br></br>
                </>
            ) : (
                <>
                    {userAddress == owner ? (
                        <>
                            <div>
                                <div
                                    style={{
                                        marginTop: "10px",
                                        marginBottom: "10px",
                                        textAlign: "center",
                                    }}
                                >
                                    Amount You Can Withdraw{" "}
                                    {interestProceeds +
                                        totalActiveFunded -
                                        totalActiveInterestFunded}{" "}
                                    {coinName}:
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    textAlign: "center",
                                }}
                            >
                                Amount You Can Withdraw {withdrawableAmount} {coinName}:
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}
