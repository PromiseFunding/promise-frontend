import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import styles from "../../styles/Home.module.css"
import { styled } from '@mui/material/styles';
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

export default function StateStatus(props: propType) {
    const fundAddress = props.fundAddress
    const milestoneInfo = props.milestoneSummary!
    const format = props.format

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainIdNum = parseInt(chainIdHex!)
    const chainId: string = parseInt(chainIdHex!).toString()
    const [percent, setPercent] = useState(0)
    const [tranche, setTranche] = useState(0)
    const [state, setState] = useState(0)
    const [amountRaisedMilestone, setAmountRaisedMilestone] = useState(0)
    const [amountRaisedTotal, setAmountRaisedTotal] = useState(0)
    const [amountRaisedPre, setAmountRaisedPre] = useState(0)
    const [asset, setAsset] = useState("")
    const [milestoneName, setMilestoneName] = useState("")
    const [timeLeft, setTimeLeft] = useState(0)
    const [preFundingEnd, setPreFundingEnd] = useState(0)
    const [roundEnd, setRoundEnd] = useState(0)


    const getMilestoneName = async () => {
        const milestonesRef = ref(database, chainId + "/funds/" + fundAddress + "/milestones/" + tranche + "/name")
        const snapshot = await get(milestonesRef)
        setMilestoneName(snapshot.val())
    }

    const {
        runContractFunction: getTimeLeftRound,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getTimeLeftRound",
        params: {},
    })

    async function updateUI() {
        const tranchesFromCall = milestoneInfo.milestones
        const currentTrancheFromCall = milestoneInfo.currentTranche
        setTranche(currentTrancheFromCall!)
        const currentStateFromCall = milestoneInfo.state
        setState(currentStateFromCall!)
        await getMilestoneName()
        const timeLeftFromCall = milestoneInfo.timeLeftRound
        setTimeLeft(timeLeftFromCall.toNumber())
        if (currentStateFromCall == 4) {
            const roundDuration = milestoneInfo.preFundingDuration
            const percent = (roundDuration!.toNumber() - timeLeftFromCall.toNumber()) / roundDuration!.toNumber() * 100
            setPercent(percent)
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
        setAsset(coinName)
        setAmountRaisedMilestone(+(amountRaisedFromCall!.toNumber() / 10 ** tokenConfig[chainIdNum][coinName].decimals!).toFixed(2))
        setAmountRaisedTotal(+(amountRaisedTotalFromCall!.toNumber() / 10 ** tokenConfig[chainIdNum][coinName].decimals!).toFixed(2))
        // props.onChangeAmount!(+(amountRaisedTotalFromCall!.toNumber() / 10 ** tokenConfig[chainIdNum][coinName].decimals!).toFixed(2))
        setAmountRaisedPre(+(amountRaisedPreFromCall!.toNumber() / 10 ** tokenConfig[chainIdNum][coinName].decimals!).toFixed(2))
        setPreFundingEnd(milestoneInfo.preFundingEnd.toNumber())
        setRoundEnd(milestoneInfo.roundEnd.toNumber())
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
        if (isWeb3Enabled && fundAddress) {
            updateUI()
        }
    }, [isWeb3Enabled, fundAddress, milestoneInfo])

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? 'green' : 'green',
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

                        The fundraiser will accept seed donations until {convertSeconds(preFundingEnd)}
                        <div style={{ marginTop: "10px", marginBottom: "10px", textAlign: "center" }}>
                            <BorderLinearProgress sx={{ height: "20px", borderRadius: "30px" }} variant="determinate" value={percent} />
                            <div style={{ fontSize: "10px" }}>Seed round progress</div>
                        </div>
                    </>)
                    :
                    (<>Milestone {tranche + 1}: <b>{milestoneName}</b>
                        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                            <BorderLinearProgress sx={{ height: "20px", borderRadius: "30px" }} variant="determinate" value={percent} />
                            <div style={{ fontSize: "10px" }}>milestone progress</div>
                        </div>                        {amountRaisedTotal.toLocaleString("en-US")} {asset} Raised
                        The fundraiser will accept donations for this milestone until {convertSeconds(roundEnd)}
                    </>)}
            </div>)}

        </div>
    )
}
