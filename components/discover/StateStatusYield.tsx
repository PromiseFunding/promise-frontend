import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress"
import styles from "../../styles/Home.module.css"
import { styled } from "@mui/material/styles"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { milestone, propType, milestoneSummary, propTypeFundCard } from '../../config/types';
import { useState, useEffect } from 'react';
import { abi } from "../../constants"
import { BigNumber } from "ethers"
import { tokenConfig } from "../../config/token-config"
import { ref, get } from "firebase/database"
import { database } from "../../firebase-config"
import { states } from "../../config/helper-config"
import { formatDuration, convertSeconds } from '../../utils/utils';

export default function StateStatusYield(props: propType) {
    const fundAddress = props.fundAddress
    const format = props.format
    const fundSummary = props.fundSummary
    const funderSummary = props.funderSummaryYield
    const decimals = props.decimals
    const coinName = props.coinName

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
    const [tranche, setTranche] = useState(0)
    const [state, setState] = useState(0)
    const [amountRaisedMilestone, setAmountRaisedMilestone] = useState(0)
    const [amountRaisedTotal, setAmountRaisedTotal] = useState(0)
    const [amountRaisedPre, setAmountRaisedPre] = useState(0)
    const [withdrawableAmount, setWithdrawableAmount] = useState(0)
    const [asset, setAsset] = useState("")
    const [userAddress, setUserAddress] = useState("")
    const [timeLeftVoting, setTimeLeftVoting] = useState(0)
    const [votesTried, setVotesTried] = useState(0)


    const getMilestoneName = async () => {
        const milestonesRef = ref(database, chainId + "/funds/" + fundAddress + "/milestones/" + tranche + "/name")
        const snapshot = await get(milestonesRef)
        setMilestoneName(snapshot.val())
    }

    const {
        runContractFunction: getMilestoneSummary,
    } = useWeb3Contract({
        abi: abi,
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
            const roundDuration = tranchesFromCall[currentTrancheFromCall].milestoneDuration
            const percent = (roundDuration!.toNumber() - timeLeftFromCall.toNumber()) / roundDuration!.toNumber() * 100
            setPercent(percent)
        }
        settotalActiveFunded(
            +(
                totalActiveFunded.toNumber() /
                10 ** tokenConfig[chainIdNum][coinName].decimals!
            ).toFixed(2)
        )
        settotalActiveInterestFunded(
            +(
                totalActiveInterestFunded.toNumber() /
                10 ** tokenConfig[chainIdNum][coinName].decimals!
            ).toFixed(2)
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
            const amountFundedFromCall = funderSummary!.fundAmount.toNumber()
            setWithdrawableAmount(amountFundedFromCall / 10 ** decimals!)
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
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === "light" ? "green" : "green",
        },
    }));

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
                                    Amount You Can Withdraw {totalLifetimeFunded}:
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
                                Amount You Can Withdraw {withdrawableAmount}:
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}
