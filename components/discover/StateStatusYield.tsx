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
    const funderSummary = props.funderSummary

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainIdNum = parseInt(chainIdHex!)
    const chainId: string = parseInt(chainIdHex!).toString()
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
        const amountWithdrawnByOwner = fundInfo.amountWithdrawnByOwner
        if (totalLifetimeFunded.toNumber() == 0) {
            setPercent(0)
        } else {
            const roundDuration = tranchesFromCall[currentTrancheFromCall].milestoneDuration
            const percent = (roundDuration!.toNumber() - timeLeftFromCall.toNumber()) / roundDuration!.toNumber() * 100
            setPercent(percent)
        }
        const amountRaisedFromCall = tranchesFromCall[currentTrancheFromCall].totalRaised
        const amountRaisedTotalFromCall = milestoneInfo.lifeTimeRaised
        const amountRaisedPreFromCall = milestoneInfo.preTotalFunds
        const assetAddressFromCall = milestoneInfo.assetAddress
        const coinName = getAssetName(assetAddressFromCall!)
        const votesTriedFromCall = milestoneInfo.votesTried
        setOwner(milestoneInfo.owner.toLowerCase())
        setAsset(coinName)
        setAmountRaisedMilestone(+(amountRaisedFromCall!.toNumber() / 10 ** tokenConfig[chainIdNum][coinName].decimals!).toFixed(2))
        setAmountRaisedTotal(+(amountRaisedTotalFromCall!.toNumber() / 10 ** tokenConfig[chainIdNum][coinName].decimals!).toFixed(2))
        // props.onChangeAmount!(+(amountRaisedTotalFromCall!.toNumber() / 10 ** tokenConfig[chainIdNum][coinName].decimals!).toFixed(2))
        setAmountRaisedPre(+(amountRaisedPreFromCall!.toNumber() / 10 ** tokenConfig[chainIdNum][coinName].decimals!).toFixed(2))
        setPreFundingEnd(milestoneInfo.preFundingEnd.toNumber())
        setRoundEnd(milestoneInfo.roundEnd.toNumber())
        setTimeLeftVoting(milestoneInfo.timeLeftVoting.toNumber())
        setVotesTried(votesTriedFromCall.toNumber())
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
                <div>
                    {state == 4 ? (
                        <>Seed Funding Round
                            <BorderLinearProgress variant="determinate" value={percent} />
                            {amountRaisedPre.toLocaleString("en-US")} {asset} Raised
                        </>)
                        :
                        (<>Milestone {tranche + 1}: <b>{milestoneName}</b>
                            <BorderLinearProgress variant="determinate" value={percent} />
                            {amountRaisedTotal.toLocaleString("en-US")} {asset} Raised
                            <br></br>
                        </>)}
                </div>
            ) : (<div>
                {state == 4 ? (
                    <>
                        <div style={{ marginBottom: "10px" }}>
                            <b style={{ fontSize: "40px", color: "green", fontWeight: "400" }}>{amountRaisedPre.toLocaleString("en-US")}</b>
                            <div style={{ fontWeight: "700" }}>{asset} Raised</div>
                        </div>
                        {timeLeft > 0 ? (
                            <div>
                                The fundraiser will accept seed donations until {convertSeconds(preFundingEnd)}
                            </div>
                        ) : (
                            <div>
                                {owner == userAddress ? `The seed funding round ended ${convertSeconds(preFundingEnd)}. You may now withdraw the proceeds raised.` :
                                    `The seed funding round ended ${convertSeconds(preFundingEnd)}. The fundraiser will soon start taking donations again once the owner starts the first milestone round.
                                 `}

                            </div>)}
                        <div style={{ marginTop: "10px", marginBottom: "10px", textAlign: "center" }}>
                            <BorderLinearProgress sx={{ height: "20px", borderRadius: "30px" }} variant="determinate" value={percent} />
                            <div style={{ fontSize: "10px" }}>Seed round progress</div>
                        </div>
                    </>)
                    :

                    (
                        <div>
                            {state == 3 ? (
                                <div style={{ marginBottom: "10px" }}>
                                    <b style={{ fontSize: "20px", color: "red", fontWeight: "400" }}>Fundraiser Ended.</b>
                                    {owner == userAddress ? (<div>The funders of this project have determined that you did not live up to the promises of the milestones and will now be able to withdraw their money.</div>) : (
                                        <div>
                                            The funders of this project have determined the creator did not live up to the promises made for this milestone.
                                            <div style={{ textAlign: "center", marginTop: "20px" }}>
                                                <h1 style={{ fontSize: "40px", color: "green", fontWeight: "400" }}>{withdrawableAmount.toLocaleString("en-US")} {asset}</h1>
                                                Available to withdraw
                                            </div>

                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div style={{ marginBottom: "10px" }}>
                                        <b style={{ fontSize: "40px", color: "green", fontWeight: "400" }}>{amountRaisedMilestone.toLocaleString("en-US")}</b>
                                        <div>{asset} Raised in <b>{milestoneName}</b> of <b style={{ color: "green", fontWeight: "400" }}>{amountRaisedTotal} </b> {asset} Total.
                                        </div>
                                    </div>
                                    {state == 1 ? (
                                        <h1 style={{ fontSize: "20px", color: timeLeftVoting > 172800 ? "green" : timeLeftVoting > 86400 ? "orange" : "red" }}>
                                            {timeLeftVoting > 0 ? `${formatDuration(timeLeftVoting)} left in voting period.` : "The voting period has ended. Anyone may now end the vote to process the results."}
                                        </h1>) : (
                                        <div>
                                            {state == 2 ? (
                                                <div>
                                                    {milestoneInfo.withdrawExpired && userAddress != owner.toLowerCase() ? (
                                                        <h1 style={{ fontWeight: "500", color: "red" }}>
                                                            The Creator has not withdrawn the funds in the 30 day period. Anyone may now terminate the fundraiser to release the remaining funds back to the fundraisers.
                                                        </h1>) : (
                                                        <div>
                                                            {milestoneInfo.milestones[milestoneInfo.currentTranche].activeRaised!.toNumber() ? (
                                                                <div>
                                                                    {userAddress == owner.toLowerCase() ?
                                                                        (milestoneInfo.currentTranche + 1 != milestoneInfo.milestones.length ? "Milestone vote successful! You may now withdraw the funds raised in this milestone. The next milestone will start immediately upon withdrawal." : "Milestone vote successful! You may now withdraw the final funds raised in this fundraiser. If you wish, you may add another milestone to continue the fundraiser.")
                                                                        : (milestoneInfo.currentTranche + 1 != milestoneInfo.milestones.length ? "Milestone vote successful. The next Milestone will start after the creator withdraws the funds raised." : "Milestone vote successful. The creator may now withdraw the final funds raised for the fundraiser. ")}</div>
                                                            ) : (<h1>All funds have been withdrawn, the fundraiser is complete.</h1>)

                                                            }</div>)}



                                                </div>) : (
                                                <div>
                                                    {votesTried < 1 ? (
                                                        <div>
                                                            <div style={{ marginTop: "10px", marginBottom: "10px", textAlign: "center" }}>
                                                                Milestone {tranche + 1} of {milestoneInfo.milestones.length}: <b>{milestoneName}</b>
                                                                <BorderLinearProgress sx={{ height: "20px", borderRadius: "30px" }} variant="determinate" value={percent} />
                                                                <div style={{ fontSize: "10px" }}>milestone progress</div>
                                                            </div>

                                                            The fundraiser will accept donations for this milestone until {convertSeconds(roundEnd)}
                                                        </div>) : (
                                                        <h1>The initial vote for this milestone failed. It is now eligible for a re-vote to determine the final status of the fundraiser.</h1>
                                                    )}

                                                </div>)}
                                        </div>
                                    )}

                                </div>
                            )
                            }
                        </div>
                    )
                }
            </div >)
            }

        </div >
    )
}
